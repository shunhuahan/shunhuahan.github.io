---
layout: page
title: Research
permalink: /research/
description: "Research on haplotype-resolved variant calling in complex genomic regions and transposable element detection in Drosophila, by Shunhua Han."
---

My research sits at the intersection of computational method development and genomics. I build algorithms and software to detect genetic variants in regions of the genome that are too complex, repetitive, or structurally variable for standard approaches.

<div class="research-section">
<div class="research-section-header">
<h2>Haplotype-resolved variant calling in complex genomic regions</h2>
</div>
<div class="research-section-body" markdown="1">

Many important genes reside in segmental duplications or highly repetitive genomic regions where standard short-read aligners and variant callers fail. I develop targeted, haplotype-aware methods that leverage whole-genome sequencing—both short-read and long-read to produce accurate calls in these challenging loci.

**Haplotype-resolved variant calling in segmental duplications using TruPath Genome (formerly Constellation)**

TruPath Genome is an on-flowcell proximity sequencing technology. The proximity information from sequenced reads in nearby nanowells can help infer whether a group of reads belongs to the same original DNA molecule. I designed multi-region joint detection (MRJD) algorithm that can take advantage of this long-range information from TruPath Genome to produce haplotype-resolved variant calls in segmental duplications.

<figure class="research-figure">
  <img src="/images/research-mrjd-schematic.jpg" alt="MRJD algorithm schematic: joint pileups with proximity information from two paralogous regions, total copy number estimation, building individual copies, sorting into haplotypes, and outputting a phased genotype">
  <figcaption>The MRJD algorithm. Reads from two paralogous regions are jointly piled up using proximity information from nearby nanowells (1), used to estimate total copy number (2), assembled into individual gene copies (3), sorted into region- or haplotype-resolved groups (4), and output as phased genotypes (5).</figcaption>
</figure>

I presented this work as a platform talk at the 2026 ACMG Annual Clinical Genetics Meeting: *"A Rapid, Novel Approach to Rare Disease and Clinical Genetic Variant Discovery using On-flowcell Proximity Sequencing and Haplotype-resolved Variant Calling."* [[Abstract]](https://www.gimopen.org/article/S2949-7744(26)00818-6/fulltext) &nbsp;·&nbsp; [[Slides (PDF)]](/assets/han-acmg2026-trupath-slides.pdf)

**Other key projects:**

- **Alpha-thalassemia (*HBA1/2*) copy number genotyping** — Developed a targeted copy number caller for the alpha-globin locus, one of the most structurally complex and clinically important regions of the genome (~5% global carrier frequency for alpha-thalassemia). [[Blog]](https://www.illumina.com/science/genomics-research/articles/HBA-targeted-caller.html)

- **Lynch syndrome (*PMS2*) variant detection** — Improved variant calling accuracy in *PMS2*, a mismatch-repair gene with a highly similar pseudogene (*PMS2CL*) that causes widespread misalignment and false variant calls. [[Blog]](https://www.illumina.com/science/genomics-research/articles/PMS2-small-variant-detection.html)

</div>
</div>

<div class="research-section">
<div class="research-section-header">
<h2>Detecting and analyzing transposable element in Drosophila</h2>
</div>
<div class="research-section-body" markdown="1">

Transposable elements (TEs) make up nearly half the human genome and are major drivers of genomic variation. During my Ph.D., I developed computational methods to detect, characterize, and study TEs using long-read sequencing technologies in [Casey Bergman](https://bergmanlab.github.io)'s lab at the University of Georgia.

<figure class="research-figure">
  <img src="/images/research-telr-workflow.jpg" alt="TELR workflow diagram showing four stages: identifying TE insertion candidate loci from structural variant calls, assembling and polishing a local TE contig, annotating the TE and its breakpoints against the reference genome, and estimating intra-sample TE allele frequency from read depth">
  <figcaption>The TELR pipeline. Long reads are used to (1) identify candidate TE insertion loci from structural-variant calls, (2) locally assemble and polish a contig spanning the insertion, (3) annotate the TE and its breakpoints against the reference genome, and (4) estimate the insertion's intra-sample allele frequency from read depth. Figure 3 from Han <em>et al.</em> 2022, <em>Nucleic Acids Research</em>, reproduced under CC BY 4.0.</figcaption>
</figure>

**Key projects:**

- **[TELR](https://github.com/bergmanlab/TELR)** — A software pipeline for detecting non-reference TE insertions in long-read (PacBio / Oxford Nanopore) sequencing data using local assembly. TELR enables phylogenomic analysis of TE insertions at base-pair resolution. Published in *Nucleic Acids Research* (2022).

- **[ngs\_te\_mapper2](https://github.com/bergmanlab/ngs_te_mapper2)** — A cell-line authentication tool based on TE insertion profiles, used to identify *Drosophila* cell lines and detect loss of heterozygosity.

- **TE dynamics in *Drosophila* S2 cell lines** — Genomic analysis of 32 whole-genome datasets from *D. melanogaster* S2 sublines, characterizing ongoing transposition and phylogenetic relationships among laboratory cell cultures.

- ***P* element target site prediction** — Machine learning models trained on 30+ engineered features to predict *P* element insertion site preferences.

</div>
</div>


<div class="research-section">
<div class="research-section-header">
<h2>Software &amp; Resources</h2>
</div>
<div class="research-section-body" markdown="1">

| Tool | Description | Link |
|------|-------------|------|
| TELR | TE detection in long-read WGS | [GitHub](https://github.com/bergmanlab/TELR) |
| ngs_te_mapper2 | Cell-line TE profiling | [GitHub](https://github.com/bergmanlab/ngs_te_mapper2) |
| McClintock 2 | TE detector benchmarking | [GitHub](https://github.com/bergmanlab/mcclintock) |

</div>
</div>

<style>
.research-figure {
  margin: 20px 0;
  text-align: center;
}
.research-figure img {
  max-width: 100%;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
.research-figure figcaption {
  margin-top: 10px;
  font-size: 12.5px;
  line-height: 1.6;
  color: #64748b;
  text-align: left;
  padding: 0 4px;
}
html.dark .research-figure img { border-color: #334155; }
html.dark .research-figure figcaption { color: #94a3b8; }

.research-section {
  margin: 28px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.research-section-header {
  background: #2e5b9e;
  padding: 14px 24px;
}

.research-section-header h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #ffffff;
  border: none;
}

.research-section-body {
  background: #ffffff;
  padding: 20px 24px;
}

.research-section-body p:first-child { margin-top: 0; }
.research-section-body p:last-child  { margin-bottom: 0; }

/* Dark mode */
html.dark .research-section {
  border-color: #334155;
}
html.dark .research-section-header {
  background: #1e4585;
}
html.dark .research-section-body {
  background: #1e293b;
}
html.dark .research-section-body,
html.dark .research-section-body p,
html.dark .research-section-body li {
  color: #cbd5e1;
}
html.dark .research-section-body strong {
  color: #e2e8f0;
}
html.dark .research-section-body table tr {
  background-color: #1e293b;
  border-top-color: #334155;
}
html.dark .research-section-body table tr:nth-child(2n) {
  background-color: #253347;
}
html.dark .research-section-body table tr th,
html.dark .research-section-body table tr td {
  border-color: #334155;
  color: #cbd5e1;
}
</style>
