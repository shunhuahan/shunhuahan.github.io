---
layout: page
title: Research
permalink: /research/
---

My research sits at the intersection of computational method development and genomics. I build algorithms and software to detect genetic variants in regions of the genome that are too complex, repetitive, or structurally variable for standard approaches.

---

## Variant Calling in Complex Genomic Regions

Many important genes reside in segmental duplications or highly repetitive genomic regions where standard short-read aligners and variant callers fail. I develop targeted, haplotype-aware methods that leverage whole-genome sequencing—both short-read and long-read—to produce accurate calls in these challenging loci.

**TruPath Genome (formerly Constellation mapped reads)**

TruPath Genome is a sequencing and analysis approach that uses on-flowcell proximity sequencing to generate constellation mapped reads, enabling haplotype-resolved variant calling across structurally complex and paralogous gene regions. By phasing reads into haplotype-specific groups before variant calling, TruPath Genome can resolve variants that are otherwise ambiguous or undetectable with standard mapping.

I presented this work as a platform talk at the 2026 ACMG Annual Clinical Genetics Meeting: *"A Rapid, Novel Approach to Rare Disease and Clinical Genetic Variant Discovery using On-flowcell Proximity Sequencing and Haplotype-resolved Variant Calling."* [[Abstract]](https://www.gimopen.org/article/S2949-7744(26)00818-6/fulltext)

**Other key projects:**

- **Alpha-thalassemia (*HBA1/2*) copy number genotyping** — Developed a targeted copy number caller for the alpha-globin locus, one of the most structurally complex and clinically important regions of the genome (~5% global carrier frequency for alpha-thalassemia).

- **Lynch syndrome (*PMS2*) variant detection** — Improved variant calling accuracy in *PMS2*, a mismatch-repair gene with a highly similar pseudogene (*PMS2CL*) that causes widespread misalignment and false variant calls.

- **Multi-region joint detection & region-ambiguous variants** — Methods for jointly genotyping variants across paralogous gene families, enabling confident variant assignment even when reads map ambiguously. (Patents WO2024010812A2, US 18/674,538, US 18/674,279)

---

## Transposable Element Analysis in Genomics

Transposable elements (TEs) make up nearly half the human genome and are major drivers of genomic variation. During my Ph.D. I developed computational methods to detect, characterize, and study TEs using long-read sequencing technologies.

**Key projects:**

- **[TELR](https://github.com/bergmanlab/TELR)** — A software pipeline for detecting non-reference TE insertions in long-read (PacBio / Oxford Nanopore) sequencing data using local assembly. TELR enables phylogenomic analysis of TE insertions at base-pair resolution. Published in *Nucleic Acids Research* (2022); selected as **Editor's Picks** at *Mobile DNA*; cited in *Transposable Elements: Methods and Protocols*.

- **[ngs\_te\_mapper2](https://github.com/bergmanlab/ngs_te_mapper2)** — A cell-line authentication tool based on TE insertion profiles, used to identify *Drosophila* cell lines and detect loss of heterozygosity.

- **TE dynamics in *Drosophila* S2 cell lines** — Genomic analysis of 32 whole-genome datasets from *D. melanogaster* S2 sublines, characterizing ongoing transposition and phylogenetic relationships among laboratory cell cultures.

- **P element target site prediction** — Machine learning models trained on 30+ engineered features to predict P element insertion site preferences.

---

## Benchmarking and Evaluation

Rigorous benchmarking of bioinformatics tools is essential for reliable genomic research. I have contributed to large-scale evaluations of:

- **Copy number variant callers** — Benchmarking of germline CNV callers from WGS data. *Bioinformatics Advances* (2025).
- **TE detection tools** — Reproducible evaluation framework (McClintock 2) for transposable element detectors. *Mobile DNA* (2023).

---

## Software & Resources

| Tool | Description | Link |
|------|-------------|------|
| TELR | TE detection in long-read WGS | [GitHub](https://github.com/bergmanlab/TELR) |
| ngs_te_mapper2 | Cell-line TE profiling | [GitHub](https://github.com/bergmanlab/ngs_te_mapper2) |
| McClintock 2 | TE detector benchmarking | [GitHub](https://github.com/bergmanlab/mcclintock) |
