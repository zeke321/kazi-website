# Data files (source of truth for the website)

All content lives in `public/data/*.json`. The page (`public/index.html` + `public/js/app.js`) renders from these files. No build step.
Every human-readable text is an object `{ "en": "...", "fr": "...", "sw": "..." }`. Missing languages fall back to English.
Image paths are relative to `public/` (e.g. `assets/projects/tz-2025-honey-bravu.jpg`). Images: JPG, max 1200px on the long side, under ~300 KB.

## public/data/projects.json
```json
{ "projects": [ {
  "id": "tz-2025-honey-bravu",          // kebab-case, unique: <country>-<year>-<short-name>
  "country": "tz",                       // "tz" | "td"
  "place": "Ifakara",                    // village / town
  "year": 2025,                          // number: year the loan was granted
  "category": "food",                    // agriculture | crafts | health | food | services | culture | tech
  "status": "ongoing",                   // ongoing | completed
  "second_loan": true,                   // true if this entry is a 2nd (or later) loan
  "title":   { "en": "", "fr": "", "sw": "" },   // short, sentence case, e.g. "Honey production: Bravu (2nd loan)"
  "people":  "Bravu group",              // entrepreneur(s) name(s), not translated
  "summary": { "en": "", "fr": "", "sw": "" },   // 1–3 sentences, max ~45 words
  "amount":  "TZS 3,000,000 (≈ CHF 1,000)",      // optional; "" if unknown
  "photo":   "assets/projects/tz-2025-honey-bravu.jpg", // "" if none
  "report":  "2025",                     // id of the report in reports.json that tells this story
  "featured": false,                     // optional: true = one of the 3 big photos at the top of the page
  "note":    ""                          // INTERNAL, never shown: open questions for the team
} ] }
```
Order: newest year first.

## public/data/team.json
```json
{ "teams": [ {
  "id": "ch",                               // ch | tz | td
  "name":  { "en": "Board / Comité, KAZI Switzerland", "fr": "", "sw": "" },
  "intro": { "en": "", "fr": "", "sw": "" },
  "members": [ {
    "name": "Blandine Piaget",
    "role": { "en": "Vice-President", "fr": "Vice-présidente", "sw": "Makamu Mwenyekiti" },
    "bio":  { "en": "", "fr": "", "sw": "" },   // "" = shows "Bio coming soon"
    "photo": "assets/team/ch-blandine-piaget.jpg"   // square crop, ~600x600
  } ]
} ] }
```

## public/data/partners.json
`{ "intro": {en,fr,sw}, "partners": [ { "name": "", "url": "", "logo": "assets/partners/x.png" } ] }`

## public/data/reports.json
`{ "reports": [ { "id": "2025", "label": "2025", "subtitle": {en,fr,sw}, "latest": true, "pdf_en": "reports/...pdf", "pdf_fr": "reports/...pdf" } ] }`

## public/data/stats.json
`{ "stats": [ { "value": "50+", "label": {en,fr,sw} } ] }`
