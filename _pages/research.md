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

Some of the most medically important genes in the human genome happen to sit in the hardest places to sequence. *SMN1*, the gene behind spinal muscular atrophy, has a near-identical neighbor called *SMN2*. *PMS2*, tied to Lynch syndrome, has *PMS2CL*. *CYP21A2*, behind congenital adrenal hyperplasia, has *CYP21A1P*. In each case the two copies share 98 to 99% of their sequence, more than enough to confuse a standard short-read aligner. Reads pile up in the wrong place, variant calls come out wrong or missing entirely, and clinical labs often fall back on slow, gene-specific workarounds like nested PCR just to get a trustworthy answer.

{% include mappability-demo.html %}

I work on TruPath Genome (formerly called Constellation), an Illumina on-flowcell proximity sequencing technology built to make these regions tractable without a separate workaround for every gene. As DNA is sequenced, TruPath also records a bit of proximity information: reads that land in nearby nanowells on the flow cell are more likely to have come from the same original DNA molecule. It's a subtle signal on its own, but it's exactly the kind of long-range clue that a single short read can't give you.

I designed the multi-region joint detection (MRJD) algorithm to put that signal to use. Instead of looking at a gene and its paralog one at a time, MRJD looks at reads from both together, works out how many total copies are present, and sorts the reads back into the right copy and haplotype, untangling two or more look-alike genes back into their true, separate identities.

Here's what that looks like on a real case. *PMS2* and *PMS2CL* are about as tangled as it gets: 98% identical, and *PMS2CL* even has a habit of "overwriting" *PMS2* through gene conversion, copying its own sequence into *PMS2* and quietly breaking it. In the figure below, MRJD cleanly separates a sample's two *PMS2* haplotypes. One of them turns out to carry exactly this kind of gene conversion event and is non-functional as a result, while the other is fully intact. Knowing which haplotype is broken and which one still works is exactly the detail that gets lost when the two genes are tangled together in standard short-read data.

<figure class="research-figure">
  <img src="/images/research-pms2-schematic.jpg" alt="PMS2-PMS2CL ambiguity resolved: alignment tracks for two PMS2 haplotypes showing a PMS2CL-to-PMS2 gene conversion event, with haplotype 1 rendered non-functional and haplotype 2 functional, each with PMS2CL deleted">
  <figcaption><strong>Figure.</strong> Read alignments for a sample's two <em>PMS2</em> haplotypes. Haplotype 1 carries a <em>PMS2CL</em>-to-<em>PMS2</em> gene conversion tract and is non-functional; haplotype 2 is unaffected and functional.</figcaption>
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
    <p>Separately from the TruPath work above, I also improved small-variant calling accuracy in <em>PMS2</em> for standard whole-genome sequencing, addressing the same misalignment problem with a different approach. <a href="https://www.illumina.com/science/genomics-research/articles/PMS2-small-variant-detection.html" target="_blank">Blog post</a></p>
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

Transposable elements, or TEs, are stretches of DNA that can copy themselves and jump around the genome. They make up nearly half of the human genome and are a major source of genetic variation across animals, *Drosophila* included. For my Ph.D. in [Casey Bergman](https://bergmanlab.github.io)'s lab at the University of Georgia, I spent a lot of time thinking about how to find and study them, especially in genomes that are unusually messy: cultured cell lines, which tend to pick up extra chromosome copies, structural rearrangements, and brand-new TE insertions the longer they sit in a flask.

Short reads struggle with TEs for a simple reason: many TEs are longer than a single read, so a read that lands inside one usually can't be placed back on the genome with any confidence. Long reads solve that by spanning the whole insertion in one go, but that alone still isn't enough to know exactly where a TE landed, which family it belongs to, or how many copies of it a sample carries. So I built TELR, a pipeline that takes long-read sequencing data, flags candidate TE insertion sites from structural variant calls, locally assembles just that region into a clean contig, and then pins down the TE's exact boundaries and family against the reference genome. TELR also keeps track of how many reads support each insertion, which lets it estimate what fraction of a cell's genome copies actually carry it, handy in a cell line that might have three or four copies of a chromosome instead of the usual two.

<figure class="research-figure">
  <img src="/images/research-telr-workflow.png" alt="TELR workflow diagram showing four stages: identifying TE insertion candidate loci from structural variant calls, assembling and polishing a local TE contig, identifying the TE insertion family and reference coordinates, and estimating intra-sample allele frequency">
  <figcaption><strong>Figure.</strong> The TELR pipeline. Long reads are used to identify candidate TE insertion loci from structural variant calls, locally assemble and polish a contig spanning the insertion, identify the TE family and its coordinates on the reference genome, and estimate the insertion's intra-sample allele frequency from read depth.</figcaption>
</figure>

Once TELR existed, the natural next step was to see what it could reveal about TE activity itself. Applying it to S2R+, a widely used but famously messy *Drosophila* cell line, turned up thousands of TE insertions that were completely absent from the reference genome. Because TELR reconstructs the actual sequence of each insertion rather than just its location, we could also build family trees for the most active TE families and ask where all these new copies were coming from. For most of the expanded families, the answer was a single common ancestor: once a TE family got a foothold in this cell line, it appears to have proliferated rapidly from that one entry point rather than jumping in independently over and over again.

<figure class="research-figure">
  <img src="/images/research-telr-phylogeny.jpg" alt="Phylogenetic trees for four transposable element families (1731, 297, jockey, and Juan) built from TELR-assembled insertion sequences, with highlighted clades marking single-source lineage expansions in the S2R+ cell line">
  <figcaption><strong>Figure.</strong> Family trees for four TE families built from sequences that TELR assembled directly from long reads. The highlighted clades mark expansions in S2R+ that trace back to a single source lineage rather than many independent insertions.</figcaption>
</figure>

**Key projects**

<div class="project-list">
  <div class="project-item">
    <h4>Local assembly and phylogenomics of TEs in a polyploid cell line</h4>
    <p>The manuscript introducing TELR and applying it to reveal single-lineage TE expansions in the S2R+ cell line (the two figures above). Published in <em>Nucleic Acids Research</em> (2022). <a href="https://doi.org/10.1093/nar/gkac794" target="_blank">Paper</a></p>
  </div>
  <div class="project-item">
    <h4>TE profiles as a fingerprint for cell line identity</h4>
    <p>Introduced ngs_te_mapper2 and used genome-wide TE insertion profiles to authenticate <em>Drosophila</em> cell lines, uncovering misidentification events and loss-of-heterozygosity patterns along the way. Published in <em>Genetics</em> (2021). <a href="https://doi.org/10.1093/genetics/iyab113" target="_blank">Paper</a></p>
  </div>
  <div class="project-item">
    <h4>TE dynamics in <em>Drosophila</em> S2 cell lines</h4>
    <p>Genomic analysis of 32 whole-genome datasets from <em>D. melanogaster</em> S2 sublines, characterizing ongoing transposition and phylogenetic relationships among laboratory cell cultures. Published in <em>Genetics</em> (2022). <a href="https://doi.org/10.1093/genetics/iyac077" target="_blank">Paper</a></p>
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
  margin: 36px 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e4e7ee;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(20,23,31,0.03), 0 12px 28px -18px rgba(20,23,31,0.1);
}

.research-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 26px 16px;
  border-bottom: 1px solid #eef0f4;
}

.research-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: #2f5fe0;
}

.research-section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #14171f;
  border: none;
}

.research-section-body {
  background: #ffffff;
  padding: 22px 26px 28px;
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
  border: 1px solid #e4e7ee;
  background: #fff;
  padding: 10px;
}
.research-figure figcaption {
  margin-top: 10px;
  font-size: 12.5px;
  line-height: 1.65;
  color: #5b6472;
  text-align: left;
  padding: 0 4px;
}
.research-figure figcaption strong { color: #3d4451; }

.project-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 16px 0 4px;
}
.project-item {
  padding-left: 16px;
  border-left: 3px solid #d7e0f7;
}
.project-item h4 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #14171f;
}
.project-item p {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: #5b6472;
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
  border: 1px solid #e4e7ee;
  border-radius: 10px;
  text-decoration: none !important;
  transition: border-color 0.15s, transform 0.15s;
}
.tool-card:hover {
  border-color: #2f5fe0;
  transform: translateY(-1px);
}
.tool-name { font-size: 14px; font-weight: 700; color: #14171f; }
.tool-desc { font-size: 12.5px; color: #5b6472; }

/* Dark mode */
html.dark .research-section {
  background: #171b28;
  border-color: #262b3a;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2), 0 12px 28px -18px rgba(0,0,0,0.4);
}
html.dark .research-section-header {
  border-bottom-color: #262b3a;
}
html.dark .research-icon { color: #5b8dff; }
html.dark .research-section-header h2 { color: #e7e9ee; }
html.dark .research-section-body {
  background: #171b28;
}
html.dark .research-section-body,
html.dark .research-section-body p,
html.dark .research-section-body li {
  color: #cbd0dc;
}
html.dark .research-section-body strong {
  color: #e7e9ee;
}
html.dark .research-figure img { border-color: #262b3a; background: #10131c; }
html.dark .research-figure figcaption { color: #98a2b3; }
html.dark .research-figure figcaption strong { color: #cbd0dc; }
html.dark .project-item { border-left-color: #262b3a; }
html.dark .project-item h4 { color: #e7e9ee; }
html.dark .project-item p { color: #98a2b3; }
html.dark .tool-card { border-color: #262b3a; }
html.dark .tool-card:hover { border-color: #5b8dff; }
html.dark .tool-name { color: #e7e9ee; }
html.dark .tool-desc { color: #98a2b3; }
</style>
