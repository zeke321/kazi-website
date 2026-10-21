# Site web KAZI

Code et contenu du site de KAZI Suisse : https://kazi-funding.org

Le site est statique (HTML, CSS, JavaScript) et se trouve dans `public/`. Les textes,
projets, équipe et chiffres sont dans `public/data/*.json`.

## Faire un changement sur le site

Quatre étapes. Aucune connaissance technique n'est nécessaire pour les trois premières.

| # | Étape | Où |
|---|---|---|
| 1 | **Demander le changement** à l'IA (Claude) : « Sur le site KAZI, change [...]. Fais une pull request et dis-moi quels fichiers envoyer sur Hostinger. » | Claude |
| 2 | **Valider** : ouvrir la pull request et cliquer sur **Merge pull request** | [Pull requests](https://github.com/zeke321/kazi-website/pulls) |
| 3 | **Télécharger** le ou les fichiers modifiés (bouton *Download raw file*) | [Dossier `public/`](https://github.com/zeke321/kazi-website/tree/main/public) |
| 4 | **Envoyer** ces fichiers sur Hostinger (File manager → `public_html`) | [Hostinger](https://hpanel.hostinger.com/websites) |

> **Le site ne se met pas à jour tout seul.** Tant que l'étape 4 n'est pas faite, le
> changement n'est visible que sur GitHub.

Le détail de chaque clic est dans **[docs/MISE-A-JOUR-DU-SITE.md](docs/MISE-A-JOUR-DU-SITE.md)**.

## Liens utiles

- Site en ligne : https://kazi-funding.org
- Dépôt GitHub : https://github.com/zeke321/kazi-website
- Hostinger : https://hpanel.hostinger.com/websites
- Questions ou problèmes : [ouvrir une issue](https://github.com/zeke321/kazi-website/issues)

## Règles

- `main` est la version de référence du site. Pas de modification directe : tout passe
  par une pull request relue par une personne.
- Seul le responsable ([@zeke321](https://github.com/zeke321)) fusionne dans `main`.
- Pour contribuer depuis un compte GitHub : voir [CONTRIBUTING.md](CONTRIBUTING.md) (en anglais).

## Contenu du dépôt

| Dossier | Contenu |
| --- | --- |
| `public/` | Le site. Tout ce qui est ici est envoyé sur Hostinger. |
| `public/data/` | Contenu modifiable : projets, équipe, partenaires, rapports, chiffres, textes. |
| `public/assets/` | Photos et logos. |
| `public/reports/` | Rapports d'activité (PDF). |
| `scripts/check_data.py` | Vérifie les fichiers de données. |
| `docs/` | Documentation. |
| `deploy/`, `.github/workflows/deploy.yml` | Prévus pour un VPS. **Inutilisés aujourd'hui.** Ne pas toucher. |

## Tester sur son ordinateur (optionnel)

```bash
git clone https://github.com/zeke321/kazi-website.git
cd kazi-website
python scripts/check_data.py
python -m http.server 8000 --directory public
```

Puis ouvrir <http://localhost:8000>.
