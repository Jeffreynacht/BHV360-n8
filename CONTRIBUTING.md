# 🤝 Contributing to BHV360

We love your input! We want to make contributing to BHV360 as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

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

## We Develop with Github
We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests
Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

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

## Any contributions you make will be under the MIT Software License
In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## License
By contributing, you agree that your contributions will be licensed under its MIT License.

## References
This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md)

Bedankt voor je bijdrage! 🙏
