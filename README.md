# shunhuahan.github.io

Personal academic website for [Shunhua Han](https://shunhuahan.github.io), Ph.D., Sr. Staff Bioinformatics Scientist at Illumina. Built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages, based on the [Reverie](https://github.com/amitmerchant1990/reverie) theme with a custom design (card layout, dark mode, data-driven publications/talks).

## Structure

- `_config.yml`: site name, description, social links (`footer-links`)
- `_pages/`: About, Research, Publications, Talks (each a Markdown page with `layout: page`)
- `_data/publications.yml`: journal articles, conference abstracts, patents, and thesis entries rendered on the Publications page and in the homepage "Recent News" feed
- `_data/talks.yml`: conference talks and posters rendered on the Talks page and in "Recent News"
- `_layouts/`: `default.html` (shell, nav, footer, dark-mode toggle), `page.html`
- `_includes/`: `home-styles.html` (homepage CSS), `mappability-demo.html` (the interactive alignment simulation on the Research page), `meta.html` (OpenGraph/Twitter tags), `analytics.html` (GoatCounter, off unless configured)
- `assets/style.scss`: main stylesheet (imports `_sass/*`)
- `index.html`: homepage (About content + Recent News + Contact)

## Updating content

- **New publication or talk:** add an entry to `_data/publications.yml` or `_data/talks.yml`. Journal publications and talks with the most recent `sort_date` automatically surface in the homepage "Recent News" section.
- **Bio, experience, links:** edit `_pages/about.md` (full About page) and the sidebar in `index.html` (homepage).

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

### Excluding your own visits

Two independent mechanisms, both built into GoatCounter. Using both is
sensible, since each covers the other's blind spot.

**Per browser.** Visit <https://shunhuahan.github.io/#toggle-goatcounter> and
reload. This sets a `skipgc` flag in that browser's localStorage and shows a
confirmation dialog; visiting the same URL again toggles tracking back on.
Repeat once per browser and device you use (laptop, phone, work machine).
Clearing site data resets it, so it needs redoing if you wipe storage.

**Per IP.** In the GoatCounter dashboard, go to Settings → Tracking and add
your IP to "Ignore IPs". This is server side, so it survives storage clears
and needs no per-browser setup, but it only covers the networks you list and
will miss you on mobile data or while travelling.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Site will be available at `http://localhost:4000`.

## License

MIT (see [LICENSE](LICENSE)), inherited from the Reverie theme this site was originally based on.
