# BHV360 Deployment Testing Checklist

## 🚀 Deployment Verification

### Automated Tests
- [ ] Run `npm run deploy` successfully
- [ ] Run `npx tsx scripts/verify-deployment.ts` 
- [ ] All automated tests pass

### Manual Testing Checklist

#### 🏠 Homepage Testing
- [ ] Homepage loads at https://bhv360.vercel.app
- [ ] BHV360 logo displays correctly
- [ ] Hero section shows proper content
- [ ] All navigation links work
- [ ] Mobile responsive design works
- [ ] Contact information is correct

#### 🔐 Authentication Testing
- [ ] Login page loads at `/login`
- [ ] BHV360 logo displays on login page
- [ ] Login form is functional
- [ ] Error messages display correctly
- [ ] "Wachtwoord vergeten" link works
- [ ] Registration link works
- [ ] Demo login credentials work

#### 📱 Mobile App Page Testing
- [ ] Mobile app page loads at `/mobile-app`
- [ ] All tabs (Overview, Features, Permissions, Screenshots) work
- [ ] Download buttons are present
- [ ] QR codes display
- [ ] App statistics show correctly
- [ ] Screenshots gallery works
- [ ] Permissions explanations are clear

#### 🛠️ Super Admin Testing
- [ ] Website builder loads at `/super-admin/website-builder`
- [ ] All tabs (Homepage, Pages, Design, Settings) work
- [ ] Content editor functions properly
- [ ] Live preview updates in real-time
- [ ] Save functionality works
- [ ] Color picker works
- [ ] Image upload interface present
- [ ] Page management works

#### 🔧 Technical Testing
- [ ] All API endpoints respond
- [ ] Database connection works
- [ ] Static assets load (images, fonts, etc.)
- [ ] Service worker loads
- [ ] Manifest.json is accessible
- [ ] Favicon displays correctly

#### 📊 Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Images load quickly
- [ ] No console errors
- [ ] Mobile performance is good
- [ ] Lighthouse score > 90

#### 🔒 Security Testing
- [ ] HTTPS is enforced
- [ ] No sensitive data in client-side code
- [ ] Service role keys not exposed
- [ ] Proper CORS headers
- [ ] XSS protection headers present

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large mobile (414x896)

## 🐛 Common Issues & Solutions

### Logo Not Displaying
- Check if `/images/bhv360-logo-full.png` exists
- Verify Image component import
- Check Next.js image optimization settings

### Build Failures
- Run `npm run type-check` locally
- Check for TypeScript errors
- Verify all imports are correct

### Environment Variables
- Ensure all required env vars are set in Vercel
- Check NEXT_PUBLIC_ prefix for client-side vars
- Verify Supabase keys are correct

### Performance Issues
- Check image optimization
- Verify bundle size
- Check for memory leaks
- Monitor API response times

## 📞 Support Contacts

- **Technical Issues**: tech@bhv360.nl
- **Deployment Issues**: deploy@bhv360.nl
- **Emergency**: +31 20 123 4567

## 📝 Deployment Log Template

\`\`\`
Deployment Date: ___________
Deployed By: ___________
Version: 2.1.0
Commit Hash: ___________

Pre-deployment Checklist:
□ Code reviewed
□ Tests passing
□ Environment variables updated
□ Database migrations run

Post-deployment Verification:
□ Homepage working
□ Login working
□ Mobile app page working
□ Super admin working
□ All tests passing

Issues Found:
- ___________
- ___________

Resolution:
- ___________
- ___________

Sign-off: ___________
