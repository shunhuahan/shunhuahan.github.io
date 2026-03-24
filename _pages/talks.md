---
layout: page
title: Talks & Presentations
permalink: /talks/
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
---
{% endfor %}
