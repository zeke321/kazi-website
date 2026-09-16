# KAZI Startfunding website

The website of KAZI Startfunding: interest-free, local-currency loans for entrepreneurs in Tanzania and Chad.

It's a static one-page site with no build step, in 3 languages (EN / FR / SW). All content lives in `public/data/*.json`.

| Document | For |
|---|---|
| [HOW-TO-UPDATE-THE-WEBSITE.md](HOW-TO-UPDATE-THE-WEBSITE.md) | volunteers: how to change content |
| [SHIP-IT.md](SHIP-IT.md) | webmaster: domain, GitHub, VPS, Pages CMS setup |
| [DATA-SCHEMA.md](DATA-SCHEMA.md) | the format of every data file (for people and AI) |
| [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md) | content still to confirm with the team |

## Run it on your computer

```bash
python -m http.server 8000 --directory public
```

Then open http://localhost:8000. Check the data with `python scripts/check_data.py`.

## How publishing works

Push to `main` publishes the live site. Push to `preview` publishes preview.<domain>. See `.github/workflows/deploy.yml`, `deploy/Caddyfile` and `deploy/setup-vps.sh`.
