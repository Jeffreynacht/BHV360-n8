# BHV360 Deployment Fixes

## Issues Resolved

### 1. Package Manager Configuration
- ✅ Updated `vercel.json` to use pnpm
- ✅ Set `installCommand: "pnpm install"`
- ✅ Set `buildCommand: "pnpm run build"`

### 2. Environment Variables
- ✅ Created environment-based Supabase client
- ✅ Added health check endpoint (`/api/health`)
- ✅ Added environment check endpoint (`/api/env-check`)
- ✅ Updated all environment variable references

### 3. Required Environment Variables
\`\`\`
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXTAUTH_SECRET
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
\`\`\`

### 4. Health Check Endpoints
- `/api/health` - Basic health check
- `/api/env-check` - Environment variables validation

### 5. Deployment Script
- ✅ Created automated deployment script
- ✅ Includes environment verification
- ✅ Handles pnpm/npm detection
- ✅ Verifies deployment success

## Deployment Commands

\`\`\`bash
# Run deployment script
npx tsx scripts/deploy-with-environment-fixes.ts

# Manual deployment
vercel --prod --yes
\`\`\`

## Post-Deployment Verification

1. Check health: https://www.bhv360.nl/api/health
2. Check environment: https://www.bhv360.nl/api/env-check
3. Test homepage: https://www.bhv360.nl

## Environment Variables to Set in Vercel

Based on your provided values:

\`\`\`
DATABASE_URL=postgres://neondb_owner:npg_UviSJHz5m6Dq@ep-bitter-morning-a2mvh0vx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_SUPABASE_URL=https://ybxmvuzgqevqpusimgmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieG12dXpncWV2cXB1c2ltZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDk4NDEsImV4cCI6MjA2NjMyNTg0MX0.MFB7ytqPId2c3HEm5KyK2RFZCO-cBrpmiO-FwHJXSv4
NEXTAUTH_SECRET=your-generated-secret
VAPID_PUBLIC_KEY=BOFQS6vW47NWPnACsrORqSdn361gTHEWovS0jSyjhE4pIjU73dWzgm-gLRcq6Tc14D-nKLq8h6DK8cf0O7Ly16k
VAPID_PRIVATE_KEY=4uGILTHML-E0cAMyPGjSYJR1EC1Vu8L_JiuDWeJy5Rw
\`\`\`

All fixes have been implemented and the application is ready for deployment!
