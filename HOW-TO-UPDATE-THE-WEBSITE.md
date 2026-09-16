# How to update the KAZI website

For volunteers. You don't need to know how to code.

There are two ways to change the site:

| You want to… | Use |
|---|---|
| add a project, change a team member, upload a report, swap a logo, change a key figure | **Pages CMS** (web forms), see part A |
| change page texts (About, FAQ, Donate…), the layout, colours, or add a new section | **Ask an AI** (Claude), see part B |

Every change is saved on GitHub with its full history, so **nothing is ever lost** and any mistake can be undone (part C).

---

## Where things live

- **The website:** https://*(your domain)*. The preview site is https://preview.*(your domain)*.
- **The files:** the GitHub repository `kazi-website`. Ask the current webmaster for access.
- **The editing forms:** https://app.pagescms.org, where you are invited by email.
- **Logins:** in the KAZI Drive admin sheet. **Never** in this guide, in an email or in a chat with an AI.

What's in the repository:
```
public/                  ← everything the website shows
  index.html             page layout and English texts
  data/projects.json     projects
  data/team.json         the three teams
  data/partners.json     partner logos and thank-you text
  data/reports.json      activity reports
  data/stats.json        key figures (50+, ~160, 94%, 0%)
  data/texts.json        French and Swahili versions of the page texts
  assets/                photos and logos
  reports/               PDF reports
.pages.yml               the Pages CMS forms
deploy/                  server setup (the webmaster's business)
```

---

## A. Routine changes with Pages CMS

Open https://app.pagescms.org and choose **kazi-website**. When you click **Save**, the website updates by itself within about 1–2 minutes.

### A1. Add a project
1. **Projects** → scroll to the top of the list → **Add an entry**. Newest projects go first; drag the new entry to the top.
2. Fill in the fields:
   - **ID**: lowercase with dashes, e.g. `tz-2026-bakery-anna-mushi` (country-year-short name). It must be unique.
   - **Country, Year, Category, Status**: pick from the lists. Tick **Second loan** if it is one.
   - **Title** and **Short summary** in English, French and Swahili. Keep the summary to 1–3 sentences (max ~45 words). Take the wording from the activity report. If you can't write Swahili, leave it empty (English is shown instead) and ask the Tanzania team.
   - **Amount**, written like `TZS 3,000,000 (≈ CHF 1,000)`.
   - **Photo**: upload a JPG. **Make it small first** (under 300 KB, about 1200 px wide). On a phone, "share → resize" or any "compress JPG" website works. If it's too big, the site refuses to publish and tells you why.
   - **Report ID**: the year of the report that describes it, e.g. `2026`.
3. **Save**.

### A2. Change a team member
**Teams** → open the team → **Members**. Change the name, role (3 languages), bio (3 languages) or photo (square, portrait centred).
- Leave the bio empty to show "Bio coming soon".
- To remove someone, use the entry's menu → **Remove**.

### A3. Add the new activity report
1. **Activity reports** → **Add an entry** and move it to the top.
2. ID and label = the year, e.g. `2026`. Tick **Latest report**, and **untick it on last year's report**.
3. Upload the English and French PDFs. Compress them first if they are over ~10 MB (e.g. with ilovepdf.com → Compress).

### A4. Swap or add a partner logo
**Partners** → edit or add an entry: name, website, logo.
- Logos in SVG or PNG with a transparent or white background look best.
- Some funders have rules about how their logo is used. Plan-les-Ouates, for example, requires the "Avec le soutien de…" version and a clear space around it. Check before publishing.

### A5. Update the key figures
**Key figures** → change the number and the 3 labels.

---

## B. Bigger changes: ask an AI

Use Claude (claude.ai or Claude Code) with access to the repository. Copy one of these prompts and fill in the brackets.

**Change a text on the page**
> In the KAZI website repo, change the [FAQ answer about donations] to say: "[new text]". Update the English in public/index.html and write natural French and Swahili versions in public/data/texts.json. Don't change anything else. Show me the preview before publishing.

**Add a new section**
> In the KAZI website repo, add a [News] section after [Reports] with [3 short news cards: title, date, text, photo]. Follow the existing design (colours, fonts, cards), keep the content in a new data file public/data/[news].json, add it to .pages.yml so volunteers can edit it, and support EN/FR/SW. Push to the `preview` branch first.

**Bulk content from a report**
> Here is the 2026 activity report PDF: [attach]. Add every 2026 project to public/data/projects.json following DATA-SCHEMA.md. Condense the texts from the report, write EN/FR/SW, extract and compress one photo per project to under 300 KB, and put anything uncertain in each project's "note" field. Run python scripts/check_data.py. Push to the `preview` branch and list what I should check.

**Something looks broken**
> The KAZI website at [URL] shows [what you see] on [phone/computer, browser]. Find the cause in the repo, fix it, and explain in plain words what was wrong.

Rules for AI changes:
1. **Always go through the `preview` branch first.** Look at https://preview.*(your domain)* on a computer **and** a phone.
2. If it looks right, ask the AI to "merge preview into main". The live site then updates.
3. Never give the AI passwords, and never let it change `deploy/` or GitHub secrets unless the webmaster asked.

---

## C. Check, and undo a mistake

**Check before publishing:** use the preview site (AI changes), or just reload the live site after a Pages CMS save and look at what you changed, on a phone too.

**If the site didn't update:** open GitHub → **Actions**. A red ✗ means the automatic check found a problem. Click it: the message says exactly what's wrong (e.g. "photo not found" or "photo is 2400 KB"). Fix it in Pages CMS and save again. The live site stays as it was until the problem is fixed.

**Undo a change:**
- **Easy way:** ask an AI: *"In the KAZI website repo, undo the last change to data/projects.json and publish."*
- **By hand:** GitHub → the file → **History** → open the old version → copy its content → edit the file → paste → commit.

---

## D. Handover checklist (when a volunteer leaves)

- [ ] The newcomer has been invited to Pages CMS, and to GitHub if they are the new webmaster.
- [ ] The person leaving is removed from Pages CMS and GitHub collaborators.
- [ ] **At least 2 people** (e.g. the president and the coordinator) can still administer GitHub, the VPS and the domain.
- [ ] The domain renewal date and the VPS bill are noted in the Drive admin sheet, with a card that doesn't expire with the volunteer.
- [ ] The Drive admin sheet is up to date: where each account lives and who owns it.
- [ ] The newcomer has read this guide and made one test edit on the site.
