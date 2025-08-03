#!/usr/bin/env node

import { writeFileSync, existsSync } from "fs"
import { join } from "path"

const ENV_TEMPLATE = `# BHV360 Environment Variables
# Copy this file to .env.local and fill in your values

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=bhv360.nl
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Features
NEXT_PUBLIC_ENABLE_BROWSER_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
NEXT_PUBLIC_ENABLE_REAL_TIME=true

# Optional: Monitoring & Alerts
SLACK_WEBHOOK_URL=
DISCORD_WEBHOOK_URL=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# Optional: Backup Configuration
BACKUP_DIR=./backups
BACKUP_RETENTION_DAYS=30
S3_BACKUP_ENABLED=false
S3_BACKUP_BUCKET=
S3_BACKUP_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

# Development
NODE_ENV=development
`

function setupEnvironment() {
  console.log("🔧 Setting up BHV360 environment...")

  const envPath = join(process.cwd(), ".env.local")
  const envExamplePath = join(process.cwd(), ".env.example")

  // Create .env.example
  writeFileSync(envExamplePath, ENV_TEMPLATE)
  console.log("✅ Created .env.example")

  // Create .env.local if it doesn't exist
  if (!existsSync(envPath)) {
    writeFileSync(envPath, ENV_TEMPLATE)
    console.log("✅ Created .env.local")
    console.log("⚠️  Please fill in your Supabase credentials in .env.local")
  } else {
    console.log("ℹ️  .env.local already exists")
  }

  console.log("\n🎯 Next steps:")
  console.log("1. Create a Supabase project at https://supabase.com")
  console.log("2. Copy your Supabase URL and keys to .env.local")
  console.log("3. Run the database schema in Supabase SQL Editor")
  console.log("4. Run: npm run test:db")
}

setupEnvironment()
