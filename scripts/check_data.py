"""Checks the website data files before publishing.

Run from the repository root:  python scripts/check_data.py
It stops the deploy with a clear message if a JSON file is broken, a required field
is missing, or a photo/PDF path points to a file that does not exist.
"""
import json
import sys
from pathlib import Path

PUBLIC = Path(__file__).resolve().parent.parent / "public"
CATEGORIES = {"agriculture", "crafts", "health", "food", "services", "culture", "tech"}
errors = []


def load(name):
    path = PUBLIC / "data" / f"{name}.json"
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        errors.append(f"data/{name}.json cannot be read: {e}")
        return {}


def need_file(where, rel):
    if rel and not (PUBLIC / rel).is_file():
        errors.append(f"{where}: file not found: {rel}")


def need_text(where, obj, field):
    v = obj.get(field)
    if not isinstance(v, dict) or not v.get("en"):
        errors.append(f"{where}: '{field}' needs at least an English (en) text")


reports = load("reports").get("reports", [])
report_ids = {r.get("id") for r in reports}
for r in reports:
    need_file(f"report {r.get('id')}", r.get("pdf_en"))
    need_file(f"report {r.get('id')}", r.get("pdf_fr"))

projects = load("projects").get("projects", [])
seen = set()
for i, p in enumerate(projects):
    where = f"project #{i + 1} ({p.get('id', '?')})"
    if p.get("id") in seen:
        errors.append(f"{where}: the id is used twice")
    seen.add(p.get("id"))
    if p.get("country") not in {"tz", "td"}:
        errors.append(f"{where}: country must be tz or td")
    if not isinstance(p.get("year"), int):
        errors.append(f"{where}: year must be a number like 2025")
    if p.get("category") not in CATEGORIES:
        errors.append(f"{where}: category must be one of {sorted(CATEGORIES)}")
    if p.get("status") not in {"ongoing", "completed"}:
        errors.append(f"{where}: status must be ongoing or completed")
    need_text(where, p, "title")
    need_text(where, p, "summary")
    need_file(where, p.get("photo"))
    if p.get("report") and p["report"] not in report_ids:
        errors.append(f"{where}: report '{p['report']}' is not in reports.json")

for team in load("team").get("teams", []):
    for m in team.get("members", []):
        where = f"team {team.get('id')} / {m.get('name')}"
        need_text(where, m, "role")
        need_file(where, m.get("photo"))

for p in load("partners").get("partners", []):
    need_file(f"partner {p.get('name')}", p.get("logo"))

load("stats")
load("texts")

for f in PUBLIC.rglob("*"):
    if f.is_file() and f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"} and f.stat().st_size > 600_000:
        errors.append(f"{f.relative_to(PUBLIC)} is {f.stat().st_size // 1000} KB: compress photos below ~300 KB")

if errors:
    print("Problems found:\n- " + "\n- ".join(errors))
    sys.exit(1)
print(f"All good: {len(projects)} projects, {len(reports)} reports.")
