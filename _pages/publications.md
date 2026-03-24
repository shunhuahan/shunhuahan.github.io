---
layout: page
title: Publications
permalink: /publications/
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
    {% if pub.doi %}<a href="{{ pub.doi }}" class="pub-link" target="_blank">DOI</a>{% endif %}
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
  </div>
</div>
{% endfor %}

<style>
.pub-entry {
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}
.pub-entry:last-of-type { border-bottom: none; }
.pub-year {
  flex-shrink: 0;
  width: 44px;
  font-weight: 700;
  font-size: 13px;
  color: #52adc8;
  padding-top: 2px;
}
.pub-content { flex: 1; }
.pub-content p { margin: 2px 0; }
.pub-title {
  font-weight: 600;
  font-size: 15px;
  color: #1e293b;
  line-height: 1.5;
}
.pub-authors { font-size: 14px; color: #64748b; }
.pub-venue { font-size: 14px; color: #64748b; }
.pub-link {
  display: inline-block;
  margin-top: 6px;
  margin-right: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border: 1px solid #52adc8;
  border-radius: 4px;
  color: #52adc8;
  text-decoration: none !important;
  transition: background 0.15s, color 0.15s;
}
.pub-link:hover {
  background: #52adc8;
  color: #fff !important;
  text-decoration: none !important;
}
html.dark .pub-title { color: #e2e8f0; }
html.dark .pub-authors,
html.dark .pub-venue { color: #94a3b8; }
html.dark .pub-entry { border-bottom-color: #334155; }
</style>
