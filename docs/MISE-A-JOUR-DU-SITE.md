# Mettre à jour le site kazi-funding.org

Le site est chez Hostinger. **Il ne se met pas à jour tout seul** : après chaque
changement sur GitHub, il faut envoyer à la main le ou les fichiers modifiés.
Compte environ 10 minutes.

## Liens utiles

| À quoi ça sert | Lien |
|---|---|
| Le dépôt GitHub | https://github.com/zeke321/kazi-website |
| Les pull requests | https://github.com/zeke321/kazi-website/pulls |
| Hostinger | https://hpanel.hostinger.com/websites |
| Le site en ligne | https://kazi-funding.org |

## 1. Demander la modification à l'IA

Dans Claude, écris simplement ce que tu veux, par exemple :

> Sur le site KAZI, change [ce que tu veux]. Fais une pull request et dis-moi
> quels fichiers envoyer sur Hostinger.

L'IA te donne le lien de la pull request et la liste des fichiers à envoyer
(le plus souvent un seul : `index.html`).

## 2. Valider la modification sur GitHub

1. Ouvre le lien de la pull request.
2. Clique sur le bouton vert **Merge pull request**, puis **Confirm merge**.

## 3. Télécharger le fichier modifié

1. Ouvre https://github.com/zeke321/kazi-website/tree/main/public
2. Clique sur le fichier (par exemple `index.html`).
3. Clique sur l'icône **Download raw file** (flèche vers le bas, en haut à droite).

## 4. Envoyer le fichier sur Hostinger

1. Ouvre https://hpanel.hostinger.com/websites
2. À côté de **kazi-funding.org**, clique sur **File manager**.
3. Clique sur **Access files of kazi-funding.org**.
4. Ouvre le dossier **public_html**.
5. Pour garder une copie de l'ancien fichier : clic droit dessus → **Rename** →
   ajoute `.old` à la fin du nom.
6. Clique sur **Upload** et choisis le nouveau fichier.

Si le fichier est dans un sous-dossier sur GitHub (par exemple `css/site.css`),
envoie-le dans le même sous-dossier de `public_html`.

## 5. Vérifier

Ouvre https://kazi-funding.org et appuie sur **Ctrl + F5**. Le changement doit
apparaître. Sinon, supprime le nouveau fichier et enlève `.old` à l'ancien.

## À savoir

- N'envoie que les fichiers modifiés, jamais tout le dossier.
- Le fichier `.github/workflows/deploy.yml` est prévu pour un VPS, que nous
  n'avons pas : il ne met pas le site à jour.
