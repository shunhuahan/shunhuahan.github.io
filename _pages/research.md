---
layout: page
title: Research
headline: "Calling variants where the genome repeats itself"
permalink: /research/
description: "Research on haplotype-resolved variant calling in complex genomic regions and transposable element detection in Drosophila, by Shunhua Han."
---

My research sits at the intersection of computational method development and genomics. I build algorithms and software to detect genetic variants in regions of the genome that are too complex, repetitive, or structurally variable for standard approaches.

<section class="research-block">
<div class="research-block-head">
<span class="research-num">01</span>
<h2>Haplotype-resolved variant calling in complex genomic regions</h2>
</div>
<div class="research-block-body" markdown="1">

Some of the most medically important genes in the human genome happen to sit in the hardest places to sequence. *SMN1*, the gene behind spinal muscular atrophy, has a near-identical neighbor called *SMN2*. *PMS2*, tied to Lynch syndrome, has *PMS2CL*. *CYP21A2*, behind congenital adrenal hyperplasia, has *CYP21A1P*. In each case the two copies share anywhere from 98% to more than 99.9% of their sequence, more than enough to confuse a standard short-read aligner. Reads pile up in the wrong place, variant calls come out wrong or missing entirely, and clinical labs often fall back on slow, gene-specific workarounds like nested PCR just to get a trustworthy answer.

{% include mappability-demo.html %}

I work on TruPath Genome (formerly called Constellation), an Illumina on-flowcell proximity sequencing technology built to make these regions tractable without a separate workaround for every gene. As DNA is sequenced, TruPath also records a bit of proximity information: reads that land in nearby nanowells on the flow cell are more likely to have come from the same original DNA molecule. It's a subtle signal on its own, but it's exactly the kind of long-range clue that a single short read can't give you.

I designed the multi-region joint detection (MRJD) algorithm to put that signal to use. Instead of looking at a gene and its paralog one at a time, MRJD looks at reads from both together, works out how many total copies are present, and sorts the reads back into the right copy and haplotype, untangling two or more look-alike genes back into their true, separate identities.

Here's what that looks like on a real case. *PMS2* and *PMS2CL* are about as tangled as it gets: 98% identical, and *PMS2CL* even has a habit of "overwriting" *PMS2* through gene conversion, copying its own sequence into *PMS2* and quietly breaking it. In the figure below, MRJD cleanly separates a sample's two *PMS2* haplotypes. One of them turns out to carry exactly this kind of gene conversion event and is non-functional as a result, while the other is fully intact. Knowing which haplotype is broken and which one still works is exactly the detail that gets lost when the two genes are tangled together in standard short-read data.

<figure class="research-figure">
  <img src="/images/research-pms2-schematic.jpg" alt="PMS2-PMS2CL ambiguity resolved: alignment tracks for two PMS2 haplotypes showing a PMS2CL-to-PMS2 gene conversion event, with haplotype 1 rendered non-functional and haplotype 2 functional, each with PMS2CL deleted">
  <figcaption><strong>Figure.</strong> Read alignments for a sample's two <em>PMS2</em> haplotypes. Haplotype 1 carries a <em>PMS2CL</em>-to-<em>PMS2</em> gene conversion tract and is non-functional; haplotype 2 is unaffected and functional.</figcaption>
</figure>

I presented this work as a platform talk at the 2026 ACMG Annual Clinical Genetics Meeting: *"A Rapid, Novel Approach to Rare Disease and Clinical Genetic Variant Discovery using On-flowcell Proximity Sequencing and Haplotype-resolved Variant Calling."* [[Abstract]](https://www.gimopen.org/article/S2949-7744(26)00818-6/fulltext) &nbsp;·&nbsp; [[Slides (PDF)]](/assets/han-acmg2026-trupath-slides.pdf)

**The loci this had to work on**

{% include loci-gallery.html %}

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
</section>

<section class="research-block">
<div class="research-block-head">
<span class="research-num">02</span>
<h2>Detecting and analyzing transposable elements in Drosophila</h2>
</div>
<div class="research-block-body" markdown="1">

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
</section>

<section class="research-block">
<div class="research-block-head">
<span class="research-num">03</span>
<h2>Software &amp; Resources</h2>
</div>
<div class="research-block-body" markdown="1">

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
</section>

<style>
.research-block {
  margin: 48px 0 0;
  padding-top: 38px;
  border-top: 1px solid #e4e7ee;
}

.research-block-head {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 20px;
}

.research-num {
  font-family: 'Google Sans Flex', 'Inter', -apple-system, sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #2f5fe0;
  flex-shrink: 0;
}

.research-block-head h2 {
  margin: 0;
  font-family: 'Google Sans Flex', 'Inter', -apple-system, sans-serif;
  font-size: clamp(1.3rem, 2.6vw, 1.6rem);
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.25;
  color: #14171f;
  border: none;
}

.research-block-body p:first-child { margin-top: 0; }
.research-block-body p:last-child  { margin-bottom: 0; }

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
html.dark .research-block {
  border-top-color: #262b3a;
}
html.dark .research-num { color: #5b8dff; }
html.dark .research-block-head h2 { color: #e7e9ee; }
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

/* Click-to-zoom lightbox for research figures */
.research-figure img { cursor: zoom-in; }
.figure-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px 24px;
  background: rgba(9, 11, 16, 0.93);
  cursor: zoom-out;
}
.figure-lightbox.open { display: flex; }
@media (prefers-reduced-motion: no-preference) {
  .figure-lightbox.open { animation: lightbox-fade 0.18s ease; }
  @keyframes lightbox-fade { from { opacity: 0; } to { opacity: 1; } }
}
.figure-lightbox img {
  max-width: min(94vw, 1400px);
  max-height: 80vh;
  border-radius: 8px;
  background: #fff;
  padding: 10px;
  cursor: default;
}
.figure-lightbox-caption {
  max-width: min(90vw, 900px);
  margin: 14px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #b7bfcc;
  text-align: center;
  cursor: default;
}
.figure-lightbox-close {
  position: absolute;
  top: 18px;
  right: 20px;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s;
}
.figure-lightbox-close:hover { background: rgba(255, 255, 255, 0.24); }
</style>

<script>
(function() {
  var figures = document.querySelectorAll('.research-figure img');
  if (!figures.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'figure-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Enlarged figure');
  overlay.innerHTML = '<button type="button" class="figure-lightbox-close" aria-label="Close enlarged figure">&times;</button>' +
    '<img alt=""><p class="figure-lightbox-caption"></p>';
  document.body.appendChild(overlay);

  var overlayImg = overlay.querySelector('img');
  var overlayCaption = overlay.querySelector('.figure-lightbox-caption');
  var closeBtn = overlay.querySelector('.figure-lightbox-close');
  var lastFocus = null;

  function open(img) {
    overlayImg.src = img.src;
    overlayImg.alt = img.alt || '';
    var fig = img.closest('figure');
    var cap = fig ? fig.querySelector('figcaption') : null;
    overlayCaption.innerHTML = cap ? cap.innerHTML : '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    lastFocus = document.activeElement;
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  for (var i = 0; i < figures.length; i++) {
    (function(img) {
      img.addEventListener('click', function() { open(img); });
      // Keyboard access: figures become focusable zoom triggers
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Enlarge figure');
      img.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
      });
    })(figures[i]);
  }

  overlay.addEventListener('click', function(e) {
    // Close on backdrop or the close button, not on the image/caption
    if (e.target === overlay || e.target === closeBtn) close();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
})();
</script>
