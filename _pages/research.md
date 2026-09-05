---
layout: page
title: Research
headline: "Calling variants where the genome repeats itself"
permalink: /research/
wide: true
description: "Research on haplotype-resolved variant calling in complex genomic regions and transposable element detection in Drosophila, by Shunhua Han."
---

I develop computational methods to resolve genetic variation in repetitive and structurally complex regions of the genome — segmental duplications, gene and pseudogene pairs, and the transposable elements that keep rearranging both.

<section class="rblock" id="paralogs">
<div class="rblock-rail">
  <span class="rblock-num">01</span>
  <span class="rblock-kicker">Human clinical genomics research</span>
</div>
<div class="rblock-body" markdown="1">

## Haplotype-resolved variant calling in paralogous regions

Some of the most medically important genes in the human genome sit in the hardest places to sequence. *SMN1*, the gene behind spinal muscular atrophy, has a near-identical neighbor called *SMN2*. *PMS2*, tied to Lynch syndrome, has *PMS2CL*. *CYP21A2*, behind congenital adrenal hyperplasia, has *CYP21A1P*.

In each case the two copies share anywhere from 98% to more than 99.9% of their sequence, more than enough to confuse a standard short-read aligner. Reads pile up in the wrong place, variant calls come out wrong or missing entirely, and labs often fall back on slow, gene-specific workarounds — a cascade of MLPA and long-range PCR that adds days to weeks.

{% include mappability-demo.html %}

{% include project-summary.html anchor="trupath" %}

### From conventional MRJD to proximity-enabled MRJD

Multi-region joint detection came first as a short-read-only method, and it is worth being precise about what each version establishes, because they are often quoted together.

**Conventional MRJD**, available in DRAGEN from v4.3, analyses a gene and its paralogs jointly and keeps the ambiguously mapping reads a conventional caller discards. On *PMS2* it reports recall of approximately 99.7% for SNVs and 97.1% for indels against a long-range PCR truth set. Those figures measure *detection* — whether the allele was found at all. They are not a measure of assignment: in high-sensitivity mode an allele can be detected while its placement stays ambiguous, and the Illumina article describes exactly this, with such alleles reported in both *PMS2* and *PMS2CL*. Calls from that workflow are not phased.

**Proximity-enabled MRJD** adds evidence the short reads never carried. TruPath Genome (formerly Constellation) is an Illumina on-flowcell chemistry — I work on the analysis side, not the sequencing technology — that captures and tagments DNA in spatially proximal nanowells, so reads descended from the same original molecule stay physically linked. MRJD uses that linkage to estimate total copy number, reconstruct each individual copy, and then assign the reconstructed copies. It is this linkage, not the earlier recall statistics, that supports copy reconstruction and assignment; the older numbers were measured on a workflow that did not attempt either.

What "assignment" means depends on the locus. For non-tandem paralogs such as *SMN1* and *SMN2*, which sit far apart in the reference, proximity information assigns each reconstructed copy to the locus it most likely came from. For tandem paralogs such as *CYP21A2* and *CYP21A1P*, which sit side by side, it instead groups copies onto the same chromosome — that is phasing. Calling one of those two chromosome haplotypes maternal and the other paternal is a further step that requires parental genotypes; linkage alone does not supply it.

One version-specific detail worth keeping attached to the claim: the application note records that *CFC1*, *IKBKG* and *HYDIN* were evaluated but were **not** supported in TruPath Genome with MRJD in DRAGEN v4.5, with inclusion planned for a later release. I have kept that qualification rather than implying current availability.

### A worked case: *PMS2* and *PMS2CL*

*PMS2* and *PMS2CL* are about as tangled as it gets, and *PMS2CL* sequence can be copied into *PMS2* by gene conversion. In the figure below, MRJD separates the sample's two *PMS2* haplotypes: one carries a *PMS2CL*-to-*PMS2* gene conversion tract, and *PMS2CL* itself is deleted on both haplotypes. The application note reports this configuration as consistent with the sample's prior characterization.

Gene conversion is not loss of function by itself. A conversion tract can carry damaging sequence, but the consequence depends on which differences it transfers, and the public source does not identify the disrupting change in this sample. The non-functional annotation in the figure therefore belongs to this one characterized case, not to gene conversion as a mechanism.

<figure class="rfig">
  <img src="/images/research-pms2-schematic.jpg" alt="Alignment tracks for two reconstructed PMS2 haplotypes. Haplotype 1 carries a PMS2CL-to-PMS2 gene conversion tract and is annotated non-functional; haplotype 2 is unaffected. PMS2CL is deleted on both haplotypes.">
  <figcaption><span class="fig-label">Figure 1</span>Reconstructed copies for a sample's two <em>PMS2</em> haplotypes, from the TruPath Genome application note. Haplotype 1 carries a <em>PMS2CL</em>-to-<em>PMS2</em> gene conversion tract and is annotated as non-functional in the source figure; haplotype 2 is unaffected. <em>PMS2CL</em> is deleted on both haplotypes. The source reports the configuration as consistent with the sample's prior characterization and does not name the disrupting change.</figcaption>
</figure>

{% include project-summary.html anchor="hba" %}

<div class="rlist">
  <p class="rlist-label">Related work</p>
  <div class="rlist-item">
    <h4>Conventional MRJD for <em>PMS2</em> in standard WGS</h4>
    <a class="rlist-link" href="https://www.illumina.com/science/genomics-research/articles/PMS2-small-variant-detection.html" target="_blank">Article ↗</a>
    <p>The short-read-only predecessor to the TruPath work above, applying joint analysis of <em>PMS2</em> and <em>PMS2CL</em> to standard whole-genome sequencing. Published by the Illumina DRAGEN research team; my contribution was to the method rather than to the article.</p>
  </div>
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
  <span class="rblock-num">02</span>
  <span class="rblock-kicker">Genome evolution</span>
</div>
<div class="rblock-body" markdown="1">

## Detecting and analyzing transposable elements in *Drosophila*

Transposable elements, or TEs, are stretches of DNA that can copy themselves and move around the genome. They make up nearly half of the human genome and are a major source of genetic variation across animals, *Drosophila* included. For my Ph.D. in [Casey Bergman](https://bergmanlab.github.io)'s lab at the University of Georgia, I worked on how to find and study them in genomes that are unusually messy: cultured cell lines, which pick up extra chromosome copies, structural rearrangements, and new TE insertions the longer they sit in a flask.

{% include project-summary.html anchor="telr" %}

<figure class="rfig">
  <img src="/images/research-telr-workflow.png" alt="TELR workflow diagram showing four stages: identifying TE insertion candidate loci from structural variant calls, assembling and polishing a local TE contig, identifying the TE insertion family and reference coordinates, and estimating intra-sample allele frequency">
  <figcaption><span class="fig-label">Figure 2</span>The TELR pipeline: identify candidate TE insertion loci from structural variant calls, locally assemble and polish a contig spanning the insertion, identify the TE family and its reference coordinates, then estimate the insertion's intra-sample allele frequency from read depth.</figcaption>
</figure>

### What the family trees actually show

Because TELR reconstructs the sequence of each insertion rather than only its location, we could build family trees for the most active TE families and ask how the extra copies in the S2R+ cell line are related to one another.

The answer turned out to depend on the family. The paper identifies a single expansion clade for *1731*, *gypsy*, *gypsy1*, *mdg3* and *Stalker2*, consistent with proliferation from one source lineage. It identifies multiple expansion clades for *jockey*, *Juan* and *3S18*. So the pattern is family-dependent, not uniform.

It is also worth being clear about the limit of the evidence. A sequence phylogeny of this kind constrains how copies within the culture are related to each other. It does not establish how many times a family entered the culture in the first place.

<figure class="rfig">
  <img src="/images/research-telr-phylogeny.jpg" alt="Phylogenetic trees for four transposable element families (1731, 297, jockey, and Juan) built from TELR-assembled insertion sequences, with highlighted clades marking expansions in the S2R+ cell line">
  <figcaption><span class="fig-label">Figure 3</span>Family trees for four TE families, built from sequences TELR assembled directly from long reads. Highlighted clades mark expansions in S2R+. The paper reports a single expansion clade for <em>1731</em> and multiple expansion clades for <em>jockey</em> and <em>Juan</em>, so expansion is family-dependent rather than uniformly single-source.</figcaption>
</figure>

### Why the biology matters

TE insertions are individually rare and densely scattered, which makes them unusually good markers for telling cell lines apart. In *Drosophila* cell culture, genome-wide TE insertion profiles cluster replicate samples of the same line with 100% bootstrap support, and a panel of just six LTR retrotransposon families is enough to assign a sample correctly. That is a practical basis for cell-line authentication, and applying it surfaced lines whose recorded identity did not match their genome.

The same data connect TE activity to a second process. Large copy-neutral tracts of loss of heterozygosity (LOH) had erased SNP heterozygosity across whole chromosome arms. Ongoing transposition restores TE heterozygosity but not SNP heterozygosity, and that asymmetry is what makes a later, secondary LOH event recognisable — so the interaction between the two processes, rather than either alone, is what reveals the order of events in a line's history.

**What is measured and what is inferred.** The clustering and its bootstrap support, the six-family authentication panel, and the copy-number and B-allele-frequency evidence for copy-neutral LOH are direct observations. Mitotic recombination as the mechanism behind those copy-neutral tracts, the specific histories proposed for the misidentified lines, and the reading of one line as an ancestral state of another are inferences drawn from those patterns. In the S2 subline study, likewise, the phylogeny and the copy-number differences are measured, while "ongoing episodic transposition rather than a single early burst" is a model that the insertion-site occupancy and ancestral-state analyses support rather than something observed directly.

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
  <span class="rblock-num">03</span>
  <span class="rblock-kicker">Open source</span>
</div>
<div class="rblock-body" markdown="1">

## Software

Research software from my Ph.D., developed in the Bergman lab and released under open-source licences. My role differs between them, so it is stated on each.

<div class="tool-grid">
  <div class="tool-card">
    <span class="tool-name">TELR</span>
    <span class="tool-desc">TE detection and local assembly from long-read sequencing. I developed it.</span>
    <span class="tool-meta">BSD-2-Clause</span>
    <span class="tool-links">
      <a href="https://github.com/bergmanlab/TELR" target="_blank">Code ↗</a>
      <a href="https://github.com/bergmanlab/TELR/releases" target="_blank">Releases ↗</a>
    </span>
  </div>
  <div class="tool-card">
    <span class="tool-name">ngs_te_mapper2</span>
    <span class="tool-desc">TE insertion detection from short reads, used for cell-line authentication. I developed it.</span>
    <span class="tool-meta">BSD-2-Clause</span>
    <span class="tool-links">
      <a href="https://github.com/bergmanlab/ngs_te_mapper2" target="_blank">Code ↗</a>
      <a href="https://github.com/bergmanlab/ngs_te_mapper2/releases" target="_blank">Releases ↗</a>
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
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
})();
</script>
