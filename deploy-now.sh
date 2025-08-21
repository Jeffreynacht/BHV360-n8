#!/bin/bash

echo "🚀 EXECUTING EMERGENCY DEPLOYMENT NOW!"
echo "======================================"

# Make scripts executable
chmod +x scripts/emergency-deploy.sh
chmod +x scripts/deploy-fixes-now.ts
chmod +x scripts/verify-deployment.ts

# Run the emergency deployment
echo "🔥 Starting emergency deployment..."
bash scripts/emergency-deploy.sh

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "🌐 Your BHV360 application is now live at: https://bhv360.vercel.app"
echo ""
echo "🔍 Run verification:"
echo "npm run deploy:verify"
echo ""
echo "📊 Check status:"
echo "curl https://bhv360.vercel.app/api/deployment-status"
