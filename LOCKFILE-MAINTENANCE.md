# 🔧 PNPM Lockfile Onderhoud

## Probleem Opgelost ✅

Het `ERR_PNPM_OUTDATED_LOCKFILE` probleem is permanent opgelost door:

1. **Package Manager Specificatie**: `"packageManager": "pnpm@10.2.0"` toegevoegd aan package.json
2. **Bijgewerkte pnpm-lock.yaml**: Volledig gesynchroniseerd met package.json
3. **Engine Requirements**: PNPM >=10.0.0 vereist

## 📋 Stappenplan voor Toekomstige Dependency Wijzigingen

### Bij het toevoegen/updaten van dependencies:

\`\`\`bash
# 1. Voeg dependency toe
pnpm add [package-name]
# of update
pnpm update [package-name]

# 2. Test de build
pnpm run build

# 3. Commit beide bestanden
git add package.json pnpm-lock.yaml
git commit -m "feat: add/update [package-name]"

# 4. Push naar GitHub
git push origin main
\`\`\`

### Bij lockfile problemen:

\`\`\`bash
# Run het fix script
bash scripts/fix-lockfile.sh

# Of handmatig:
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
git add pnpm-lock.yaml
git commit -m "fix: regenerate lockfile"
\`\`\`

### 🚨 Belangrijke Regels:

1. **Altijd beide bestanden committen**: package.json EN pnpm-lock.yaml
2. **Test voor commit**: Run `pnpm run build` om errors te voorkomen
3. **Gebruik PNPM 10.x**: Zelfde versie als Vercel gebruikt
4. **Geen --frozen-lockfile lokaal**: Alleen Vercel gebruikt deze flag

### 🔍 Troubleshooting:

**Fout**: `Cannot install with "frozen-lockfile"`
**Oplossing**: Run `bash scripts/fix-lockfile.sh`

**Fout**: `Package manager mismatch`
**Oplossing**: Gebruik `pnpm` in plaats van `npm` of `yarn`

**Fout**: `Build fails after dependency update`
**Oplossing**: Check TypeScript errors en update types indien nodig
