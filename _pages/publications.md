---
layout: page
title: Publications
headline: "Papers, patents, and abstracts"
permalink: /publications/
description: "Peer-reviewed journal articles, application notes, conference abstracts, patents, and dissertation by Shunhua Han in genomics, variant calling, and transposable element biology."
---

For a full and up-to-date list, see my [Google Scholar](https://scholar.google.com/citations?user=jweOSn4AAAAJ&hl=en) profile.

&dagger; indicates equal contribution.

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
      {% if pub.url %}<a href="{{ pub.url }}" class="pub-link" target="_blank">PDF</a>{% endif %}
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
      {% if pub.pdf %}<a href="{{ pub.pdf }}" class="pub-link" target="_blank">PDF</a>{% endif %}
      {% if pub.thesis %}<a href="{{ pub.thesis }}" class="pub-link" target="_blank">ProQuest</a>{% endif %}
    </div>
  </div>
</div>
{% endfor %}

<style>
.pub-entry {
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #eef0f4;
}
.pub-entry:last-of-type { border-bottom: none; }
.pub-year {
  flex-shrink: 0;
  width: 44px;
  font-weight: 700;
  font-size: 13px;
  color: #2f5fe0;
  padding-top: 2px;
}
.pub-content { flex: 1; }
.pub-content p { margin: 2px 0; }
.pub-title {
  font-weight: 600;
  font-size: 15px;
  color: #14171f;
  line-height: 1.5;
}
.pub-authors { font-size: 14px; color: #5b6472; }
.pub-venue { font-size: 14px; color: #5b6472; }
.pub-link {
  display: inline-block;
  margin-top: 6px;
  margin-right: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border: 1px solid #2f5fe0;
  border-radius: 5px;
  color: #2f5fe0;
  text-decoration: none !important;
  transition: background 0.15s, color 0.15s;
}
.pub-link:hover {
  background: #2f5fe0;
  color: #fff !important;
  text-decoration: none !important;
}
html.dark .pub-title { color: #e7e9ee; }
html.dark .pub-authors,
html.dark .pub-venue { color: #98a2b3; }
html.dark .pub-entry { border-bottom-color: #262b3a; }
.pub-actions { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
.pub-abstract-toggle { cursor: pointer; background: none; }
.pub-abstract-toggle.open { background: #2f5fe0; color: #fff; }
.pub-abstract {
  display: none;
  margin-top: 10px;
  font-size: 13.5px;
  color: #3d4451;
  line-height: 1.65;
  background: #f4f6fb;
  border-left: 3px solid #2f5fe0;
  padding: 10px 14px;
  border-radius: 0 5px 5px 0;
}
.pub-abstract.open { display: block; }
html.dark .pub-abstract { background: #10131c; color: #98a2b3; border-left-color: #5b8dff; }
html.dark .pub-link { border-color: #5b8dff; color: #5b8dff; }
html.dark .pub-link:hover { background: #5b8dff; color: #0b0d12 !important; }
html.dark .pub-year { color: #5b8dff; }
html.dark .pub-abstract-toggle.open { background: #5b8dff; color: #0b0d12; }

/* Section labels: eyebrow style instead of default h2 */
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
