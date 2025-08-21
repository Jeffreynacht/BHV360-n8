# BHV360 Deployment Guide

This guide covers the deployment process for the BHV360 platform.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel CLI (for Vercel deployments)
- Git repository access

## Environment Setup

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-org/bhv360-plotkaart.git
cd bhv360-plotkaart
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your configuration
\`\`\`

## Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`.

## Testing

Run the comprehensive test suite:
\`\`\`bash
npm run test-modules
\`\`\`

This will execute all 43 module tests and provide detailed results.

## Building for Production

1. Run pre-deployment checks:
\`\`\`bash
npm run pre-deploy
\`\`\`

2. Build the application:
\`\`\`bash
npm run build
\`\`\`

## Deployment Options

### Option 1: Automated Deployment Script
\`\`\`bash
chmod +x scripts/deploy-v665.sh
./scripts/deploy-v665.sh
\`\`\`

### Option 2: Manual Vercel Deployment
\`\`\`bash
npm run deploy-vercel
\`\`\`

### Option 3: TypeScript Deployment Orchestrator
\`\`\`bash
npm run deploy-production
\`\`\`

## Post-Deployment Verification

After deployment, verify the system:

1. Check the homepage loads correctly
2. Run the test suite at `/test-modules`
3. Verify all modules are functioning
4. Test the plotkaart editor at `/plotkaart`

## Monitoring

- System health: `/system-health`
- Test results: `/test-modules`
- Module status: `/beheer/module-marketplace`

## Troubleshooting

### Common Issues

1. **Build failures**: Check TypeScript compilation with `npm run type-check`
2. **Test failures**: Run `npm run test-modules` to identify failing tests
3. **Module issues**: Validate modules with `npm run validate-modules`

### Support

For deployment issues, check:
- Vercel deployment logs
- Browser console for client-side errors
- Network tab for API issues

## Security

The deployment includes:
- Security headers configuration
- HTTPS enforcement
- XSS protection
- Content type validation

## Performance

Optimizations included:
- Static export for CDN distribution
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
