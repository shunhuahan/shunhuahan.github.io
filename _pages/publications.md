---
layout: page
title: Publications
headline: "Papers, patents, and abstracts"
permalink: /publications/
description: "Peer-reviewed journal articles, application notes, conference abstracts, patents, and dissertation by Shunhua Han in genomics, variant calling, and transposable element biology."
---

For a full and up-to-date list, see my [Google Scholar](https://scholar.google.com/citations?user=jweOSn4AAAAJ&hl=en) profile.

<p class="note-small">&dagger; indicates equal contribution.</p>

---

## Journal Articles

{% assign journal = site.data.publications | where: "type", "journal" %}
{% for pub in journal %}
<div class="pub-entry">
  <div class="pub-year">{{ pub.year }}</div>
  <div class="pub-content">
    <p class="pub-title">{{ pub.title }}</p>
    <p class="pub-authors">{{ pub.authors }}</p>
    <p class="pub-venue">{{ pub.venue }}</p>
    <div class="pub-actions">
      {% if pub.doi %}<a href="{{ pub.doi }}" class="pub-link" target="_blank">DOI</a>{% endif %}
      {% if pub.abstract %}<button class="pub-link pub-abstract-toggle" data-target="abstract-{{ forloop.index }}">Abstract</button>{% endif %}
    </div>
    {% if pub.abstract %}
    <div class="pub-abstract" id="abstract-{{ forloop.index }}">{{ pub.abstract }}</div>
    {% endif %}
  </div>
</div>
{% endfor %}

---

## Application Notes & Research Articles

{% assign appnotes = site.data.publications | where: "type", "appnote" %}
{% assign articles = site.data.publications | where: "type", "article" %}
{% assign industry = appnotes | concat: articles | sort: "sort_date" | reverse %}
{% for pub in industry %}
<div class="pub-entry">
  <div class="pub-year">{{ pub.year }}</div>
  <div class="pub-content">
    <p class="pub-title">{{ pub.title }}</p>
    <p class="pub-authors">{{ pub.authors }}</p>
    <p class="pub-venue">{{ pub.venue }}</p>
    <div class="pub-actions">
      {% comment %}
        The link label lives beside the url in _data/publications.yml, so it
        describes the actual destination (HTML article vs PDF application
        note) instead of being guessed from the entry type here.
      {% endcomment %}
      {% if pub.url %}<a href="{{ pub.url }}" class="pub-link" target="_blank">{{ pub.link_label }}</a>{% endif %}
      {% if pub.abstract %}<button class="pub-link pub-abstract-toggle" data-target="appnote-{{ forloop.index }}">Abstract</button>{% endif %}
    </div>
    {% if pub.abstract %}
    <div class="pub-abstract" id="appnote-{{ forloop.index }}">{{ pub.abstract }}</div>
    {% endif %}
  </div>
</div>
{% endfor %}

---

## Conference Abstracts

{% assign abstracts = site.data.publications | where: "type", "abstract" %}
{% for pub in abstracts %}
<div class="pub-entry">
  <div class="pub-year">{{ pub.year }}</div>
  <div class="pub-content">
    <p class="pub-title">{{ pub.title }}</p>
    <p class="pub-authors">{{ pub.authors }}</p>
    <p class="pub-venue">{{ pub.venue }}</p>
    {% if pub.url %}<a href="{{ pub.url }}" class="pub-link" target="_blank">Abstract</a>{% endif %}
  </div>
</div>
{% endfor %}

---

## Patents

{% assign patents = site.data.publications | where: "type", "patent" %}
{% for pub in patents %}
<div class="pub-entry">
  <div class="pub-year">{{ pub.year }}</div>
  <div class="pub-content">
    <p class="pub-title">{{ pub.title }}</p>
    <p class="pub-authors">{{ pub.authors }}</p>
    <p class="pub-venue">{{ pub.venue }}</p>
    {% if pub.patent %}<a href="{{ pub.patent }}" class="pub-link" target="_blank">Patent</a>{% endif %}
  </div>
</div>
{% endfor %}

---

## Thesis

{% assign thesis = site.data.publications | where: "type", "thesis" %}
{% for pub in thesis %}
<div class="pub-entry">
  <div class="pub-year">{{ pub.year }}</div>
  <div class="pub-content">
    <p class="pub-title">{{ pub.title }}</p>
    <p class="pub-authors">{{ pub.authors }}</p>
    <p class="pub-venue">{{ pub.venue }}</p>
    <div class="pub-actions">
      {% if pub.pdf %}<a href="{{ pub.pdf }}" class="pub-link" target="_blank">Dissertation (PDF)</a>{% endif %}
      {% if pub.thesis %}<a href="{{ pub.thesis }}" class="pub-link" target="_blank">ProQuest</a>{% endif %}
    </div>
  </div>
</div>
{% endfor %}


<script>
document.querySelectorAll('.pub-abstract-toggle').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var target = document.getElementById(btn.dataset.target);
    var open = target.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.textContent = open ? 'Hide Abstract' : 'Abstract';
  });
});
</script>
