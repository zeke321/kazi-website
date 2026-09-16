# Ship it: from this folder to a live website

This is Luka's checklist. You do the account and payment steps, since they need your logins. Claude (or another AI) does the file work.
**Never paste passwords or private keys into a chat.** The deploy key below goes straight into GitHub.

```
 you edit ─► GitHub repo ─► GitHub Action ─► your VPS (Caddy, HTTPS) ─► https://your-domain
 (Pages CMS forms, or AI edits)   checks the data, then uploads the public/ folder
```

| What | Where | Cost |
|---|---|---|
| Code and content | GitHub repo, e.g. `github.com/<you>/kazi-website` | free |
| Website server | your VPS: Ubuntu 22.04/24.04 or Debian 12, runs Caddy | what you already pay |
| Domain | a registrar such as Infomaniak, Porkbun, Namecheap or Cloudflare | ~10–15 CHF/yr |
| Volunteer editing | pagescms.org, connected to the repo | free |

---

## 1. Buy the domain (10 min)

These names were **not registered** on 16 Sep 2026 (checked in the public registry, so buy soon):

| Domain | Why |
|---|---|
| **kazistartfunding.org** | full brand name, .org suits a non-profit |
| **kazifunding.org** | short, closest to the current kazi-funding.org |
| kazi-funding.ch / kazifunding.ch | Swiss association, very cheap at Infomaniak |
| kazistartfunding.com / kazifunding.com | .com fallback |

Tips:
- Turn on **auto-renew** and **WHOIS privacy**.
- Register it with an email KAZI keeps, ideally communication@kazi-funding.org, so it survives volunteer turnover.
- Don't buy the hosting/email extras. You only need the domain.

> **Heads-up:** KAZI already owns **kazi-funding.org** (at Wix, on printed material and in grant files). A good plan is to use the new domain now for the review with Margaux. Later, point kazi-funding.org at the same VPS too: add it to the Caddyfile and change only its A record in Wix. Both names will then work, and email stays untouched.

## 2. Point the domain at your VPS (5 min + waiting)

In the registrar's DNS settings, add:

| Type | Name | Value |
|---|---|---|
| A | `@` | your VPS IPv4 address |
| A | `www` | your VPS IPv4 address |
| A | `preview` | your VPS IPv4 address |
| AAAA (only if your VPS has IPv6) | `@`, `www`, `preview` | your VPS IPv6 address |

Check it's done with `nslookup your-domain.org`: it should print your VPS IP. This usually takes a few minutes, and at most a few hours.

## 3. Put the code on GitHub (10 min)

1. On github.com: **New repository**. Name it `kazi-website`, make it **Public** (Actions minutes are unlimited for public repos), and don't add a README.
2. Ask Claude: *"Push kazi-site to https://github.com/<you>/kazi-website"*. Or do it yourself in this folder:
   ```bash
   git remote add origin https://github.com/<you>/kazi-website.git
   ```
   ```bash
   git push -u origin main
   ```
   Git opens a browser window to log in to GitHub the first time.
3. Recommended: add **Margaux** as a collaborator (Settings → Collaborators), so KAZI never depends on one person. The repo can be moved to a KAZI organisation later without losing anything (Settings → Transfer).

## 4. Set up the VPS (15 min)

SSH into the VPS as root (or a sudo user), then:

```bash
git clone https://github.com/<you>/kazi-website.git /root/kazi-website
```
```bash
bash /root/kazi-website/deploy/setup-vps.sh your-domain.org
```

The script installs Caddy (automatic HTTPS), a firewall (only SSH/80/443 open), automatic security updates and a `deploy` user. At the end it prints **two values**:

- **VPS_HOST**: the server IP.
- **VPS_SSH_KEY**: a private key that can only upload files into `/var/www/kazi`.

Copy both into GitHub: **repo → Settings → Secrets and variables → Actions → New repository secret**. Then close the terminal; the key is deleted from the server.

> Is something else already using ports 80/443 on the VPS (nginx, Apache, Docker)? Stop before running the script and ask Claude. The Caddyfile then goes into the existing web server's setup instead.

## 5. First deploy (2 min)

GitHub → **Actions** → *Deploy website* → **Run workflow** (branch `main`). When it's green:

- open **https://your-domain.org**; the HTTPS certificate appears within a minute of the first visit;
- test on a phone: language switch, project filters, "Show more projects", team "See more".

**Preview site:** push to a branch called `preview` and it appears at https://preview.your-domain.org, hidden from Google. Use it to show Margaux changes before merging to `main`.

## 6. Volunteer editing with Pages CMS (10 min)

1. Go to **https://app.pagescms.org**, sign in with GitHub, and pick the `kazi-website` repo.
2. The forms (Projects, Teams, Partners, Activity reports, Key figures) come from `.pages.yml`.
3. Make a test edit, for example change a key figure, and **Save**. GitHub Actions deploys it and the site updates in ~1 minute.
4. Invite a volunteer: Pages CMS → Settings → Collaborators → invite by email. **Check that the invite works without a GitHub account**; the research flagged this as unverified.

## 7. Before the review with Margaux (week of 21 Sep)

Open questions are listed in `OPEN-QUESTIONS.md`. Go through them together on the live preview.

## When the site is final

- Point **kazi-funding.org** at the VPS too:
  1. Add `kazi-funding.org, www.kazi-funding.org` to the first line of `deploy/Caddyfile` and redeploy it on the server with `bash deploy/setup-vps.sh <domain>`.
  2. In Wix → Domains → Manage DNS records, change **only** the A/CNAME records for `@` and `www`. **Leave MX and TXT alone**, or email breaks.
- Wix: keep the old site unpublished as a backup, and turn off auto-renew of the *site plan* (not the domain).
