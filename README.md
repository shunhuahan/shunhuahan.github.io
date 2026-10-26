# shunhuahan.github.io

Personal academic website for [Shunhua Han](https://shunhuahan.github.io), Ph.D., Sr. Staff Bioinformatics Scientist at Illumina. Built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages. The design is a stack of torn paper sheets with ink-and-watercolour drawings (inspired by kevintngo.com, with a nod to Calvin and Hobbes); originally based on the [Reverie](https://github.com/amitmerchant1990/reverie) theme.

## Structure

- `_config.yml`: site name, description, analytics
- `index.html`: home page (explorer scene, About, background plates on segmental duplications, selected work, Recently)
- `_pages/research.html`, `_pages/publications.html`: Research, and Publications with talks and posters. `about.md` and `talks.md` redirect old URLs to `/#about` and `/publications/#talks`.
- `_data/publications.yml`, `_data/talks.yml`: every publication and talk; the most recent journal papers, application notes and talks also surface in the home page "Recently" list
- `_data/projects.yml`: the flagship projects, shared by the home page prints and the Research summary cards
- `_layouts/`: `default.html` (head, shared SVG filters, footer, scripts) and `redirect.html`
- `_includes/`: `nav.html`, `footer.html`, `note-row.html` (one publication or talk), `summary-card.html`, `paper-defs.html` (the ink and watercolour SVG filters), `meta.html`, `analytics.html`
- `assets/site.js`: every drawing (the scene, plates, figures and footer) is generated here into the page's empty `<svg>` elements by id
- `assets/style.scss`: imports `_sass/_tokens.scss` (palette, faces and paper textures as CSS custom properties) plus `_paper`, `_home`, `_research` and `_pages`. Pages carry no `<style>` blocks. GitHub Pages (github-pages 232) compiles with Ruby Sass 3.7.4, which treats `max()` as a Sass function, so CSS `max()` values are written as `unquote("max(...)")`, and which cannot parse a data-URI `url()` directly in a custom property, so those are Sass variables interpolated into the token.

## Two languages

The site is in English and Chinese. English pages live at `/`, `/research/` and `/publications/`; their Chinese counterparts are `zh/index.html` (`/zh/`), `_pages/research_zh.html` and `_pages/publications_zh.html`. Each page names its counterpart in `alt_url`, which drives the language switch in the navigation and the `hreflang` links. Chinese pages set `lang: zh`.

- Interface strings (navigation, footer, publication labels) are in `_data/i18n.yml`.
- Data files carry Chinese next to English in fields ending `_zh` (`projects.yml`, `used_by.yml`, and `display_title_zh` for the Recently list). Publication titles stay in English.
- Figure labels are translated in `assets/site.js`: on a Chinese page, every label is looked up in the `ZH` table, and anything missing is drawn as written.

## Updating content

- **New publication or talk:** add an entry to `_data/publications.yml` or `_data/talks.yml`.
- **Bio, experience, links:** edit the About section of `index.html`, and of `zh/index.html` for Chinese.

## Analytics

Tracking is off until it is configured. To turn it on:

1. Sign up at [goatcounter.com](https://www.goatcounter.com) and pick a site code (the subdomain, e.g. `shunhuahan`).
2. Put that code in `_config.yml`:
   ```yml
   goatcounter: shunhuahan
   ```
3. Commit and push. Stats appear at `https://<your-code>.goatcounter.com`.

GoatCounter is cookieless, so no consent banner is required, and it ignores
requests from localhost. To turn tracking off again, blank the value out.
Do not set it to a placeholder like `none`: any non-empty string counts as
enabled, which is how the previous Google Analytics setup ended up firing a
request on every pageview with a tracking ID of `none`.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Site will be available at `http://localhost:4000`.

## License

MIT (see [LICENSE](LICENSE)), inherited from the Reverie theme this site was originally based on.
