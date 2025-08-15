# BHV360 GitHub Deployment Guide

## 🚀 Complete Deployment Instructies

Deze gids helpt je bij het deployen van de BHV Plotkaart applicatie naar GitHub en Vercel.

## 📋 Vereisten

- Node.js 18+ geïnstalleerd
- Git geïnstalleerd
- GitHub account
- Vercel account (optioneel)

## 🔧 Stap 1: Lokale Setup

\`\`\`bash
# Controleer Node.js versie
node --version

# Controleer npm versie
npm --version

# Installeer dependencies
npm install

# Test de build
npm run build
\`\`\`

## 🐙 Stap 2: GitHub Repository Setup

### Optie A: Nieuwe Repository

1. Ga naar [github.com/new](https://github.com/new)
2. Repository naam: `bhv-plotkaart-recreation`
3. Beschrijving: `BHV Plotkaart Recreation - Emergency Response Floor Plan System`
4. Kies Public of Private
5. **GEEN** README, .gitignore of license toevoegen (we hebben deze al)

### Optie B: Bestaande Repository Overschrijven

Als je al een repository hebt, kun je deze overschrijven met de force deploy optie.

## 🚀 Stap 3: Deployment Script Uitvoeren

### Veilige Deployment (Aanbevolen)

\`\`\`bash
# Maak script executable
chmod +x scripts/github-deploy.sh

# Voer deployment uit
bash scripts/github-deploy.sh
\`\`\`

### Force Deployment (Overschrijft alles)

\`\`\`bash
# Maak script executable
chmod +x scripts/force-github-deploy.sh

# Voer force deployment uit (WAARSCHUWING: Overschrijft repository!)
bash scripts/force-github-deploy.sh
\`\`\`

## 🌐 Stap 4: Vercel Deployment

### Automatische Deployment

1. Ga naar [vercel.com/new](https://vercel.com/new)
2. Klik "Import Git Repository"
3. Selecteer je GitHub repository
4. Framework: **Next.js** (automatisch gedetecteerd)
5. Voeg environment variables toe (zie hieronder)
6. Klik "Deploy"

### Environment Variables

Voeg deze environment variables toe in Vercel:

\`\`\`env
# Database
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters
NEXTAUTH_URL=https://your-app.vercel.app

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# Supabase (optioneel)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### NEXTAUTH_SECRET Genereren

\`\`\`bash
# Genereer een veilige secret
openssl rand -base64 32
\`\`\`

Of gebruik een online generator: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

## 🔍 Stap 5: Post-Deployment Verificatie

### Checklist

- [ ] Homepage laadt correct
- [ ] Login functionaliteit werkt
- [ ] Demo accounts werken
- [ ] Database connectie werkt
- [ ] Alle API endpoints reageren
- [ ] Responsive design werkt op mobile
- [ ] Alle links werken
- [ ] Contact formulier werkt
- [ ] Email links werken

### Test URLs

Na deployment, test deze URLs:

\`\`\`
https://your-app.vercel.app/                    # Homepage
https://your-app.vercel.app/login               # Login pagina
https://your-app.vercel.app/demo/overview       # Demo overzicht
https://your-app.vercel.app/plotkaart           # Plotkaart
https://your-app.vercel.app/api/test-db         # Database test
\`\`\`

## 🛠️ Troubleshooting

### Build Errors

\`\`\`bash
# Lokaal testen
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
\`\`\`

### Database Connection Issues

1. Controleer DATABASE_URL format
2. Controleer database toegang
3. Test met `/api/test-db` endpoint

### Environment Variables

1. Controleer alle required variables zijn ingesteld
2. Geen spaties rond = teken
3. Gebruik quotes voor speciale karakters

### Deployment Fails

1. Controleer GitHub repository bestaat
2. Controleer push permissions
3. Controleer branch naam (main vs master)

## 📊 Monitoring

### Vercel Dashboard

- Deployment logs: `vercel.com/dashboard`
- Function logs: Real-time monitoring
- Analytics: Traffic en performance

### GitHub Actions (Optioneel)

Voor automatische testing kun je GitHub Actions toevoegen:

\`\`\`yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run type-check
\`\`\`

## 🔄 Updates Deployen

Na wijzigingen:

\`\`\`bash
# Commit wijzigingen
git add .
git commit -m "Update: beschrijving van wijzigingen"

# Push naar GitHub (automatische Vercel deployment)
git push origin main
\`\`\`

## 🆘 Support

Bij problemen:

1. Controleer deployment logs in Vercel
2. Controleer GitHub repository settings
3. Test lokaal met `npm run dev`
4. Controleer environment variables

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] Alle code gecommit
- [ ] Build test succesvol
- [ ] Environment variables klaar
- [ ] Database toegankelijk
- [ ] GitHub repository klaar

### Deployment

- [ ] Script uitgevoerd
- [ ] Code gepusht naar GitHub
- [ ] Vercel project aangemaakt
- [ ] Environment variables ingesteld
- [ ] Eerste deployment succesvol

### Post-Deployment

- [ ] Homepage test
- [ ] Login test
- [ ] Database test
- [ ] API endpoints test
- [ ] Mobile responsive test
- [ ] Performance test

## 🎉 Succes!

Je BHV360 applicatie is nu live! 

**Live URL:** `https://your-app.vercel.app`

**GitHub:** `https://github.com/your-username/bhv-plotkaart-recreation`

---

*Voor vragen of ondersteuning, neem contact op via de GitHub Issues.*
