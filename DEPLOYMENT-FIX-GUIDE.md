# Deployment Fix Guide

## Issues Fixed

### 1. ✅ Missing Named Exports
- **Problem**: `lib/modules/module-definitions.ts` was missing required exports
- **Solution**: Added all required exports:
  - `calculateModulePrice`
  - `getVisibleModules` 
  - `moduleDefinitions`
  - `moduleCategories`
  - `tierDefinitions`
  - `validateDependencies`

### 2. ✅ Sensitive Environment Variables
- **Problem**: Sensitive keys exposed to client with `NEXT_PUBLIC_` prefix
- **Solution**: Removed sensitive `NEXT_PUBLIC_` variables:
  - `NEXT_PUBLIC_STACK_PROJECT_ID` → server-only `STACK_SECRET_SERVER_KEY`
  - `NEXT_PUBLIC_MAPBOX_TOKEN` → server-only `MAPBOX_TOKEN`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` → server-only `GOOGLE_MAPS_API_KEY`
  - All analytics IDs moved to server-only

### 3. ✅ PNPM Lockfile Issues
- **Problem**: `ERR_PNPM_OUTDATED_LOCKFILE` on Vercel
- **Solution**: 
  - Fixed `package.json` with `"packageManager": "pnpm@10.2.0"`
  - Added lockfile sync script
  - Added prebuild validation

## Client-Safe vs Server-Only Variables

### ✅ Client-Safe (NEXT_PUBLIC_)
\`\`\`bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_NAME=BHV360
NEXT_PUBLIC_APP_DESCRIPTION=Professional BHV Management Platform
\`\`\`

### 🔒 Server-Only (NO NEXT_PUBLIC_)
\`\`\`bash
# Authentication & Secrets
STACK_SECRET_SERVER_KEY=your_stack_server_key
AUTH_SECRET=your_auth_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External APIs
MAPBOX_TOKEN=pk.your_mapbox_token
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_ANALYTICS_ID=G-YOUR123

# Database
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...
\`\`\`

## Deployment Steps

### 1. Local Testing
\`\`\`bash
# Install dependencies
pnpm install

# Run prebuild validation
pnpm run prebuild

# Test build
pnpm run test-build
\`\`\`

### 2. Fix Lockfile (if needed)
\`\`\`bash
# Run the fix script
bash scripts/fix-lockfile.sh

# Commit changes
git add pnpm-lock.yaml package.json
git commit -m "chore: sync pnpm-lock.yaml and add prebuild guard"
git push origin main
\`\`\`

### 3. Vercel Configuration
- **Install Command**: `pnpm install` (default after lockfile fix)
- **Build Command**: `pnpm run build` (includes prebuild validation)
- **Environment Variables**: Only add server-only vars to Vercel dashboard

### 4. Verification
- ✅ Build logs show no "missing export" errors
- ✅ Build logs show no "frozen-lockfile" errors  
- ✅ No sensitive variables in client bundle
- ✅ App starts successfully

## Files Modified

1. `lib/modules/module-definitions.ts` - Complete rewrite with all exports
2. `lib/modules/index.ts` - New barrel file for clean imports
3. `.env.local` - Removed sensitive NEXT_PUBLIC_ variables
4. `.env.example` - Safe template with clear comments
5. `package.json` - Added PNPM version and prebuild script
6. `scripts/validate-modules.mjs` - New validation script
7. `scripts/fix-lockfile.sh` - Lockfile repair script
8. `tsconfig.json` - Updated for proper module resolution

## Emergency Hotfix (if still failing)

If Vercel still fails, temporarily set Install Command to:
\`\`\`bash
pnpm install --no-frozen-lockfile
\`\`\`

Then immediately run the lockfile fix and revert to default.
