# shunhuahan.github.io

Personal academic website for [Shunhua Han](https://shunhuahan.github.io), Ph.D. — Sr. Staff Bioinformatics Scientist at Illumina. Built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages, based on the [Reverie](https://github.com/amitmerchant1990/reverie) theme with a custom design (card layout, dark mode, data-driven publications/talks).

## Structure

- `_config.yml` — site name, description, social links (`footer-links`)
- `_pages/` — About, Research, Publications, Talks (each a Markdown page with `layout: page`)
- `_data/publications.yml` — journal articles, patents, and thesis entries rendered on the Publications page and in the homepage "Recent News" feed
- `_data/talks.yml` — conference talks and posters rendered on the Talks page and in "Recent News"
- `_posts/` — reading notes / blog posts, rendered on `/notes/`
- `_layouts/` — `default.html` (shell, nav, footer, dark-mode toggle), `page.html`, `post.html`
- `_includes/` — `home-styles.html` (homepage-specific CSS), `meta.html` (OpenGraph/Twitter tags), `analytics.html` / `analytics_head.html` (GA hooks, off by default)
- `assets/style.scss` — main stylesheet (imports `_sass/*`)
- `index.html` — homepage (About content + Recent News + Contact)

## Updating content

- **New publication or talk:** add an entry to `_data/publications.yml` or `_data/talks.yml`. Journal publications and talks with the most recent `sort_date` automatically surface in the homepage "Recent News" section.
- **New note/post:** add a file to `_posts/` named `YYYY-MM-DD-title.md` with `layout: post` front matter.
- **Bio, experience, links:** edit `_pages/about.md` (full About page) and the sidebar in `index.html` (homepage).

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Site will be available at `http://localhost:4000`.

## License

MIT (see [LICENSE](LICENSE)), inherited from the Reverie theme this site was originally based on.
