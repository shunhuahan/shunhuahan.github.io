---
layout: page
title: Research
permalink: /research/
---

My research sits at the intersection of computational method development and clinical genomics. I build algorithms and software to detect genetic variants in regions of the genome that are too complex, repetitive, or structurally variable for standard approaches.

---

## Variant Calling in Medically Relevant Complex Regions

Many clinically important genes reside in segmental duplications or highly repetitive genomic regions where standard short-read aligners and variant callers fail. I develop targeted, haplotype-aware methods that leverage whole-genome sequencing data—both short-read and long-read—to produce accurate, clinically actionable calls.

**Key projects:**

- **Alpha-thalassemia (*HBA1/2*) copy number genotyping** — Led development of a targeted caller for alpha-globin copy number, enabling carrier screening for one of the most common genetic diseases worldwide (~5% global carrier frequency). [Illumina research blog](https://www.illumina.com/science/genomics-research/articles/targeted-caller-hba.html)

- **Lynch syndrome (*PMS2*) variant detection** — Improved variant calling accuracy in *PMS2*, a mismatch-repair gene with a highly similar pseudogene (*PMS2CL*) that causes widespread misalignment and false calls. [Illumina research blog](https://www.illumina.com/science/genomics-research/articles/overcoming-pms2-variant-calling-challenges.html)

- **Multi-region joint detection & region-ambiguous variants** — Methods for jointly genotyping variants across paralogous gene families, enabling confident variant assignment even when reads map ambiguously. (Patents WO2024010812A2, US 18/674,538, US 18/674,279)

- **Constellation mapped reads + haplotype-resolved calling** — A rapid approach to rare-disease variant discovery using on-flowcell proximity sequencing, presented at ACMG 2026.

---

## Transposable Element Analysis in Genomics

Transposable elements (TEs) make up nearly half the human genome and are major drivers of genomic variation and disease. During my Ph.D. I developed computational methods to detect, characterize, and study TEs using long-read sequencing technologies.

**Key projects:**

- **[TELR](https://github.com/bergmanlab/TELR)** — A software pipeline for detecting non-reference TE insertions in long-read (PacBio / Oxford Nanopore) sequencing data using local assembly. TELR enables phylogenomic analysis of TE insertions at base-pair resolution. Published in *Nucleic Acids Research* (2022); selected as **Editor's Picks** at *Mobile DNA*; cited in *Transposable Elements: Methods and Protocols*.

- **[ngs\_te\_mapper2](https://github.com/bergmanlab/ngs_te_mapper2)** — A cell-line authentication tool based on TE insertion profiles, used to identify *Drosophila* cell lines and detect loss of heterozygosity.

- **TE dynamics in *Drosophila* S2 cell lines** — Genomic analysis of 32 whole-genome datasets from *D. melanogaster* S2 sublines, characterizing ongoing transposition and phylogenetic relationships among laboratory cell cultures.

- **P element target site prediction** — Machine learning models trained on 30+ engineered features to predict P element insertion site preferences.

---

## Benchmarking and Evaluation

Rigorous benchmarking of bioinformatics tools is critical for clinical translation. I have contributed to large-scale evaluations of:

- **Copy number variant callers** — Benchmarking of germline CNV callers from WGS data for clinical applications. *Bioinformatics Advances* (2025).
- **TE detection tools** — Reproducible evaluation framework (McClintock 2) for transposable element detectors. *Mobile DNA* (2023).

---

## Software & Resources

| Tool | Description | Link |
|------|-------------|------|
| TELR | TE detection in long-read WGS | [GitHub](https://github.com/bergmanlab/TELR) |
| ngs_te_mapper2 | Cell-line TE profiling | [GitHub](https://github.com/bergmanlab/ngs_te_mapper2) |
| McClintock 2 | TE detector benchmarking | [GitHub](https://github.com/bergmanlab/mcclintock) |
