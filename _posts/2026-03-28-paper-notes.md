---
layout: post
title: "Paper Notes — March 2026"
date: 2026-03-28
---

*5 selected papers from Google Scholar alerts (March 27–28, 2026). Focus: long-read genomics, epigenomics, and AI-driven protein design.*

---

## 1. LongcallD: Joint Calling and Phasing of All Variant Types from Long Reads

**Authors:** Yan Gao, Wen-Wei Liao, Qian Qin, Ira M. Hall, Heng Li (Dana-Farber / Yale / Harvard Medical School)
**Where:** bioRxiv, posted March 22, 2026
**URL:** https://www.biorxiv.org/content/10.64898/2026.03.20.713111v1

### The Problem with How We've Been Doing This

Long-read sequencing (PacBio HiFi, Oxford Nanopore) produces reads that are thousands to tens of thousands of base pairs long. Crucially, a single long read can span multiple variants simultaneously — a SNP, a nearby deletion, and a mobile element insertion might all sit within the same read. The read can then "carry" phasing information, telling you which variants are on the same chromosome (haplotype).

But here's what we've been doing in practice: treating all of this as three separate problems.

```
Long reads
    │
    ├──▶ Small variant caller (GATK / DeepVariant)
    │       → SNPs, small indels
    │
    ├──▶ SV caller (Sniffles2 / PBSV / cuteSV)
    │       → Structural variants (deletions, insertions, inversions)
    │
    ├──▶ Phasing tool (WhatsHap / HiPhase)
    │       → Haplotype assignment
    │
    └──▶ Mosaic caller (Clair-Mosaic)
            → Low-fraction somatic variants
```

Each tool has its own alignment step, its own assumptions, and they don't talk to each other. You end up with variant calls that may be inconsistent across the tools — and you completely fail to exploit the fact that one read already contains all this information.

### What LongcallD Does Differently

LongcallD uses **local multiple-sequence alignment (MSA)** on each region of the genome, operating directly on the reads covering that region. Instead of asking "what SNP is at position X?" and then separately asking "what SV is at position Y?", it builds an alignment of all reads simultaneously and reads off small variants, SVs, mobile element insertions, and phasing information in one pass.

```
All reads overlapping a region
    │
    ▼
Local multiple-sequence alignment (MSA)
    │
    ├──▶ SNPs / indels from column-level alignment consensus
    ├──▶ SVs from gaps / insertions spanning multiple columns
    ├──▶ Phase assignment from read-level patterns
    └──▶ Mosaic variants (low-allele-fraction signals)
             detected via retrotransposition hallmarks
             (target-site duplications, polyA tails)
             even in single supporting reads
```

The mosaic detection is particularly clever. Mobile element insertions (Alus, L1s) leave characteristic signatures in the read: a polyA tail at the insertion point and short target-site duplications (TSDs) flanking it. LongcallD looks for these hallmarks even when an insertion is supported by a **single read** — suggesting it's a de novo or somatic mutation rather than a germline variant.

### Why This Matters

Mosaicism — where a mutation exists in only a fraction of cells — is highly relevant in cancer, aging, and neurodegenerative diseases. It's been notoriously hard to detect. Current tools require multiple supporting reads, which means very-low-frequency mosaics (below ~5%) are invisible. LongcallD's ability to call single-read-supported mobile element insertions opens up the possibility of capturing early-stage somatic mutations.

The authors also note that their unified approach "substantially improves SV discovery and mosaic variants accuracy while maintaining competitive small variant calling" — meaning you're not trading quality on SNPs to gain on SVs. You get better across the board.

This is one command line tool written in C, so it's fast. This is exactly the kind of tool that could become the standard starting point for long-read analysis pipelines.

---

## 2. Integrating Long-Read SVs with snRNA-seq to Study Parkinson's Disease

**Authors:** Kwanho Kim, Zechuan Lin, Sean K. Simmons, Joshua Z. Levin, et al. (Broad Institute / Yale / ASAP Collaborative Research Network)
**Where:** bioRxiv, posted March 23, 2026
**URL:** https://www.biorxiv.org/content/10.64898/2026.03.20.713192v1

### Background: The GWAS Problem

Genome-wide association studies (GWAS) for Parkinson's disease (PD) have identified dozens of genomic loci associated with disease risk. But a GWAS locus is not a causal variant — it's a region in linkage disequilibrium (LD) with the actual causal variant. Most GWAS studies use short-read sequencing or genotyping arrays, which are blind to structural variants (SVs). This means any causal SV in a GWAS locus has been systematically missed.

### The Approach: 100 Brains, Two Technologies

The study generated long-read whole-genome sequencing (WGS) for **100 post-mortem brain samples** from PD patients and controls. From these, they constructed a high-confidence catalog of **74,552 SVs**. These are SVs you'd never find with short reads — large insertions, deletions, mobile element insertions, inversions, and complex rearrangements.

The same samples also had **single-nucleus RNA-seq (snRNA-seq)** from two brain regions (substantia nigra and frontal cortex). This is critical: they're asking not just "does this SV exist?" but "does this SV change how much a gene is expressed, and in which specific cell type?"

```
100 post-mortem PD brain samples
    │
    ├──▶ Long-read WGS
    │       → 74,552 SVs (high-confidence catalog)
    │       → Focus: SVs near PD GWAS loci
    │
    └──▶ snRNA-seq (2 brain regions)
            → Cell-type-specific expression profiles
            → dopaminergic neurons, astrocytes, microglia, etc.
    │
    ▼
Integration: SV-eQTL analysis
    → Which SVs correlate with gene expression changes?
    → In which cell types?

Also: Allele-specific expression (ASE)
    → Which allele of a gene is preferentially expressed
      in individuals carrying a specific SV?
```

### What They Found

Using **expression quantitative trait locus (eQTL)** analysis and **allele-specific expression (ASE)** analysis, the authors identified SVs that are significantly associated with gene expression changes — both in specific cell types and shared across multiple cell types.

The power of this design is resolution at two levels: genomic (long reads can find SVs that short reads miss) and cellular (snRNA-seq tells you which cell type is affected). A deletion that kills expression of a gene specifically in dopaminergic neurons is very different from one that affects astrocytes globally — but only this design can tell them apart.

### A Key Conceptual Point: Why SVs at GWAS Loci Matter

When a GWAS study finds an associated locus, the standard next step is fine-mapping — trying to identify which exact variant is causal. This is usually done by looking at SNPs. But if the causal variant is an SV — say, a deletion in an enhancer upstream of *SNCA* — then no amount of SNP fine-mapping will find it, because SVs and SNPs are in LD with each other and the SV is simply not in the data.

This study demonstrates a path forward: long-read WGS + snRNA-seq, applied together, can reveal the SV-level causal architecture of complex diseases at cell-type resolution.

---

## 3. ECHO: Epigenomic Profiling of the Human Repeatome with Nanopore

**Authors:** B. Poggiali, L. Putzeys, J. D. Andersen, A. Vidaki (Maastricht University Medical Centre / University of Copenhagen)
**Where:** bioRxiv, posted March 20, 2026
**URL:** https://www.biorxiv.org/content/10.64898/2026.03.18.712618v1
**Code:** https://github.com/leenput/ECHO-pipeline

### What Is the "Repeatome"?

About **50% of the human genome** is repetitive DNA. This includes:

- **SINEs** (Short Interspersed Nuclear Elements): Alu elements (~300 bp), B2 repeats
- **LINEs** (Long Interspersed Nuclear Elements): L1 elements (~6 kb), which can self-copy
- **Tandem repeats**: Short sequences repeated end-to-end (e.g., microsatellites, minisatellites)
- **Satellite DNA**: Very long tandem arrays (centromeres, pericentromeres)
- **LTR retrotransposons**: Endogenous retroviruses, HERV elements

This half of the genome was largely invisible to short-read sequencing because reads shorter than a repeat unit can't be uniquely mapped. The short-read era essentially produced genome analyses with a massive blind spot.

```
Short reads (150 bp) vs. Nanopore reads (10,000–100,000+ bp)

Repeat region: [===AAATCG===AAATCG===AAATCG===AAATCG===]

Short read:    [AAATCG]  ← could map to any of the copies
                                (unmappable or randomly placed)

Nanopore read: [===AAATCG===AAATCG===AAATCG===AAATCG===]
                ← spans the entire repeat, uniquely placed
                ← PLUS: records methylation at each base
                   (from raw ionic current signal, no bisulfite needed)
```

### The Nanopore Epigenetic Advantage

Nanopore doesn't just read sequence — it reads the electrical signal as a DNA molecule threads through the pore. Modified bases (like 5-methylcytosine or N6-methyladenine) alter the electrical signal in detectable ways. This means **methylation is a free bonus** on top of sequence: no bisulfite conversion, no separate library prep, no loss of DNA.

For the repeatome, this is powerful. Alu elements and L1s are normally silenced by heavy methylation. When that methylation is lost (as in cancer, aging, or certain syndromes), the elements can be transcribed and even re-mobilize. Now you can directly measure both the copy number / insertion polymorphisms AND the methylation state of these elements in the same sequencing run.

### What ECHO Provides

ECHO is a Snakemake-based pipeline that takes raw Nanopore sequencing data and produces:

1. **Repeat variant calls** — insertion/deletion polymorphisms within and around repeat elements
2. **Methylation profiles** — CpG methylation across all classes of repeats, per haplotype
3. **Copy number estimates** — for tandem repeat arrays
4. **Haplotype-resolved analysis** — separating the two parental copies

The Snakemake framework means it's reproducible and can run at scale on HPC clusters. The code is freely available.

Why does this matter? Many diseases are linked to repeat variation: Fragile X syndrome (CGG repeat expansion in *FMR1*), Huntington's disease (CAG expansion in *HTT*), ALS (GGGGCC expansion in *C9orf72*). ECHO provides a single tool to study all of these and more, simultaneously, from a standard nanopore WGS run.

---

## 4. VibeGen: Designing Proteins by Their Motion, Not Their Shape

**Authors:** Burak Ni, Markus J. Buehler (MIT)
**Where:** *Matter* (Cell Press), published March 24, 2026
**URL:** https://www.cell.com/matter/abstract/S2590-2385(26)00069-X

### A New Paradigm for Protein Design

The standard paradigm in computational protein design is: specify a target **structure** (3D coordinates of atoms), then find sequences that will fold into that structure. Tools like RFdiffusion, ProteinMPNN, and AlphaFold have made this workflow powerful.

But proteins are not static. A hemoglobin subunit has to flex open to bind oxygen and snap back. A viral capsid protein has to withstand mechanical stress. An enzyme's active site opens and closes with each catalytic cycle. **Function emerges from dynamics, not just from shape.**

VibeGen inverts the design question: instead of specifying a target structure, you specify how the protein should **move**.

### Normal Modes: The "Harmonics" of a Protein

Every protein vibrates around its equilibrium conformation. Like a guitar string that can vibrate at its fundamental frequency and harmonics, a protein has "normal modes" — collective motions involving all atoms.

```
Normal Mode 1 (slowest, largest amplitude):
   e.g., overall "breathing" of a domain

Normal Mode 2:
   e.g., hinge bending between two domains

Normal Mode 3:
   e.g., twisting motion

... (hundreds of modes total)
```

The amplitude of each mode tells you how much the protein moves in that "direction." VibeGen lets you specify a target profile of normal mode amplitudes — essentially saying "I want a protein that breathes a lot on mode 1 but is rigid on mode 3."

### The Dual-Agent Architecture

VibeGen uses two AI models that work together in an iterative loop:

```
Target vibrational profile (normal mode amplitudes)
    │
    ▼
┌─────────────────────────────────────────────┐
│  DESIGNER agent (language diffusion model)  │
│  Starts from random amino acid sequence     │
│  Iteratively refines toward target dynamics │
└─────────────────────────────────────────────┘
    │
    ▼ candidate sequence
┌─────────────────────────────────────────────┐
│  PREDICTOR agent                            │
│  Predicts dynamics of the candidate         │
│  sequence — will it actually vibrate        │
│  the way the designer intended?             │
└─────────────────────────────────────────────┘
    │
    ▼ feedback
Back to Designer → iterate until convergence
    │
    ▼
Final sequence: designed to exhibit target motion
Validated by full-atom molecular dynamics simulation
```

The "designer" is a **language diffusion model** — analogous to image diffusion models (like Stable Diffusion), but operating on protein sequences instead of pixels. It starts with noise (random amino acids) and denoises step by step toward a sequence predicted to match the target dynamics.

### Why This Matters

The designed proteins show **no significant similarity to natural proteins**. They are genuinely novel sequences — not just mutations of existing proteins. This expands the space of accessible protein designs beyond anything evolution has explored.

One immediate application: designing proteins with tailored mechanical properties. If you need a protein that is very flexible at one end and rigid at the other (like a scaffold for drug delivery), you can now specify exactly that. Similarly, enzyme redesign could focus on optimizing the conformational dynamics of a catalytic pocket rather than just its static geometry.

The authors validated their designs using full-atom molecular dynamics simulations, showing that the designed proteins actually adopt the prescribed vibrational profiles.

---

## 5. Minimizing Reference Bias with an Imputed Personalized Reference

**Authors:** K. Vaddadi, M. J. Lin, S. Majidian, T. Mun, B. Langmead (Johns Hopkins / Columbia)
**Where:** *Genome Research*, March 2026
**URL:** https://genome.cshlp.org/content/early/2026/03/20/gr.280989.125.abstract

### What Is Reference Bias and Why Does It Matter?

When you sequence someone's genome, you align their reads to a reference genome (e.g., GRCh38 or T2T-CHM13). The problem: if the individual has a variant at a position, reads carrying the non-reference allele are harder to align because they don't perfectly match the reference. The reference allele attracts more reads. This is **reference bias**.

```
Position in genome:    ....ATCG[T]GCTA....   (reference has T)
Individual is het:     ....ATCG[C]GCTA....   (individual has C on one copy)

Short reads:
  Reads from T allele → align perfectly (reference match)
  Reads from C allele → slight mismatch penalty → fewer reads aligned
                                                  → C allele appears rarer

Result: heterozygous variant appears homozygous reference
        → false-negative variant calls, allelic imbalance artifacts
```

This is not a minor effect. Reference bias is a systematic source of error that affects heterozygous variant calling, allele-specific expression analysis, ancestry-specific analyses (non-European populations are further from GRCh38), and population genetic statistics.

### Pangenomes Help, But Imputation Is Better

Graph genome / pangenome indexes (like those from the Human Pangenome Reference Consortium) partially solve this by including multiple haplotypes in the reference. But the best approach is a **personalized reference** — one constructed from the individual's own haplotypes.

The challenge: how do you know the individual's haplotypes before you've analyzed the data? It's circular.

The paper's solution: **imputation**. Using large reference panels (like 1000 Genomes or gnomAD), you can statistically infer the most likely haplotypes for an individual given their known or partially-known variants. You don't need deep sequencing; you can impute with array genotyping data or even low-coverage sequencing.

```
Individual's array genotype data (affordable)
    │
    ▼
Haplotype imputation (from reference panel)
    │
    ▼
Predicted personal diploid haplotypes
    │
    ▼
Build personalized diploid reference
    │
    ▼
Align sequencing reads to personal reference
    → Reduced reference bias
    → Better variant calling
    → More accurate ASE analysis
```

### The Insight

The key realization is that you don't need a perfect personalized reference — you need one that's **more similar to the individual than GRCh38 is**. Even an imputed reference with some errors will outperform the standard reference for most purposes, because most of the bias comes from common, imputable variants.

This is particularly important for **non-European populations**, where the distance from GRCh38 is larger. A Yoruban individual might have allele frequencies at thousands of positions that differ substantially from GRCh38, and every one of those sites is a potential source of reference bias. Imputed personalized references could substantially improve genomic analysis equity.

---

*These notes were generated automatically from Google Scholar alerts on March 28, 2026.*
