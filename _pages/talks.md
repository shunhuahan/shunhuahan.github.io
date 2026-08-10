---
layout: page
title: Talks
headline: "Talks and posters"
permalink: /talks/
description: "Conference talks and posters by Shunhua Han on haplotype-resolved variant calling and transposable element biology."
---

{% assign grouped = site.data.talks | group_by: "year" | sort: "name" | reverse %}
{% for group in grouped %}
## {{ group.name }}

{% for talk in group.items %}
**{{ talk.type }}**
{{ talk.title }}
{{ talk.venue }}{% if talk.location %}, {{ talk.location }}{% endif %}{% if talk.date %}. {{ talk.date }}{% endif %}.
{% if talk.url %}[[Abstract]]({{ talk.url }}){% endif %}

{% endfor %}
{% endfor %}

<style>
/* Year headers as large display numerals with a hairline */
.page .entry h2 {
  margin: 1.8em 0 0.5em;
  padding-top: 26px;
  border-top: 1px solid #e4e7ee;
  font-family: 'Google Sans Flex', 'Inter', -apple-system, sans-serif;
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #2f5fe0;
}
.page .entry h2:first-child { margin-top: 0.4em; border-top: none; padding-top: 0; }
html.dark .page .entry h2 { color: #5b8dff; border-top-color: #262b3a; }
</style>
