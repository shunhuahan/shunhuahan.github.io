---
layout: page
title: About
headline: "Shunhua Han, Ph.D."
permalink: /about/
description: "About Shunhua Han, Ph.D.: education, professional experience at Illumina, and skills in computational genomics and variant calling."
---

I'm a Sr. Staff Bioinformatics Scientist at [Illumina](https://www.illumina.com) in San Diego, where I build variant-calling methods for the parts of the genome that standard pipelines get wrong. My current focus is TruPath Genome, an on-flowcell proximity sequencing technology, and the algorithms that turn its long-range signal into haplotype-resolved variant calls in segmental duplications. Before that I built targeted callers for the alpha-globin locus and *PMS2*, two of the most requested and most frustrating targets in carrier screening and hereditary cancer testing.

I came to this problem through transposable elements. During my Ph.D. with [Casey Bergman](https://bergmanlab.github.io) at the University of Georgia, I studied how TEs reshape the genomes of *Drosophila* cell lines, and built the software (TELR, ngs_te_mapper2) to find insertions that standard tools miss. Repetitive DNA has a way of breaking every assumption a pipeline makes, and I found I liked working exactly where things break.

The through-line of my work is simple: a lot of medically important genetic variation sits in places where the genome carries two nearly identical copies of the same sequence, and someone has to figure out which copy a read came from. That puzzle, in different forms, has kept me busy for a decade.

---

## Education

**Ph.D. in Bioinformatics** · University of Georgia (December 2021)
Dissertation: *Novel computational strategies for the analysis of transposable elements in Drosophila cell culture genomes* ([PDF](/assets/shunhuahan-phd-thesis.pdf))
Advisor: Casey Bergman

**B.S. in Pharmaceutical Sciences** · East China University of Science and Technology, Shanghai (June 2015)

---

## Professional Experience

**Sr. Staff Bioinformatics Scientist** · Illumina (November 2025 – present)
Resolving challenging and disease-causing genes using constellation mapped reads and whole-genome sequencing.

**Staff Bioinformatics Scientist** · Illumina (November 2023 – October 2025)
Improved variant calling accuracy for *PMS2* (Lynch syndrome diagnostics); published research blog on PMS2 detection.

**Senior Bioinformatics Scientist** · Illumina (January 2022 – October 2023)
Led development of HBA1/2 copy number genotyping method for alpha-thalassemia diagnosis.

**Graduate Research Assistant** · University of Georgia (August 2016 – December 2021)
Developed TELR (long-read TE detection), ngs_te_mapper2 (cell-line authentication), and machine learning models for P element target site prediction.

---

## Skills

**Languages:** Python · R · C++ · Bash

**Infrastructure:** Nextflow · Docker · AWS

**Specializations:** Genomic variant calling in complex/repetitive regions · Long-read sequencing · Copy number analysis · Transposable element biology

---

## Contact

- Email: [hanshunhua0829@gmail.com](mailto:hanshunhua0829@gmail.com)
- GitHub: [shunhuahan](https://github.com/shunhuahan)
- LinkedIn: [shunhua-han](https://www.linkedin.com/in/shunhua-han/)
- Google Scholar: [profile](https://scholar.google.com/citations?user=jweOSn4AAAAJ&hl=en)
- CV: [Download PDF](/assets/shunhuahan-cv.pdf)

<style>
/* Section labels: eyebrow style, matching the Publications page */
.page .entry h2 {
  margin: 2.4em 0 0.6em;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #2f5fe0;
}
.page .entry hr {
  border: none;
  border-top: 1px solid #e4e7ee;
  margin: 30px 0 6px;
}
html.dark .page .entry h2 { color: #5b8dff; }
html.dark .page .entry hr { border-top-color: #262b3a; }
</style>
