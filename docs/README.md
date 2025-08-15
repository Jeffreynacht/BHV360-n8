# 📚 BHV360 Documentation

Deze directory bevat de volledige documentatie website voor BHV360, gebouwd met Next.js en gedeployed via GitHub Pages.

## 🚀 Local Development

\`\`\`bash
cd docs
npm install
npm run dev
\`\`\`

Bezoek [http://localhost:3001](http://localhost:3001) om de documentatie lokaal te bekijken.

## 🏗️ Build & Deploy

De documentatie wordt automatisch gebouwd en gedeployed naar GitHub Pages via GitHub Actions wanneer er wijzigingen worden gepusht naar de `main` branch.

## 📁 Structuur

- `pages/` - Next.js pagina's
- `components/` - React componenten
- `content/` - Markdown content bestanden
- `styles/` - CSS styling
- `public/` - Statische assets

## 🔧 Configuratie

De site is geconfigureerd voor GitHub Pages deployment met:
- Static export via `next export`
- Correct base path configuratie
- Optimized images voor static hosting
