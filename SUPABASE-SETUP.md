# BHV360 Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for the BHV360 application.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization or use existing
4. Create a new project:
   - Name: `BHV360 Production`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users

## 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Get your credentials from Supabase Dashboard > Settings > API:
- `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep secret!)

## 3. Run Database Setup

1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste the contents of `scripts/supabase-auth-setup.sql`
3. Click "Run" to execute the script

This will create:
- User profiles table with proper RLS policies
- Customers table for multi-tenancy
- Authentication triggers and functions
- Sample data for testing

## 4. Configure Authentication Settings

In Supabase Dashboard > Authentication > Settings:

### Site URL
- Set to your production domain: `https://yourdomain.com`
- For development: `http://localhost:3000`

### Redirect URLs
Add these URLs to allowed redirects:
- `https://yourdomain.com/auth/callback`
- `https://yourdomain.com/reset-password`
- `http://localhost:3000/auth/callback` (development)
- `http://localhost:3000/reset-password` (development)

### Email Templates
The setup script includes Dutch email templates. You can customize them in:
Authentication > Email Templates

### Auth Providers
Enable/disable providers as needed:
- Email (enabled by default)
- Google, GitHub, etc. (optional)

## 5. Test Authentication

1. Start your development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Navigate to `/register` to create a test account
3. Check your email for confirmation
4. Try logging in at `/login`

## 6. User Roles and Permissions

The system supports these roles:
- `super_admin`: Full system access
- `admin`: Customer-level administration
- `bhv_coordinator`: BHV team management
- `employee`: Basic user access
- `security`: Security-specific features
- `partner_admin`: Partner management

## 7. Multi-Tenant Setup

Each user belongs to a customer organization. The system automatically:
- Creates customers for new users
- Enforces data isolation via RLS policies
- Manages user permissions per customer

## 8. Production Deployment

Before going live:

1. Update environment variables in your hosting platform
2. Set proper CORS origins in Supabase
3. Configure custom SMTP for emails (optional)
4. Set up monitoring and logging
5. Test all authentication flows

## 9. Troubleshooting

### Common Issues:

**"Invalid login credentials"**
- Check if user confirmed their email
- Verify password requirements
- Check Supabase logs

**RLS Policy Errors**
- Ensure user has proper role assigned
- Check customer_id associations
- Verify policy conditions

**Email Not Sending**
- Check SMTP configuration
- Verify email templates
- Check Supabase email settings

### Debug Mode:
Enable debug logging by setting:
\`\`\`bash
NEXT_PUBLIC_DEBUG=true
\`\`\`

## 10. Security Best Practices

- Never expose service role key in client code
- Use environment variables for all secrets
- Enable RLS on all tables
- Regularly rotate API keys
- Monitor authentication logs
- Set up proper CORS policies

## Support

For issues with this setup:
1. Check Supabase documentation
2. Review application logs
3. Test with demo data first
4. Contact support if needed
