---
layout: page
title: Research
headline: "When the genome repeats itself"
permalink: /research/
wide: true
description: "Research on haplotype-resolved variant calling in complex genomic regions and transposable element detection in Drosophila, by Shunhua Han."
---

My work connects paralogous genes, copy-number variation and transposable elements: finding which copies are present, what they carry, and how they evolved.

<nav class="research-index" aria-label="Research topics">
  <a href="#trupath">MRJD / TruPath</a><a href="#hba">Alpha-globin</a><a href="#telr">TELR &amp; evolution</a><a href="#software">Software</a>
</nav>

<section class="rblock" id="paralogs">
<div class="rblock-rail">
  <span class="rblock-num">01</span>
  <span class="rblock-kicker">Human clinical genomics research</span>
</div>
<div class="rblock-body" markdown="1">

## Resolving genes that look alike

{% include project-summary.html anchor="trupath" %}

Short reads can fit a gene and its paralog equally well. The highly similar subregions of pairs such as *SMN1/SMN2* and *PMS2/PMS2CL* leave few distinguishing bases to anchor them. Explore that ambiguity below.

{% include mappability-demo.html %}

### From conventional MRJD to proximity-enabled MRJD

Conventional MRJD analyses paralogous regions together, retaining reads that map ambiguously. In high-sensitivity mode it can detect an allele even when its paralog assignment remains unresolved. TruPath Genome adds physical linkage evidence, supporting reconstruction and assignment of individual copies and haplotypes.

{% include linkage-schematic.html %}

<details class="research-details" markdown="1">
<summary>Detection, assignment &amp; release support</summary>

**Conventional MRJD**, available in DRAGEN from v4.3, analyses a gene and its paralogs jointly and keeps the ambiguously mapping reads a conventional caller discards. On *PMS2* it reports recall of approximately 99.7% for SNVs and 97.1% for indels against a long-range PCR truth set. Those figures measure *detection* — whether the allele was found at all. They are not a measure of assignment: in high-sensitivity mode an allele can be detected while its placement stays ambiguous, and the Illumina article describes exactly this, with such alleles reported in both *PMS2* and *PMS2CL*. Calls from that workflow are not phased. [Read the conventional MRJD article](https://www.illumina.com/science/genomics-research/articles/PMS2-small-variant-detection.html).

**Proximity-enabled MRJD** adds evidence the short reads never carried. TruPath Genome (formerly Constellation) is an Illumina on-flowcell chemistry — I work on the analysis side, not the sequencing technology — that captures and tagments DNA in spatially proximal nanowells, so reads descended from the same original molecule stay physically linked. MRJD uses that linkage to estimate total copy number, reconstruct each individual copy, and then assign the reconstructed copies. It is this linkage, not the earlier recall statistics, that supports copy reconstruction and assignment; the older numbers were measured on a workflow that did not attempt either.

What "assignment" means depends on the locus. For non-tandem paralogs such as *SMN1* and *SMN2*, which sit far apart in the reference, proximity information assigns each reconstructed copy to the locus it most likely came from. For tandem paralogs such as *CYP21A2* and *CYP21A1P*, which sit side by side, it instead groups copies onto the same chromosome — that is phasing. Calling one of those two chromosome haplotypes maternal and the other paternal is a further step that requires parental genotypes; linkage alone does not supply it.

The application note records that *CFC1*, *IKBKG* and *HYDIN* were evaluated but were **not** supported in TruPath Genome with MRJD in DRAGEN v4.5, This describes the evaluated release, not current availability.

</details>

### A worked case: *PMS2* and *PMS2CL*

*PMS2* and *PMS2CL* are about as tangled as it gets, and *PMS2CL* sequence can be copied into *PMS2* by gene conversion. In the figure below, MRJD separates the sample's two *PMS2* haplotypes: one carries a *PMS2CL*-to-*PMS2* gene conversion tract, and *PMS2CL* itself is deleted on both haplotypes. The application note reports this configuration as consistent with the sample's prior characterization.

Gene conversion can transfer damaging sequence, but its effect depends on the changes transferred. The source classifies this particular haplotype as non-functional without identifying a causal variant.

<figure class="rfig">
  <img src="/images/research-pms2-schematic.jpg" width="1400" height="787" loading="lazy" alt="Alignment tracks for two reconstructed PMS2 haplotypes. Haplotype 1 carries a PMS2CL-to-PMS2 gene conversion tract and is annotated non-functional; haplotype 2 is unaffected. PMS2CL is deleted on both haplotypes.">
  <figcaption><span class="fig-label">Figure 1</span>Two reconstructed <em>PMS2</em> haplotypes. The source classifies haplotype 1, which carries a gene-conversion tract, as non-functional; haplotype 2 is unaffected. <em>PMS2CL</em> is deleted on both. This classification belongs to the characterized case; the source does not identify the disrupting change.</figcaption>
</figure>

</div>
</section>

<section class="rblock" id="alpha-globin">
<div class="rblock-rail"><span class="rblock-num">02</span><span class="rblock-kicker">Copy-number variation</span></div>
<div class="rblock-body" markdown="1">

## Counting alpha-globin copies

{% include project-summary.html anchor="hba" %}

<div class="rlist">
  <p class="rlist-label">Related work</p>

  <div class="rlist-item">
    <h4>Benchmarking germline CNV callers for clinical applications</h4>
    <a class="rlist-link" href="https://doi.org/10.1093/bioadv/vbaf071" target="_blank">Paper ↗</a>
    <p>A multi-author benchmark of short-read WGS copy-number callers against reference cell lines, quantifying how far current tools fall short of clinical sensitivity. I am one of twelve authors. <em>Bioinformatics Advances</em>, 2025.</p>
  </div>
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
  <figcaption><span class="fig-label">Figure 2</span>The TELR pipeline: identify candidate TE insertion loci from structural variant calls, locally assemble and polish a contig spanning the insertion, identify the TE family and its reference coordinates, then estimate the insertion's intra-sample allele frequency from read depth.</figcaption>
</figure>

### What the family trees actually show

Because TELR reconstructs the sequence of each insertion rather than only its location, we could build family trees for the most active TE families and ask how the extra copies in the S2R+ cell line are related to one another.

The answer turned out to depend on the family. The paper identifies a single expansion clade for *1731*, *gypsy*, *gypsy1*, *mdg3* and *Stalker2*, consistent with proliferation from one source lineage. It identifies multiple expansion clades for *jockey*, *Juan* and *3S18*. So the pattern is family-dependent, not uniform.

These sequence phylogenies reveal relationships among copies, not the number of separate introductions into the culture.

<figure class="rfig">
  <img src="/images/research-telr-phylogeny.jpg" width="1288" height="1300" loading="lazy" alt="Phylogenetic trees for four transposable element families (1731, 297, jockey, and Juan) built from TELR-assembled insertion sequences, with highlighted clades marking expansions in the S2R+ cell line">
  <figcaption><span class="fig-label">Figure 3</span>Family trees for four TE families, built from sequences TELR assembled directly from long reads. Highlighted clades mark expansions in S2R+. The paper reports a single expansion clade for <em>1731</em> and multiple expansion clades for <em>jockey</em> and <em>Juan</em>, so expansion is family-dependent rather than uniformly single-source.</figcaption>
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
