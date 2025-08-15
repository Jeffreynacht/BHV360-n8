# 🚨 BHV Plotkaart Recreation

Een moderne, gebruiksvriendelijke applicatie voor het beheren van BHV (Bedrijfshulpverlening) plotkaarten en noodprocedures.

## 🌟 Features

### 🏢 **Multi-tenant Platform**
- **White-label oplossing** voor partners
- **Klantspecifieke branding** en configuratie
- **Modulaire architectuur** met pay-per-module pricing

### 🗺️ **Interactieve Plotkaarten**
- **Drag & drop editor** voor eenvoudig bewerken
- **Real-time updates** voor alle gebruikers
- **Responsive design** voor alle apparaten
- **Print-optimized** PDF export

### 👥 **Gebruikersbeheer**
- **Role-based access control** (RBAC)
- **Multi-level autorisaties** (Super Admin, Partner Admin, Customer Admin, etc.)
- **Biometrische authenticatie** ondersteuning
- **Single Sign-On** integratie

### 📱 **Mobile-First Design**
- **Progressive Web App** (PWA)
- **Offline functionaliteit**
- **Push notificaties**
- **NFC tag scanning**

### 🚨 **Emergency Features**
- **Real-time incident management**
- **Automated alerting** via SMS, email, en push
- **QR code emergency activation**
- **Hands-free communication**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- PostgreSQL database (Neon/Supabase)

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/bhv-plotkaart-recreation.git
cd bhv-plotkaart-recreation

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations
npm run setup-demo

# Start development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in je browser.

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL (Neon/Supabase)
- **Authentication:** NextAuth.js
- **Deployment:** Vercel
- **State Management:** React Context + Hooks

## 📁 Project Structure

\`\`\`
bhv-plotkaart-recreation/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── beheer/            # Admin pages
│   ├── bhv/               # BHV specific pages
│   └── dashboards/        # Role-based dashboards
├── components/            # Reusable components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Custom components
├── lib/                   # Utility functions
├── scripts/               # Database & deployment scripts
├── public/                # Static assets
└── docs/                  # Documentation
\`\`\`

## 🔧 Configuration

### Environment Variables

\`\`\`env
# Database
DATABASE_URL=your_database_url
POSTGRES_URL=your_postgres_url

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

\`\`\`bash
# Deploy to GitHub first
npm run deploy

# Then deploy to Vercel
# 1. Go to vercel.com/new
# 2. Import your GitHub repository
# 3. Configure environment variables
# 4. Deploy!
\`\`\`

### Manual Deployment

\`\`\`bash
# Build for production
npm run build

# Start production server
npm run start
\`\`\`

## 📊 Demo Accounts

Voor testing zijn er demo accounts beschikbaar:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@bhv360.nl | demo123 |
| Partner Admin | partner@bhv360.nl | demo123 |
| Customer Admin | klant@bhv360.nl | demo123 |
| BHV Coordinator | bhv@bhv360.nl | demo123 |
| Employee | medewerker@bhv360.nl | demo123 |

## 🧪 Testing

\`\`\`bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Test build
npm run test-build
\`\`\`

## 📚 Documentation

- [Setup Guide](./SETUP-CHECKLIST.md)
- [Deployment Guide](./GITHUB-DEPLOYMENT.md)
- [API Documentation](./docs/README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contributing

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je changes (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 License

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 📞 Support

- **Email:** support@bhv360.nl
- **Website:** [bhv360.nl](https://bhv360.nl)
- **Documentation:** [docs.bhv360.nl](https://docs.bhv360.nl)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) voor het geweldige framework
- [Vercel](https://vercel.com/) voor hosting en deployment
- [shadcn/ui](https://ui.shadcn.com/) voor de UI components
- [Tailwind CSS](https://tailwindcss.com/) voor styling

---

**Gemaakt met ❤️ door het BHV360 team**
\`\`\`

```shellscript file="scripts/quick-github-setup.sh"
#!/bin/bash

# 🚀 Quick GitHub Setup Script
# Dit script helpt je snel een GitHub repository op te zetten

echo "🚀 BHV Plotkaart Recreation - Quick GitHub Setup"
echo "================================================"

# Get GitHub username
echo "Voer je GitHub username in:"
read -r github_username

if [ -z "$github_username" ]; then
    echo "❌ GitHub username is verplicht!"
    exit 1
fi

# Repository name
repo_name="bhv-plotkaart-recreation"
repo_url="https://github.com/$github_username/$repo_name.git"

echo ""
echo "📋 Setup Summary:"
echo "GitHub Username: $github_username"
echo "Repository Name: $repo_name"
echo "Repository URL: $repo_url"
echo ""

# Confirm setup
echo "Wil je doorgaan met deze instellingen? (y/n)"
read -r confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ Setup geannuleerd"
    exit 1
fi

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
fi

# Add all files
echo "📁 Adding all files..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: BHV Plotkaart Recreation - Complete application with all features"

# Add remote
echo "🔗 Adding GitHub remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "$repo_url"

# Update package.json with correct repository URL
echo "📝 Updating package.json..."
sed -i.bak "s|YOUR_USERNAME|$github_username|g" package.json
rm package.json.bak 2>/dev/null || true

# Commit the package.json update
git add package.json
git commit -m "Update: Set correct GitHub repository URL in package.json"

echo ""
echo "✅ Git setup completed!"
echo ""
echo "🌐 Next steps:"
echo "1. Go to https://github.com/new"
echo "2. Create a repository named: $repo_name"
echo "3. Don't initialize with README, .gitignore, or license"
echo "4. Run: git push -u origin main"
echo ""
echo "🚀 Or run the full deployment script:"
echo "bash scripts/github-deploy.sh"
