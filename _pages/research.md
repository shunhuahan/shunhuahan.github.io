---
layout: page
title: Research
permalink: /research/
description: "Research on haplotype-resolved variant calling in complex genomic regions and transposable element detection in Drosophila, by Shunhua Han."
---

My research sits at the intersection of computational method development and genomics. I build algorithms and software to detect genetic variants in regions of the genome that are too complex, repetitive, or structurally variable for standard approaches.

<div class="research-section">
<div class="research-section-header">
<svg class="research-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
<h2>Haplotype-resolved variant calling in complex genomic regions</h2>
</div>
<div class="research-section-body" markdown="1">

Many important genes reside in segmental duplications or highly repetitive genomic regions where standard short-read aligners and variant callers fail. I develop targeted, haplotype-aware methods that leverage both short-read and long-read whole-genome sequencing to produce accurate calls in these challenging loci.

**Haplotype-resolved variant calling in segmental duplications using TruPath Genome (formerly Constellation)**

TruPath Genome is an on-flowcell proximity sequencing technology. The proximity information from sequenced reads in nearby nanowells can help infer whether a group of reads belongs to the same original DNA molecule. I designed the multi-region joint detection (MRJD) algorithm, which takes advantage of this long-range information from TruPath Genome to produce haplotype-resolved variant calls in segmental duplications.

<figure class="research-figure">
  <img src="/images/research-pms2-schematic.jpg" alt="PMS2-PMS2CL ambiguity resolved: alignment tracks for two PMS2 haplotypes showing a PMS2CL-to-PMS2 gene conversion event, with haplotype 1 rendered non-functional and haplotype 2 functional, each with PMS2CL deleted">
  <figcaption><strong>Figure.</strong> <em>PMS2</em>-<em>PMS2CL</em> ambiguity resolved. <em>PMS2</em> shares about 98% sequence identity with its pseudogene <em>PMS2CL</em>, which causes systematic misalignment and false variant calls with standard short-read sequencing. TruPath's haplotype-resolved calling separates the two haplotypes cleanly, revealing a <em>PMS2CL</em>-to-<em>PMS2</em> gene conversion event on one haplotype (rendering it non-functional) while the other haplotype remains functional.</figcaption>
</figure>

I presented this work as a platform talk at the 2026 ACMG Annual Clinical Genetics Meeting: *"A Rapid, Novel Approach to Rare Disease and Clinical Genetic Variant Discovery using On-flowcell Proximity Sequencing and Haplotype-resolved Variant Calling."* [[Abstract]](https://www.gimopen.org/article/S2949-7744(26)00818-6/fulltext) &nbsp;·&nbsp; [[Slides (PDF)]](/assets/han-acmg2026-trupath-slides.pdf)

**Other key projects**

<div class="project-list">
  <div class="project-item">
    <h4>Alpha-thalassemia (<em>HBA1/2</em>) copy number genotyping</h4>
    <p>Developed a targeted copy number caller for the alpha-globin locus, one of the most structurally complex and clinically important regions of the genome (~5% global carrier frequency for alpha-thalassemia). <a href="https://www.illumina.com/science/genomics-research/articles/HBA-targeted-caller.html" target="_blank">Blog post</a></p>
  </div>
  <div class="project-item">
    <h4>Lynch syndrome (<em>PMS2</em>) variant detection</h4>
    <p>Improved variant calling accuracy in <em>PMS2</em>, a mismatch-repair gene with a highly similar pseudogene (<em>PMS2CL</em>) that causes widespread misalignment and false variant calls. <a href="https://www.illumina.com/science/genomics-research/articles/PMS2-small-variant-detection.html" target="_blank">Blog post</a></p>
  </div>
</div>

</div>
</div>

<div class="research-section">
<div class="research-section-header">
<svg class="research-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4c4 4 4 12 0 16"/><path d="M20 4c-4 4-4 12 0 16"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="18" y2="16"/></svg>
<h2>Detecting and analyzing transposable elements in Drosophila</h2>
</div>
<div class="research-section-body" markdown="1">

Transposable elements (TEs) make up nearly half the human genome and are major drivers of genomic variation. During my Ph.D., I developed computational methods to detect, characterize, and study TEs using long-read sequencing technologies in [Casey Bergman](https://bergmanlab.github.io)'s lab at the University of Georgia.

<figure class="research-figure">
  <img src="/images/research-telr-workflow.png" alt="TELR workflow diagram showing four stages: identifying TE insertion candidate loci from structural variant calls, assembling and polishing a local TE contig, identifying the TE insertion family and reference coordinates, and estimating intra-sample allele frequency">
  <figcaption><strong>Figure.</strong> The TELR pipeline. Long reads are used to (1) identify candidate TE insertion loci from structural-variant calls, (2) locally assemble and polish a contig spanning the insertion, (3) identify the TE family and its coordinates on the reference genome, and (4) estimate the insertion's intra-sample allele frequency from read depth.</figcaption>
</figure>

**Key projects**

<div class="project-list">
  <div class="project-item">
    <h4><a href="https://github.com/bergmanlab/TELR" target="_blank">TELR</a></h4>
    <p>A software pipeline for detecting non-reference TE insertions in long-read (PacBio / Oxford Nanopore) sequencing data using local assembly. TELR enables phylogenomic analysis of TE insertions at base-pair resolution. Published in <em>Nucleic Acids Research</em> (2022).</p>
  </div>
  <div class="project-item">
    <h4><a href="https://github.com/bergmanlab/ngs_te_mapper2" target="_blank">ngs_te_mapper2</a></h4>
    <p>A cell-line authentication tool based on TE insertion profiles, used to identify <em>Drosophila</em> cell lines and detect loss of heterozygosity.</p>
  </div>
  <div class="project-item">
    <h4>TE dynamics in <em>Drosophila</em> S2 cell lines</h4>
    <p>Genomic analysis of 32 whole-genome datasets from <em>D. melanogaster</em> S2 sublines, characterizing ongoing transposition and phylogenetic relationships among laboratory cell cultures.</p>
  </div>
  <div class="project-item">
    <h4><em>P</em> element target site prediction</h4>
    <p>Machine learning models trained on 30+ engineered features to predict <em>P</em> element insertion site preferences.</p>
  </div>
</div>

</div>
</div>

<div class="research-section">
<div class="research-section-header">
<svg class="research-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
<h2>Software &amp; Resources</h2>
</div>
<div class="research-section-body" markdown="1">

<div class="tool-grid">
  <a href="https://github.com/bergmanlab/TELR" target="_blank" class="tool-card">
    <span class="tool-name">TELR</span>
    <span class="tool-desc">TE detection in long-read WGS</span>
  </a>
  <a href="https://github.com/bergmanlab/ngs_te_mapper2" target="_blank" class="tool-card">
    <span class="tool-name">ngs_te_mapper2</span>
    <span class="tool-desc">Cell-line TE profiling</span>
  </a>
  <a href="https://github.com/bergmanlab/mcclintock" target="_blank" class="tool-card">
    <span class="tool-name">McClintock 2</span>
    <span class="tool-desc">TE detector benchmarking</span>
  </a>
</div>

</div>
</div>

<style>
.research-section {
  margin: 32px 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.research-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.research-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: #2e5b9e;
}

.research-section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  border: none;
}

.research-section-body {
  background: #ffffff;
  padding: 22px 24px 26px;
}

.research-section-body p:first-child { margin-top: 0; }
.research-section-body p:last-child  { margin-bottom: 0; }

.research-figure {
  margin: 20px 0;
  text-align: center;
}
.research-figure img {
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  padding: 10px;
}
.research-figure figcaption {
  margin-top: 10px;
  font-size: 12.5px;
  line-height: 1.65;
  color: #64748b;
  text-align: left;
  padding: 0 4px;
}
.research-figure figcaption strong { color: #475569; }

.project-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 16px 0 4px;
}
.project-item {
  padding-left: 16px;
  border-left: 3px solid #dbe6f3;
}
.project-item h4 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}
.project-item p {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: #475569;
}
.project-item a { font-weight: 600; }

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin: 4px 0;
}
.tool-card {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-decoration: none !important;
  transition: border-color 0.15s, transform 0.15s;
}
.tool-card:hover {
  border-color: #2e5b9e;
  transform: translateY(-1px);
}
.tool-name { font-size: 14px; font-weight: 700; color: #1e293b; }
.tool-desc { font-size: 12.5px; color: #64748b; }

/* Dark mode */
html.dark .research-section {
  background: #1e293b;
  border-color: #334155;
}
html.dark .research-section-header {
  border-bottom-color: #334155;
}
html.dark .research-icon { color: #7dd3fc; }
html.dark .research-section-header h2 { color: #e2e8f0; }
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
html.dark .research-figure img { border-color: #334155; background: #0f172a; }
html.dark .research-figure figcaption { color: #94a3b8; }
html.dark .research-figure figcaption strong { color: #cbd5e1; }
html.dark .project-item { border-left-color: #334155; }
html.dark .project-item h4 { color: #e2e8f0; }
html.dark .project-item p { color: #94a3b8; }
html.dark .tool-card { border-color: #334155; }
html.dark .tool-card:hover { border-color: #7dd3fc; }
html.dark .tool-name { color: #e2e8f0; }
html.dark .tool-desc { color: #94a3b8; }
</style>
