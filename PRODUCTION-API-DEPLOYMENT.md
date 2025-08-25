# BHV360 Production API Deployment Guide

## 🚀 Complete Production Deployment

This document provides a comprehensive guide for deploying all BHV360 APIs to production with full validation and monitoring.

## 📋 Pre-Deployment Checklist

### Environment Requirements
- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Vercel CLI installed (`npm i -g vercel`)
- ✅ All environment variables configured
- ✅ Database connections tested
- ✅ External service API keys validated

### Required Files
- ✅ `package.json` - Project dependencies
- ✅ `next.config.mjs` - Next.js configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `.env.example` - Environment variables template
- ✅ `vercel.json` - Vercel deployment configuration

## 🔧 Environment Variables

### Critical Environment Variables
\`\`\`bash
# Database
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# WebSocket
WEBSOCKET_PORT=3001

# Email/SMS
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"
SMS_API_KEY="your-sms-api-key"

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
\`\`\`

## 🎯 API Endpoints Overview

### Authentication APIs
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/status` - Authentication status
- `GET /api/auth/[...nextauth]` - NextAuth handler

### User Management APIs
- `GET /api/users` - List users
- `POST /api/users/create` - Create new user
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user
- `POST /api/users/[id]/roles` - Assign user roles

### Customer Management APIs
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get customer details
- `PUT /api/customers/[id]` - Update customer
- `POST /api/customers/register` - Customer registration

### Incident Management APIs
- `GET /api/incidents` - List incidents
- `POST /api/incidents/create` - Create incident
- `GET /api/incidents/[id]` - Get incident details
- `PUT /api/incidents/[id]` - Update incident
- `POST /api/incidents/assign` - Assign incident

### Emergency Response APIs
- `POST /api/emergency/alert` - Send emergency alert
- `POST /api/evacuation/start` - Start evacuation
- `GET /api/evacuation/status` - Evacuation status

### WebSocket & Messaging APIs
- `GET/POST /api/websocket/connect` - WebSocket connection management
- `POST /api/messaging/broadcast` - Broadcast messages
- `POST /api/messaging/direct` - Direct messages
- `GET /api/messaging/send` - Send message (legacy)

### Alert System APIs
- `POST /api/alerts/send` - Send alerts
- `GET /api/alerts` - List alerts
- `PATCH /api/alerts` - Update alert status

### Push Notification APIs
- `POST /api/push/register` - Register device for push
- `POST /api/push-notification` - Send push notification
- `GET /api/notifications` - List notifications
- `POST /api/notifications/send` - Send notification
- `POST /api/notifications/subscribe` - Subscribe to notifications
- `POST /api/notifications/bulk` - Bulk notifications

### Communication APIs
- `POST /api/email/send` - Send email
- `POST /api/sms/send` - Send SMS
- `POST /api/contact` - Contact form
- `POST /api/send-email` - Send email (legacy)

### Inspection & Reports APIs
- `GET /api/inspections` - List inspections
- `POST /api/inspections` - Create inspection
- `GET /api/inspections/[id]` - Get inspection details
- `GET /api/reports/inspection-pdf` - Generate inspection PDF

### Admin & Management APIs
- `GET /api/admin/templates` - List templates
- `POST /api/admin/templates` - Create template
- `GET /api/admin/templates/[id]` - Get template
- `PUT /api/admin/templates/[id]` - Update template

### Monitoring & Health APIs
- `GET /api/health` - Health check
- `GET /api/test-database` - Database connection test
- `GET /api/deployment-status` - Deployment status
- `GET /api/monitoring/metrics` - System metrics
- `GET /api/monitoring/errors` - Error monitoring
- `GET /api/monitoring/link-check` - Link monitoring

### Backup & Performance APIs
- `GET /api/backup` - List backups
- `POST /api/backup` - Create backup
- `POST /api/backup/restore` - Restore backup
- `POST /api/performance/load-test` - Load testing
- `GET /api/setup-demo-data` - Setup demo data

## 🔧 Deployment Process

### 1. Automated Deployment Script
\`\`\`bash
# Run the complete deployment script
npm run deploy:production

# Or use the shell script
./scripts/deploy-all-apis.sh
\`\`\`

### 2. Manual Deployment Steps
\`\`\`bash
# 1. Install dependencies
npm ci

# 2. Run tests
npm run test
npm run lint
npm run type-check

# 3. Build application
npm run build

# 4. Deploy to Vercel
vercel --prod --yes

# 5. Verify deployment
curl https://your-domain.com/api/health
\`\`\`

### 3. Post-Deployment Verification

#### Critical Endpoint Tests
\`\`\`bash
# Health check
curl https://your-domain.com/api/health

# Database connection
curl https://your-domain.com/api/test-database

# WebSocket status
curl https://your-domain.com/api/websocket/connect

# Authentication status
curl https://your-domain.com/api/auth/status
\`\`\`

#### Functional Tests
- [ ] User can login/logout
- [ ] WebSocket connections work
- [ ] Push notifications can be sent
- [ ] Email/SMS services operational
- [ ] Emergency alerts function properly
- [ ] Database operations work correctly
- [ ] File upload/download

## 📊 Monitoring & Observability

### Health Monitoring
- **Health Check**: `/api/health` - Overall system status
- **Database**: `/api/test-database` - Database connectivity
- **Deployment**: `/api/deployment-status` - Deployment information

### Performance Monitoring
- **Metrics**: `/api/monitoring/metrics` - Performance data
- **Errors**: `/api/monitoring/errors` - Error tracking
- **Load Testing**: `/api/performance/load-test` - Performance testing

### Real-time Monitoring
- WebSocket connection status
- Push notification delivery rates
- Email/SMS delivery success rates
- Alert response times

## 🚨 Emergency Procedures

### Rollback Process
\`\`\`bash
# Quick rollback to previous version
vercel rollback

# Or deploy specific version
vercel --prod --target=previous-deployment-url
\`\`\`

### Incident Response
1. **Identify Issue** - Check monitoring dashboards
2. **Assess Impact** - Determine affected users/features
3. **Communicate** - Notify stakeholders
4. **Fix or Rollback** - Apply fix or rollback
5. **Verify** - Test all critical functions
6. **Document** - Record incident and resolution

## 🔒 Security Considerations

### API Security
- All endpoints use proper authentication
- Rate limiting implemented
- CORS configured correctly
- Input validation on all endpoints
- SQL injection protection

### Data Protection
- Sensitive data encrypted
- PII handling compliant
- Audit logs maintained
- Backup encryption enabled

## 📈 Performance Optimization

### Caching Strategy
- API responses cached where appropriate
- Static assets optimized
- Database queries optimized
- CDN configured for global delivery

### Scaling Considerations
- Horizontal scaling ready
- Database connection pooling
- WebSocket server clustering
- Load balancer configuration

## 🔄 Maintenance Procedures

### Regular Maintenance
- **Weekly**: Review error logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Performance optimization review
- **Annually**: Security audit and penetration testing

### Backup Strategy
- **Daily**: Automated database backups
- **Weekly**: Full system backups
- **Monthly**: Backup restoration tests
- **Quarterly**: Disaster recovery drills

## 📞 Support & Troubleshooting

### Common Issues

#### WebSocket Connection Issues
\`\`\`bash
# Check WebSocket server status
curl https://your-domain.com/api/websocket/connect

# Verify environment variables
echo $WEBSOCKET_PORT
\`\`\`

#### Database Connection Issues
\`\`\`bash
# Test database connectivity
curl https://your-domain.com/api/test-database

# Check connection string
echo $DATABASE_URL
\`\`\`

#### Push Notification Issues
\`\`\`bash
# Verify VAPID keys
echo $VAPID_PUBLIC_KEY
echo $VAPID_PRIVATE_KEY

# Test push service
curl -X POST https://your-domain.com/api/push-notification \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","title":"Test","body":"Test message"}'
\`\`\`

### Support Contacts
- **Development Team**: dev@bhv360.nl
- **System Admin**: admin@bhv360.nl
- **Emergency Contact**: +31-6-12345678

## 📝 Deployment Log Template

\`\`\`
Deployment ID: deploy_[timestamp]
Date: [YYYY-MM-DD HH:MM:SS]
Environment: Production
Deployed By: [Name]

Pre-deployment Checks:
✅ Environment variables configured
✅ Database connectivity verified
✅ Tests passed
✅ Build successful

Deployment Results:
✅ Vercel deployment successful
✅ Health checks passed
✅ Critical APIs verified
✅ WebSocket server operational

Post-deployment Verification:
✅ Authentication working
✅ Messaging system operational
✅ Emergency alerts functional
✅ Monitoring active

Issues Found: [None/List issues]
Rollback Required: [Yes/No]
Notes: [Additional notes]
\`\`\`

## 🎉 Success Criteria

Deployment is considered successful when:
- [ ] All health checks pass
- [ ] Critical APIs respond correctly
- [ ] WebSocket connections work
- [ ] Push notifications can be sent
- [ ] Email/SMS services operational
- [ ] Emergency alert system functional
- [ ] User authentication working
- [ ] Database operations successful
- [ ] Monitoring systems active
- [ ] No critical errors in logs

---

**🚀 Your BHV360 platform is now fully operational in production!**

For additional support or questions, contact the development team at dev@bhv360.nl
