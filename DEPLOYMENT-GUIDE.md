# 🚀 BHV360 Deployment Guide

Deze guide helpt je BHV360 veilig en foutloos live te zetten.

## SNELLE START (30 MINUTEN)

### 1️⃣ SUPABASE PROJECT AANMAKEN (5 min)

1. Ga naar: https://supabase.com
2. Klik: "New Project"
3. Vul in:
   - **Name:** BHV360
   - **Password:** [Sterk wachtwoord - bewaar dit!]
   - **Region:** West Europe (eu-west-1)
4. Wacht tot project klaar is (2-3 min)
5. Ga naar: Settings → API
6. Kopieer:
   - **URL:** `https://xxx.supabase.co`
   - **anon public:** `eyJhbGciOiJIUzI1NiIs...`
   - **service_role:** `eyJhbGciOiJIUzI1NiIs...`

### 2️⃣ DATABASE SCHEMA INSTALLEREN (3 min)

1. In Supabase dashboard → **SQL Editor**
2. Klik: **New Query**
3. Kopieer inhoud van: `scripts/supabase-bhv360-schema.sql`
4. Plak in editor en klik: **Run**
5. ✅ Schema geïnstalleerd!

### 3️⃣ GITHUB REPOSITORY MAKEN (5 min)

\`\`\`bash
# In je project folder:
git init
git add .
git commit -m "🚀 BHV360 platform ready for deployment"

# Ga naar GitHub.com → New Repository
# Name: bhv360
# Public/Private naar keuze
# Create repository

# Terug in terminal:
git remote add origin https://github.com/JOUWUSERNAME/bhv360.git
git branch -M main
git push -u origin main
\`\`\`

### 4️⃣ VERCEL DEPLOYMENT (10 min)

1. Ga naar: https://vercel.com
2. Klik: **Import Project**
3. Selecteer je GitHub repository
4. **Environment Variables** toevoegen:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
AUTH_PASSWORD=demo123
JWT_SECRET=jouw-random-string-hier
NEXT_PUBLIC_APP_URL=https://jouwapp.vercel.app
\`\`\`

5. Klik: **Deploy**
6. Wacht 2-3 minuten
7. ✅ App is live!

### 5️⃣ TESTEN (5 min)

1. Open je live app URL
2. Login: `jan@demobedrijf.nl` / `demo123`
3. Test:
   - ✅ Dashboard laadt
   - ✅ Plotkaart editor werkt
   - ✅ Gebruikers pagina
   - ✅ Mobile responsive

## 🎉 KLAAR!

Je BHV360 platform is nu live op:
`https://jouwapp.vercel.app`

## VOLGENDE STAPPEN

### 🎨 AANPASSEN
- Logo vervangen in `/public/images/`
- Kleuren aanpassen in `tailwind.config.ts`
- Bedrijfsnaam wijzigen in componenten

### 🔧 UITBREIDEN
- SMTP configureren voor echte emails
- SMS provider toevoegen (Twilio)
- Custom domain koppelen
- SSL certificaat instellen

### 📊 MONITORING
- Google Analytics toevoegen
- Error tracking (Sentry)
- Performance monitoring
- Backup strategie

## HULP NODIG?

- 📧 Check Vercel deployment logs
- 🐛 Browser console voor frontend errors
- 🗄️ Supabase logs voor database issues
- 💬 Vraag hulp in de chat!

Nu maak ik een automatische setup script:

## Stap-voor-stap Instructies

### 1. Supabase Project Aanmaken

1. Ga naar [supabase.com](https://supabase.com)
2. Klik "New Project"
3. Vul in:
   - Name: `BHV360`
   - Database Password: Genereer een sterk wachtwoord
   - Region: `West Europe`
4. Wacht tot het project is aangemaakt
5. Ga naar Settings > API en kopieer:
   - URL
   - anon public key
   - service_role key

### 2. Setup Wizard Uitvoeren

\`\`\`bash
npm run setup
\`\`\`

De wizard vraagt om:
- Supabase URL
- Supabase keys
- App URL (bijv. https://bhv360.vercel.app)
- Domain (optioneel)
- Slack webhook (optioneel)

### 3. Database Schema Uitvoeren

1. Ga naar je Supabase dashboard
2. Klik op "SQL Editor"
3. Kopieer de inhoud van `scripts/database-schema.sql`
4. Plak en voer uit

### 4. Validatie

\`\`\`bash
npm run validate
\`\`\`

Dit controleert:
- ✅ Alle bestanden aanwezig
- ✅ Environment variabelen correct
- ✅ Database connectie werkt
- ✅ Dependencies geïnstalleerd
- ✅ Build succesvol

### 5. Deployment

\`\`\`bash
npm run deploy
\`\`\`

Dit doet:
- Final build test
- Deploy naar Vercel
- Toont live URL

## Troubleshooting

### "Supabase connection failed"
- Controleer je URL en keys
- Controleer of je database schema is uitgevoerd

### "Build failed"
- Voer `npm install` uit
- Controleer je environment variabelen

### "Deploy failed"
- Installeer Vercel CLI: `npm i -g vercel`
- Login: `vercel login`
- Probeer opnieuw: `npm run deploy`

## Post-Deployment

### Domain Configureren
1. Ga naar Vercel dashboard
2. Settings > Domains
3. Voeg je domain toe
4. Configureer DNS records

### Monitoring
- Ga naar `/beheer/performance` voor monitoring
- Configureer alerts in `/beheer/performance` > Notifications

### Backup
- Supabase maakt automatisch backups
- Controleer backup instellingen in Supabase dashboard

## Support

Bij problemen:
1. Controleer de console voor error messages
2. Voer `npm run validate` uit
3. Check de Vercel deployment logs
4. Check de Supabase logs

## Checklist voor Go-Live

- [ ] Supabase project aangemaakt
- [ ] Database schema uitgevoerd
- [ ] Environment variabelen ingesteld
- [ ] Setup wizard uitgevoerd
- [ ] Validatie geslaagd
- [ ] Lokale test succesvol (`npm run dev`)
- [ ] Build test succesvol (`npm run build`)
- [ ] Deployment succesvol
- [ ] Live site getest
- [ ] Domain geconfigureerd (optioneel)
- [ ] Monitoring ingesteld
- [ ] Backup gecontroleerd
- [ ] Gebruikers geïnformeerd

🎉 **Gefeliciteerd! BHV360 is live!**
