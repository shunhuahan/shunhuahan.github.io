---
layout: page
title: Talks
headline: "Talks and posters"
permalink: /talks/
description: "Conference talks and posters by Shunhua Han on haplotype-resolved variant calling and transposable element biology."
---

Conference presentations, most recent first.

{% assign grouped = site.data.talks | group_by: "year" | sort: "name" | reverse %}
{% for group in grouped %}
<section class="talk-year">
  <h2>{{ group.name }}</h2>
  {% for talk in group.items %}
  <div class="pub-entry">
    <div class="pub-year">{{ talk.type }}</div>
    <div class="pub-content">
      <p class="pub-title">{{ talk.title }}</p>
      <p class="pub-venue">{{ talk.venue }}{% if talk.location %}, {{ talk.location }}{% endif %}{% if talk.date %} · {{ talk.date }}{% endif %}</p>
      {% if talk.url %}<div class="pub-actions"><a href="{{ talk.url }}" class="pub-link" target="_blank">Abstract</a></div>{% endif %}
    </div>
  </div>
  {% endfor %}
</section>
{% endfor %}
