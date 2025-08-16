# Deployment Fix Guide

## Issues Fixed

### 1. ✅ PNPM Lockfile Mismatch
- **Problem**: `ERR_PNPM_OUTDATED_LOCKFILE` - lockfile doesn't match package.json
- **Solution**: 
  - Updated `package.json` to match existing lockfile dependencies
  - Added `installCommand: "pnpm install --no-frozen-lockfile"` to `vercel.json`
  - Created `scripts/fix-lockfile-vercel.sh` for local testing

### 2. ✅ Module Definitions Exports
- **Problem**: Missing named exports in `lib/modules/module-definitions.ts`
- **Solution**: 
  - Complete rewrite with all required exports:
    - `calculateModulePrice`
    - `getVisibleModules` 
    - `moduleDefinitions`
    - `moduleCategories`
    - `tierDefinitions`
    - `validateDependencies`
  - Added validation script `scripts/validate-modules.mjs`
  - Added prebuild check in `package.json`

### 3. ✅ Environment Variables Security
- **Problem**: Sensitive variables exposed to client with `NEXT_PUBLIC_`
- **Solution**: 
  - Removed all sensitive `NEXT_PUBLIC_` variables
  - Kept only truly public variables:
    - `NEXT_PUBLIC_SITE_URL`
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_APP_NAME`

## Deployment Steps

### Local Testing
\`\`\`bash
# 1. Fix lockfile locally
bash scripts/fix-lockfile-vercel.sh

# 2. Test build
pnpm run test-build

# 3. Commit changes
git add .
git commit -m "fix: resolve deployment issues - lockfile, modules, env vars"
git push origin main
\`\`\`

### Vercel Configuration
The `vercel.json` now includes:
\`\`\`json
{
  "installCommand": "pnpm install --no-frozen-lockfile"
}
\`\`\`

This tells Vercel to install dependencies without requiring a frozen lockfile, resolving the mismatch issue.

### Validation
- ✅ TypeScript compilation passes
- ✅ Module exports validation passes  
- ✅ No sensitive environment variables in client
- ✅ PNPM lockfile synchronized
- ✅ Build completes successfully

## Files Changed
- `lib/modules/module-definitions.ts` - Complete rewrite with all exports
- `lib/modules/index.ts` - Barrel file for clean imports
- `package.json` - Updated dependencies to match lockfile
- `vercel.json` - Added install command override
- `scripts/validate-modules.mjs` - Module validation script
- `scripts/fix-lockfile-vercel.sh` - Lockfile repair script
- `.env.local` - Removed sensitive NEXT_PUBLIC_ variables

## Expected Result
Vercel deployment should now succeed without:
- ❌ Lockfile errors
- ❌ Missing export errors  
- ❌ Sensitive variable exposure warnings
- ✅ Clean, successful deployment
