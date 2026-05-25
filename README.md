# AlternanceHub 🌿

Job board style **Welcome to the Jungle** affichant des offres d'alternance en Île-de-France.

## Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** — thème dark custom
- **DM Serif Display + DM Sans** — typographie premium
- Données depuis `lib/jobs.json` (généré depuis ton Excel)

## Structure
```
job-board/
├── app/
│   ├── layout.js        ← fonts, metadata, global styles
│   ├── page.js          ← charge les données JSON
│   └── globals.css      ← thème dark, animations
├── components/
│   └── JobBoard.js      ← toute la logique UI (filtres, search, cards, pagination)
└── lib/
    └── jobs.json        ← tes 906 offres d'alternance
```

## Lancer en local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Déployer sur Vercel via GitHub

### 1. Créer un repo GitHub
```bash
git init
git add .
git commit -m "Initial commit — AlternanceHub"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/alternance-hub.git
git push -u origin main
```

### 2. Connecter Vercel
1. Va sur [vercel.com](https://vercel.com) → **New Project**
2. Sélectionne ton repo GitHub `alternance-hub`
3. Vercel détecte automatiquement Next.js ✅
4. Clique **Deploy** → ton site est en ligne en 2 minutes 🎉

## Mettre à jour les offres

1. Génère un nouveau `jobs.json` depuis ton Excel :
```bash
python3 scripts/export_jobs.py
```
2. Commit + push → Vercel redéploie automatiquement.

## Fonctionnalités
- 🔍 Recherche par poste, entreprise, ville
- 🏷️ Filtres par domaine (13 catégories)
- 💰 Affichage du salaire quand disponible
- 📄 Pagination (24 offres par page)
- 🔗 Bouton "Voir l'offre" → site de l'entreprise
- 🌙 Design dark, responsive, animations fluides
