---
layout: page
title: Research
headline: "When the genome repeats itself"
permalink: /research/
wide: true
description: "Research on haplotype-resolved variant calling in complex genomic regions and transposable element detection in Drosophila, by Shunhua Han."
---

My work connects paralogous genes, copy-number variation and transposable elements: finding which copies of a sequence are present, what they carry, and how they evolved.

<nav class="research-index" aria-label="Research topics">
  <a href="#paralogs">TruPath Genome</a><a href="#short-read">Short-read callers</a><a href="#transposons">TELR &amp; evolution</a><a href="#software">Software</a>
</nav>

<section class="rblock" id="paralogs">
<div class="rblock-rail">
  <span class="rblock-num">01</span>
  <span class="rblock-kicker">Proximity sequencing</span>
</div>
<div class="rblock-body" markdown="1">

## Resolving paralogous genes with proximity sequencing

{% include project-summary.html anchor="trupath" %}

Genes such as *SMN1*, *PMS2* and *CYP21A2* share long, near-identical stretches with a paralog or pseudogene. A short read from one of those stretches fits both copies equally well, so the variant caller cannot tell which gene it is looking at.

{% include mappability-demo.html %}

TruPath Genome (formerly Constellation) moves library preparation onto the flow cell, so each short read keeps a record of the long molecule it came from. I work on the analysis side: in DRAGEN, multi-region joint detection uses that linkage to count how many copies a sample carries, reconstruct each copy and its variants, and place the copies on the right gene.

{% include trupath-schematic.html %}

### A worked case: *PMS2* and *PMS2CL*

*PMS2CL* sequence can be copied into *PMS2* by gene conversion, which a gene-level call cannot see. Here the two reconstructed *PMS2* haplotypes are separated: one carries a *PMS2CL*-to-*PMS2* conversion tract, and *PMS2CL* itself is deleted on both chromosomes. The application note reports this configuration as consistent with the sample's prior characterization.

<figure class="rfig">
  <img src="/images/research-pms2-schematic.jpg" width="1400" height="787" loading="lazy" alt="Alignment tracks for two reconstructed PMS2 haplotypes. Haplotype 1 carries a PMS2CL-to-PMS2 gene conversion tract and is annotated non-functional; haplotype 2 is unaffected. PMS2CL is deleted on both haplotypes.">
  <figcaption><span class="fig-label">Figure 3</span>Two reconstructed <em>PMS2</em> haplotypes. The source classifies haplotype 1, which carries the conversion tract, as non-functional without naming a causal change; haplotype 2 is unaffected. <em>PMS2CL</em> is deleted on both.</figcaption>
</figure>

</div>
</section>

<section class="rblock" id="short-read">
<div class="rblock-rail">
  <span class="rblock-num">02</span>
  <span class="rblock-kicker">Standard short reads</span>
</div>
<div class="rblock-body" markdown="1">

## Calling difficult clinical genes from standard sequencing

Before proximity data, I built callers that get the most out of an ordinary genome or exome for a few high-value genes. Each one is designed around its locus: reading depth over sequence that is unique when the genes themselves are not, or analysing near-identical copies together instead of discarding the reads they share.

{% include alpha-globin-figure.html %}

<div class="work-list">
  <article class="work" id="hba">
    <div class="work-main">
      <p class="work-kicker">Alpha-thalassemia · whole genome</p>
      <h3><em>HBA1</em>/<em>HBA2</em> copy-number caller</h3>
      <p><em>HBA1</em> and <em>HBA2</em> sit back to back and are about 97% identical. The caller estimates copy number from several non-homologous regions in and near the locus and resolves 14 copy-number genotypes, including the common &minus;&alpha;<sup>3.7</sup>, &minus;&alpha;<sup>4.2</sup> and &minus;&minus;<sup>SEA</sup> deletions. Calls were Mendelian-consistent in all 575 trios tested, and across 3,201 1000 Genomes samples recovered alpha-thalassemia carrier frequencies of about 36% in African and 13% in South Asian populations.</p>
      <p class="work-role">Led development · first author · first-named inventor on the patent application</p>
      <p class="work-links"><a href="https://www.illumina.com/science/genomics-research/articles/HBA-targeted-caller.html">Article ↗</a><a href="https://patents.google.com/patent/WO2024010812A2">Patent ↗</a></p>
    </div>
    <div class="work-stat"><b>246</b><span>samples compared with PacBio HiFi; 4 no-calls</span></div>
  </article>

  <article class="work" id="carrier-exome">
    <div class="work-main">
      <p class="work-kicker">Carrier screening · exome</p>
      <h3><em>HBA</em> and <em>SMN</em> in one exome workflow</h3>
      <p>Standard exome panels miss the non-coding sequence these callers depend on, so labs add MLPA or qPCR. A 359&nbsp;kb spike-in panel and within-batch depth normalisation bring the <em>HBA</em> and <em>SMN</em> callers to exome data. In an external, partly blinded clinical cohort of 1,009 samples, <em>SMN1</em> copy number and SMA status agreed with qPCR or MLPA in 99.8% of datasets.</p>
      <p class="work-role">Co-author · co-inventor on the patent application</p>
      <p class="work-links"><a href="https://www.illumina.com/science/genomics-research/articles/HBA-SMN-genotyping.html">Article ↗</a><a href="https://doi.org/10.1038/s41431-025-01932-8">ESHG abstract ↗</a></p>
    </div>
    <div class="work-stat"><b>1,099<small>/1,099</small></b><span><em>HBA</em> calls matching MLPA in the clinical cohort</span></div>
  </article>

  <article class="work" id="pms2">
    <div class="work-main">
      <p class="work-kicker">Lynch syndrome · whole genome</p>
      <h3>Small variants in <em>PMS2</em></h3>
      <p>The last exons of <em>PMS2</em> are nearly identical to its pseudogene <em>PMS2CL</em>, and gene conversion moves sequence between them. Analysing the two regions jointly, and keeping the reads a standard pipeline discards as ambiguous, recovered pathogenic variants that single-region calling misses, and found every expected clinically relevant variant in 22 samples from two clinical laboratories.</p>
      <p class="work-role">Algorithm development · first author of the ISMB 2023 evaluation · first-named inventor on the patent application</p>
      <p class="work-links"><a href="https://www.illumina.com/science/genomics-research/articles/PMS2-small-variant-detection.html">Article ↗</a><a href="https://www.tempus.com/wp-content/uploads/2023/07/Han_etal_ISMB23.pdf">ISMB poster ↗</a></p>
    </div>
    <div class="work-stat"><b>99.7%</b><span>SNV recall against long-range PCR in 147 cell lines</span></div>
  </article>
</div>

</div>
</section>

<section class="rblock" id="transposons">
<div class="rblock-rail">
  <span class="rblock-num">03</span>
  <span class="rblock-kicker">Genome evolution</span>
</div>
<div class="rblock-body" markdown="1">

## Reconstructing insertions and genome history

{% include project-summary.html anchor="telr" %}

<figure class="rfig">
  <img src="/images/research-telr-workflow.png" width="1600" height="925" loading="lazy" alt="TELR workflow diagram showing four stages: identifying TE insertion candidate loci from structural variant calls, assembling and polishing a local TE contig, identifying the TE insertion family and reference coordinates, and estimating intra-sample allele frequency">
  <figcaption><span class="fig-label">Figure 5</span>The TELR pipeline: identify candidate TE insertion loci from structural variant calls, locally assemble and polish a contig spanning the insertion, identify the TE family and its reference coordinates, then estimate the insertion's intra-sample allele frequency from read depth.</figcaption>
</figure>

### What the family trees actually show

Because TELR reconstructs the sequence of each insertion rather than only its location, we could build family trees for the most active TE families and ask how the extra copies in the S2R+ cell line are related to one another.

The answer turned out to depend on the family. The paper identifies a single expansion clade for *1731*, *gypsy*, *gypsy1*, *mdg3* and *Stalker2*, consistent with proliferation from one source lineage. It identifies multiple expansion clades for *jockey*, *Juan* and *3S18*. So the pattern is family-dependent, not uniform.

These sequence phylogenies reveal relationships among copies, not the number of separate introductions into the culture.

<figure class="rfig">
  <img src="/images/research-telr-phylogeny.jpg" width="1288" height="1300" loading="lazy" alt="Phylogenetic trees for four transposable element families (1731, 297, jockey, and Juan) built from TELR-assembled insertion sequences, with highlighted clades marking expansions in the S2R+ cell line">
  <figcaption><span class="fig-label">Figure 6</span>Family trees for four TE families, built from sequences TELR assembled directly from long reads. Highlighted clades mark expansions in S2R+. The paper reports a single expansion clade for <em>1731</em> and multiple expansion clades for <em>jockey</em> and <em>Juan</em>, so expansion is family-dependent rather than uniformly single-source.</figcaption>
</figure>

### Why the biology matters

TE insertions are individually rare and densely scattered, which makes them unusually good markers for telling cell lines apart. In *Drosophila* cell culture, genome-wide TE insertion profiles cluster replicate samples of the same line with 100% bootstrap support, and a panel of just six LTR retrotransposon families is enough to assign a sample correctly. That is a practical basis for cell-line authentication, and applying it surfaced lines whose recorded identity did not match their genome.

The same data connect TE activity to a second process. Large copy-neutral tracts of loss of heterozygosity (LOH) had erased SNP heterozygosity across whole chromosome arms. Ongoing transposition restores TE heterozygosity but not SNP heterozygosity, and that asymmetry is what makes a later, secondary LOH event recognisable — so the interaction between the two processes, rather than either alone, is what reveals the order of events in a line's history.

<details class="research-details" markdown="1">
<summary>Evidence and inferred genome histories</summary>

**What is measured and what is inferred.** The clustering and its bootstrap support, the six-family authentication panel, and the copy-number and B-allele-frequency evidence for copy-neutral LOH are direct observations. Mitotic recombination as the mechanism behind those copy-neutral tracts, the specific histories proposed for the misidentified lines, and the reading of one line as an ancestral state of another are inferences drawn from those patterns. In the S2 subline study, likewise, the phylogeny and the copy-number differences are measured, while "ongoing episodic transposition rather than a single early burst" is a model that the insertion-site occupancy and ancestral-state analyses support rather than something observed directly.

</details>

<div class="rlist">
  <p class="rlist-label">Related papers</p>
  <div class="rlist-item">
    <h4>TE profiles reveal cell line identity and loss of heterozygosity</h4>
    <a class="rlist-link" href="https://doi.org/10.1093/genetics/iyab113" target="_blank">Paper ↗</a>
    <p>Introduced ngs_te_mapper2 and used genome-wide TE insertion profiles to authenticate <em>Drosophila</em> cell lines, and identified LOH as a mechanism shaping those genomes. First author. <em>Genetics</em>, 2021.</p>
  </div>
  <div class="rlist-item">
    <h4>Ongoing transposition reveals the phylogeny of <em>Drosophila</em> S2 sublines</h4>
    <a class="rlist-link" href="https://doi.org/10.1093/genetics/iyac077" target="_blank">Paper ↗</a>
    <p>Sequenced the genomes of 25 S2 sublines and used TE insertions as markers to reconstruct their relationships, finding that the S2 designation is paraphyletic and that copy-number evolution supports the same topology. First author. <em>Genetics</em>, 2022.</p>
  </div>
  <div class="rlist-item">
    <h4>Reproducible evaluation of TE detectors with McClintock 2</h4>
    <a class="rlist-link" href="https://doi.org/10.1186/s13100-023-00296-4" target="_blank">Paper ↗</a>
    <p>A benchmarking meta-pipeline for twelve short-read TE detectors. Per the paper's contribution statement, the pipeline was developed by P. J. Basting with contributions from J. Chen, myself and C. M. Bergman. <em>Mobile DNA</em>, 2023.</p>
  </div>
  <div class="rlist-item">
    <h4><em>P</em> element target site prediction</h4>
    <p>Machine learning models trained on engineered features to predict <em>P</em> element insertion site preferences. Unpublished Ph.D. work.</p>
  </div>
</div>

</div>
</section>

<section class="rblock" id="software">
<div class="rblock-rail">
  <span class="rblock-num">04</span>
  <span class="rblock-kicker">Open source</span>
</div>
<div class="rblock-body" markdown="1">

## Research software

Research software from my Ph.D., developed in the Bergman lab and released under open-source licences. My role differs between them, so it is stated on each.

<div class="tool-grid">
  <div class="tool-card">
    <span class="tool-name">TELR</span>
    <span class="tool-desc">TE detection and local assembly from long-read sequencing. I developed it.</span>
    <span class="tool-meta">BSD-2-Clause</span>
    <span class="tool-links">
      <a href="https://github.com/bergmanlab/TELR" target="_blank">Code ↗</a>
      <a href="https://github.com/bergmanlab/TELR#readme" target="_blank">Documentation ↗</a>
    </span>
  </div>
  <div class="tool-card">
    <span class="tool-name">ngs_te_mapper2</span>
    <span class="tool-desc">TE insertion detection from short reads, used for cell-line authentication. I developed it.</span>
    <span class="tool-meta">BSD-2-Clause</span>
    <span class="tool-links">
      <a href="https://github.com/bergmanlab/ngs_te_mapper2" target="_blank">Code ↗</a>
      <a href="https://github.com/bergmanlab/ngs_te_mapper2#readme" target="_blank">Documentation ↗</a>
    </span>
  </div>
  <div class="tool-card">
    <span class="tool-name">McClintock 2</span>
    <span class="tool-desc">Benchmarking meta-pipeline for twelve short-read TE detectors. Developed by P. J. Basting; I contributed.</span>
    <span class="tool-meta">Bergman lab project</span>
    <span class="tool-links">
      <a href="https://github.com/bergmanlab/mcclintock" target="_blank">Code ↗</a>
      <a href="https://github.com/bergmanlab/mcclintock/wiki" target="_blank">Documentation ↗</a>
    </span>
  </div>
</div>

</div>
</section>

<script>
(function() {
  var figures = document.querySelectorAll('.rfig img');
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
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Enlarge figure');
      img.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
      });
    })(figures[i]);
  }

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay || e.target === closeBtn) close();
  });
  document.addEventListener('keydown', function(e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); }
  });
})();
</script>
