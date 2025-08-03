# 🚀 Getting Started met BHV360

Welkom bij BHV360! Deze gids helpt je om snel aan de slag te gaan met de meest complete BHV software voor Nederlandse bedrijven.

## 📋 Vereisten

Voordat je begint, zorg ervoor dat je het volgende hebt:

- **Node.js 18+** geïnstalleerd
- **Git** voor version control
- **Database account** (Supabase of Neon aanbevolen)
- **Email service** (optioneel, voor notifications)

## ⚡ Quick Start

### 1️⃣ Repository Clonen

\`\`\`bash
git clone https://github.com/jouwusername/bhv360.git
cd bhv360
npm install
\`\`\`

### 2️⃣ Environment Configuratie

Kopieer het voorbeeld environment bestand:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Vul de volgende variabelen in:

\`\`\`env
# Database (verplicht)
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication (verplicht)
AUTH_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key

# Supabase (optioneel)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### 3️⃣ Database Setup

Voor **Supabase**:
\`\`\`bash
npm run setup:supabase
\`\`\`

Voor **Neon**:
\`\`\`bash
npm run setup:neon
\`\`\`

### 4️⃣ Development Server Starten

\`\`\`bash
npm run dev
\`\`\`

Bezoek [http://localhost:3000](http://localhost:3000) om de applicatie te zien.

## 🔐 Eerste Login

Na de setup kun je inloggen met de demo accounts:

**Admin Account:**
- Email: `jan@demobedrijf.nl`
- Password: `demo123`

**BHV Coordinator:**
- Email: `marie@demobedrijf.nl`
- Password: `demo123`

## 🏗️ Project Structuur

\`\`\`
bhv360/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── beheer/            # Admin Dashboard
│   ├── bhv/               # BHV Management
│   └── dashboards/        # Role-based Dashboards
├── components/            # React Components
│   ├── ui/               # shadcn/ui Components
│   ├── admin/            # Admin Components
│   └── notifications/    # Notification Components
├── lib/                  # Utility Libraries
│   ├── auth/            # Authentication
│   ├── database/        # Database Adapters
│   └── notifications/   # Notification Services
├── scripts/             # Database & Setup Scripts
└── docs/               # Documentation
\`\`\`

## 🎯 Volgende Stappen

Nu je BHV360 draait, kun je:

1. **[Gebruikers beheren](/guides/user-management)** - Voeg medewerkers toe
2. **[BHV teams instellen](/guides/bhv-teams)** - Configureer BHV structuur
3. **[Plattegronden uploaden](/guides/floor-plans)** - Voeg gebouw layouts toe
4. **[Notifications configureren](/guides/notifications)** - Setup alerts
5. **[Rapportages bekijken](/guides/reporting)** - Analyseer performance

## 🆘 Hulp Nodig?

- 📖 **[User Guides](/guides)** - Gedetailleerde handleidingen
- 🔧 **[API Reference](/api)** - Developer documentatie
- 💬 **[Discord Community](https://discord.gg/bhv360)** - Chat met andere gebruikers
- 📧 **[Email Support](mailto:support@bhv360.nl)** - Direct contact

## 🐛 Problemen?

Bekijk onze **[Troubleshooting Guide](/troubleshooting)** of open een **[GitHub Issue](https://github.com/jouwusername/bhv360/issues)**.
\`\`\`

Nu maken we een API documentatie pagina:
