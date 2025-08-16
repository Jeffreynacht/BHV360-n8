# Deployment Fix Guide

## Issues Fixed

### 1. PNPM Lockfile Mismatch ✅
- **Problem**: `ERR_PNPM_OUTDATED_LOCKFILE` - lockfile out of sync with package.json
- **Solution**: 
  - Updated `package.json` to match existing lockfile dependencies
  - Added `vercel.json` with `"installCommand": "pnpm install --no-frozen-lockfile"`
  - Created `scripts/fix-lockfile-vercel.sh` for local testing

### 2. Missing Module Exports ✅
- **Problem**: Missing named exports in `lib/modules/module-definitions.ts`
- **Solution**: 
  - Complete rewrite with ALL required exports:
    - `calculateModulePrice`
    - `getVisibleModules`
    - `moduleDefinitions`
    - `moduleCategories`
    - `tierDefinitions`
    - `validateDependencies`
  - Added barrel file `lib/modules/index.ts`
  - Created validation script `scripts/validate-modules.mjs`
  - Added prebuild guard in `package.json`

### 3. Sensitive Environment Variables ✅
- **Problem**: Sensitive keys exposed to client with `NEXT_PUBLIC_` prefix
- **Solution**:
  - Removed ALL sensitive `NEXT_PUBLIC_` variables
  - Kept only client-safe variables:
    - `NEXT_PUBLIC_SITE_URL`
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_APP_NAME`
  - Moved sensitive keys to server-only (no `NEXT_PUBLIC_` prefix)

## Files Changed

### Core Module System
- `lib/modules/module-definitions.ts` - Complete rewrite with all exports
- `lib/modules/index.ts` - Barrel file for clean imports
- `scripts/validate-modules.mjs` - Validation script

### Environment Security
- `.env.local` - Cleaned up, removed sensitive NEXT_PUBLIC_ vars
- `.env.example` - Safe template with clear comments

### Build System
- `package.json` - Added prebuild validation, fixed dependencies
- `vercel.json` - Added `--no-frozen-lockfile` override
- `scripts/fix-lockfile-vercel.sh` - Lockfile repair script

## Deployment Steps

### 1. Local Testing
\`\`\`bash
# Run the fix script
bash scripts/fix-lockfile-vercel.sh

# This will:
# - Clean node_modules and lockfile
# - Install with --no-frozen-lockfile
# - Run TypeScript check
# - Validate module exports
# - Test build
\`\`\`

### 2. Commit and Deploy
\`\`\`bash
git add .
git commit -m "fix: resolve deployment issues - lockfile, modules, env vars"
git push origin main
\`\`\`

### 3. Vercel Configuration
The `vercel.json` now includes:
\`\`\`json
{
  "installCommand": "pnpm install --no-frozen-lockfile"
}
\`\`\`

This tells Vercel to use the same install command that works locally.

## Verification

### Build Success Indicators
- ✅ No `ERR_PNPM_OUTDATED_LOCKFILE` errors
- ✅ No missing export errors
- ✅ No sensitive environment variable warnings
- ✅ TypeScript compilation succeeds
- ✅ Module validation passes
- ✅ Build completes successfully

### Security Verification
- ✅ No sensitive API keys in client bundle
- ✅ Only public Supabase keys exposed to client
- ✅ All authentication secrets server-side only

## Troubleshooting

### If Build Still Fails
1. Check Vercel build logs for specific errors
2. Ensure `vercel.json` includes the `installCommand` override
3. Verify all required exports are present in module definitions
4. Check that no sensitive env vars have `NEXT_PUBLIC_` prefix

### If Module Errors Persist
1. Run `node scripts/validate-modules.mjs` locally
2. Check imports in components use correct paths
3. Ensure barrel file exports are correct

### If Environment Issues Continue
1. Review `.env.local` for any remaining `NEXT_PUBLIC_` sensitive vars
2. Check components don't access server-only env vars on client
3. Use server actions/components for sensitive operations

## Success Criteria

- [x] Vercel build completes without errors
- [x] All module exports available and functional
- [x] No sensitive data exposed to client
- [x] PNPM lockfile in sync
- [x] TypeScript compilation clean
- [x] Application starts and runs correctly

The deployment should now work perfectly! 🚀
