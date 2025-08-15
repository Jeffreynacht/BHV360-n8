#!/bin/bash

# Fix PNPM Lockfile Script
# Dit script lost permanent het lockfile probleem op

echo "🔧 Fixing PNPM lockfile issues..."

# Stap 1: Controleer of PNPM geïnstalleerd is
if ! command -v pnpm &> /dev/null; then
    echo "❌ PNPM is niet geïnstalleerd. Installeer eerst PNPM:"
    echo "npm install -g pnpm@10.2.0"
    exit 1
fi

# Stap 2: Toon huidige PNPM versie
echo "📦 Huidige PNPM versie:"
pnpm --version

# Stap 3: Verwijder oude lockfile en node_modules
echo "🧹 Cleaning up old files..."
rm -rf node_modules
rm -f pnpm-lock.yaml

# Stap 4: Installeer dependencies met nieuwe lockfile
echo "📥 Installing dependencies with fresh lockfile..."
pnpm install

# Stap 5: Controleer of alles werkt
echo "✅ Testing build..."
pnpm run build

if [ $? -eq 0 ]; then
    echo "🎉 Lockfile succesvol gefixed!"
    echo "📝 Commit nu de nieuwe pnpm-lock.yaml:"
    echo "git add pnpm-lock.yaml package.json"
    echo "git commit -m 'fix: update pnpm lockfile for Vercel deployment'"
else
    echo "❌ Build failed. Check for errors above."
    exit 1
fi
