# Supabase Setup Guide for BHV360

This guide will help you set up Supabase authentication for the BHV360 application.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - Name: `BHV360`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
6. Click "Create new project"

## 2. Get Project Credentials

Once your project is created:

1. Go to Settings → API
2. Copy the following values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

## 3. Configure Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

## 4. Set up Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Create a new query
4. Copy and paste the contents of `scripts/supabase-auth-setup.sql`
5. Click "Run" to execute the schema

## 5. Configure Authentication

1. Go to Authentication → Settings
2. Configure the following:

### Site URL
- Set to: `http://localhost:3000` (development)
- For production: `https://yourdomain.com`

### Redirect URLs
Add these URLs:
- `http://localhost:3000/auth/callback`
- `https://yourdomain.com/auth/callback` (production)

### Email Templates (Optional)
Customize the email templates for:
- Confirm signup
- Reset password
- Magic link

## 6. Enable Row Level Security

The provided SQL schema automatically enables RLS. Verify:

1. Go to Database → Tables
2. Check that RLS is enabled on all tables
3. Review the policies in Database → Policies

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/register`
3. Create a test account
4. Check your email for verification
5. Try logging in at `/login`

## 8. Production Deployment

For production deployment:

1. Update environment variables with production URLs
2. Configure custom domain in Supabase (if needed)
3. Update redirect URLs in Supabase Auth settings
4. Enable email confirmations in production

## Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Check that environment variables are correctly set
   - Ensure no extra spaces in the keys

2. **"Email not confirmed"**
   - Check spam folder
   - Verify email templates are configured
   - Check Supabase logs

3. **RLS Policy Errors**
   - Verify policies are correctly applied
   - Check user roles and permissions

### Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Review browser console for errors
3. Verify database schema is correctly applied

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for service role keys
- Enable MFA for your Supabase account
- Regularly rotate API keys
- Monitor authentication logs for suspicious activity
