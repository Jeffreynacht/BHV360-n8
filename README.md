# BHV360 Plotkaart Recreation

Professional BHV Management Platform with interactive floor plans and emergency response tools.

## Quick Start

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
\`\`\`

## Deploy to Vercel

### Prerequisites Checklist

- [ ] All required environment variables set in Vercel dashboard
- [ ] PNPM lockfile synchronized (`pnpm-lock.yaml` committed)
- [ ] Module exports validated (`pnpm run prebuild` passes)
- [ ] No sensitive `NEXT_PUBLIC_` variables in code

### Environment Variables

#### Client-Safe (NEXT_PUBLIC_)
\`\`\`bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=BHV360
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

#### Server-Only (NO NEXT_PUBLIC_)
\`\`\`bash
AUTH_SECRET=your_long_random_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STACK_SECRET_SERVER_KEY=your_stack_server_key
DATABASE_URL=postgresql://...
\`\`\`

### Deployment Steps

1. **Validate locally:**
   \`\`\`bash
   pnpm run prebuild  # Validates modules & TypeScript
   pnpm run build     # Tests production build
   \`\`\`

2. **Set environment variables in Vercel dashboard**
   - Add only server-only variables to Vercel
   - Client variables are in the code (NEXT_PUBLIC_)

3. **Deploy:**
   \`\`\`bash
   git push origin main
   \`\`\`

4. **Monitor build logs for:**
   - ✅ No "missing export" errors
   - ✅ No "ERR_PNPM_OUTDATED_LOCKFILE" errors
   - ✅ No sensitive variable warnings
   - ✅ Build completes successfully

### Troubleshooting

**Build fails with missing exports:**
- Run `node scripts/validate-modules.mjs` locally
- Check `lib/modules/module-definitions.ts` has all required exports

**PNPM lockfile errors:**
- Run `bash scripts/fix-lockfile.sh`
- Commit updated `pnpm-lock.yaml`

**Sensitive environment variable warnings:**
- Remove `NEXT_PUBLIC_` prefix from sensitive variables
- Move to server-only environment variables

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
├── components/            # React components
├── lib/
│   ├── modules/          # Module system
│   │   ├── module-definitions.ts  # Core module definitions
│   │   └── index.ts      # Barrel exports
│   └── ...
├── scripts/
│   ├── validate-modules.mjs      # Module validation
│   └── fix-lockfile.sh          # Lockfile repair
├── .env.example          # Environment template
└── vercel.json          # Vercel configuration
\`\`\`

## Module System

The application uses a modular architecture defined in `lib/modules/module-definitions.ts`:

- **moduleDefinitions**: Array of all available modules
- **AVAILABLE_MODULES**: Alias for compatibility
- **calculateModulePrice**: Pricing calculation logic
- **getVisibleModules**: Filter visible modules
- **getModuleById**: Find module by ID
- **getCoreModules**: Get essential modules

## Development

\`\`\`bash
# Type checking
pnpm run type-check

# Validate modules
node scripts/validate-modules.mjs

# Test build
pnpm run test-build

# Fix lockfile issues
bash scripts/fix-lockfile.sh
\`\`\`

## License

MIT License - see LICENSE file for details.
\`\`\`

```shellscript file="scripts/deploy-checklist.sh"
#!/bin/bash

echo "🚀 Pre-deployment checklist for Vercel..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this from the project root."
    exit 1
fi

echo "1. 🔍 Checking TypeScript compilation..."
if ! pnpm run type-check; then
    echo "❌ TypeScript errors found. Fix before deploying."
    exit 1
fi
echo "✅ TypeScript compilation passed"

echo "2. 🧩 Validating module exports..."
if ! node scripts/validate-modules.mjs; then
    echo "❌ Module validation failed. Check exports in lib/modules/module-definitions.ts"
    exit 1
fi
echo "✅ Module exports validated"

echo "3. 🏗️ Testing production build..."
if ! pnpm run build; then
    echo "❌ Build failed. Fix errors before deploying."
    exit 1
fi
echo "✅ Production build successful"

echo "4. 🔒 Checking environment variable security..."
if grep -r "NEXT_PUBLIC_.*SECRET\|NEXT_PUBLIC_.*KEY\|NEXT_PUBLIC_.*TOKEN" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules .; then
    echo "❌ Found potentially sensitive NEXT_PUBLIC_ variables. Review and move to server-only."
    exit 1
fi
echo "✅ No sensitive NEXT_PUBLIC_ variables found"

echo "5. 📦 Checking PNPM lockfile..."
if [ ! -f "pnpm-lock.yaml" ]; then
    echo "❌ pnpm-lock.yaml not found. Run 'pnpm install' first."
    exit 1
fi
echo "✅ PNPM lockfile present"

echo ""
echo "🎉 All checks passed! Ready for deployment."
echo ""
echo "Next steps:"
echo "1. Commit any remaining changes"
echo "2. Push to main branch: git push origin main"
echo "3. Monitor Vercel deployment dashboard"
echo "4. Verify deployment at your domain"
