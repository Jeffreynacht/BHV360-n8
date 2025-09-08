# BHV360 NextAuth Deployment Fix

## Environment Variables Required

Set these in Vercel Dashboard → Settings → Environment Variables (All Environments):

### NextAuth Configuration
\`\`\`bash
NEXTAUTH_URL=https://www.bhv360.nl
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
AUTH_URL=https://www.bhv360.nl
AUTH_SECRET=[same as NEXTAUTH_SECRET]
AUTH_TRUST_HOST=true
\`\`\`

### Google OAuth
\`\`\`bash
AUTH_GOOGLE_ID=818790810668-cp4vih37i4o8gmvs7r395ggslc3lrv82.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=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
\`\`\`

### Supabase & Database
\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=https://ybxmvuzgqevqpusimgmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-supabase-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-supabase-service-role-key]
DATABASE_URL=postgres://neondb_owner:npg_UviSJHz5m6Dq@ep-bitter-morning-a2mvh0vx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_SITE_URL=https://www.bhv360.nl
\`\`\`

### Optional (Push Notifications & AI)
\`\`\`bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BOFQS6vW47NWPnACsrORqSdn361gTHEWovS0jSyjhE4pIjU73dWzgm-gLRcq6Tc14D-nKLq8h6DK8cf0O7Ly16k
VAPID_PRIVATE_KEY=4uGILTHML-E0cAMyPGjSYJR1EC1Vu8L_JiuDWeJy5Rw
GROQ_API_KEY=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
\`\`\`

## Deployment Steps

1. **Generate NEXTAUTH_SECRET**:
   \`\`\`bash
   openssl rand -base64 32
   \`\`\`

2. **Set all environment variables** in Vercel Dashboard

3. **Configure Google OAuth**:
   - Redirect URI: `https://www.bhv360.nl/api/auth/callback/google`
   - Authorized origin: `https://www.bhv360.nl`

4. **Deploy with clean cache**:
   \`\`\`bash
   vercel --prod --force
   \`\`\`
   
   Or in Vercel Dashboard: **Skip build cache = ON**

## Verification

After deployment, test these endpoints:

1. **Auth Session**: `https://www.bhv360.nl/api/auth/session`
   - Should return JSON (200), not "Internal Server Error"

2. **CSRF Token**: `https://www.bhv360.nl/api/auth/csrf`
   - Should return JSON with csrfToken

3. **Health Check**: `https://www.bhv360.nl/api/health`
   - Should return application status

4. **No Console Errors**: 
   - No `[next-auth][error][CLIENT_FETCH_ERROR]` in browser console

## Troubleshooting

### If still getting CLIENT_FETCH_ERROR:
1. Check Vercel Function logs for the auth route
2. Verify all environment variables are set for Production
3. Ensure Google OAuth redirect URI matches exactly
4. Try using Vercel preview URL temporarily if domain issues

### Common Issues:
- **Missing AUTH_TRUST_HOST=true**: Required for Vercel deployment
- **Mismatched URLs**: NEXTAUTH_URL must match actual domain
- **Missing runtime exports**: Auth route needs proper runtime configuration
- **Build cache**: Always use "Skip build cache" for auth changes

## Support

If issues persist:
1. Check Vercel deployment logs
2. Verify environment variables in Vercel Dashboard
3. Test with Vercel preview URL first
4. Check Google OAuth configuration
