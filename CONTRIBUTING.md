# 🤝 Contributing to BHV360

Bedankt voor je interesse in het bijdragen aan BHV360! Dit document bevat richtlijnen voor het bijdragen aan het project.

## 📋 Code of Conduct

Door deel te nemen aan dit project ga je akkoord met onze [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm of yarn
- Git
- Supabase of Neon database account

### Development Setup
1. Fork de repository
2. Clone je fork: `git clone https://github.com/jouwusername/bhv360.git`
3. Install dependencies: `npm install`
4. Setup environment: `cp .env.example .env.local`
5. Start development server: `npm run dev`

## 🔄 Development Workflow

### Branch Naming
- `feature/beschrijving` - Nieuwe features
- `fix/beschrijving` - Bug fixes  
- `docs/beschrijving` - Documentatie updates
- `refactor/beschrijving` - Code refactoring

### Commit Messages
We gebruiken [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
feat: add emergency alert system
fix: resolve notification delivery issue
docs: update API documentation
style: format code with prettier
refactor: simplify database queries
test: add unit tests for auth service
\`\`\`

### Pull Request Process
1. Update documentation indien nodig
2. Voeg tests toe voor nieuwe functionaliteit
3. Zorg dat alle tests slagen
4. Update de CHANGELOG.md
5. Request review van maintainers

## 🧪 Testing

\`\`\`bash
# Run all tests
npm run test

# Run specific test file
npm run test -- auth.test.ts

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
\`\`\`

## 📝 Documentation

- Update README.md voor nieuwe features
- Voeg JSDoc comments toe aan functies
- Update API documentatie in `/docs`
- Voeg voorbeelden toe waar mogelijk

## 🐛 Bug Reports

Gebruik onze [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) en voeg toe:
- Stappen om te reproduceren
- Verwacht vs werkelijk gedrag
- Screenshots indien relevant
- Browser/OS informatie

## 💡 Feature Requests

Gebruik onze [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) en beschrijf:
- Het probleem dat wordt opgelost
- Voorgestelde oplossing
- Alternatieven overwogen
- Extra context

## 🏷️ Labels

- `bug` - Iets werkt niet
- `enhancement` - Nieuwe feature
- `documentation` - Documentatie updates
- `good first issue` - Goed voor beginners
- `help wanted` - Extra aandacht nodig
- `priority: high` - Hoge prioriteit
- `priority: low` - Lage prioriteit

## 📞 Questions?

- Open een [Discussion](https://github.com/jouwusername/bhv360/discussions)
- Join onze [Discord](https://discord.gg/bhv360)
- Email: dev@bhv360.nl

Bedankt voor je bijdrage! 🙏
