---
layout: page
lang: zh
title: 学术报告
permalink: /zh/talks/
---

{% assign grouped = site.data.talks | group_by: "year" | sort: "name" | reverse %}
{% for group in grouped %}
## {{ group.name }}

{% for talk in group.items %}
**{% if talk.type == "Platform Presentation" %}口头报告{% elsif talk.type == "Poster" %}海报展示{% elsif talk.type == "Invited Talk" %}特邀报告{% else %}{{ talk.type }}{% endif %}**
{{ talk.title }}
{{ talk.venue }}{% if talk.location %}，{{ talk.location }}{% endif %}{% if talk.date %}。{{ talk.date }}{% endif %}.
{% if talk.url %}[[摘要]]({{ talk.url }}){% endif %}

{% endfor %}
---
{% endfor %}
