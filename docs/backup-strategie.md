# BHV360 Backup Strategie

Dit document beschrijft de backup strategie voor het BHV360 platform.

## Overzicht

De backup strategie bestaat uit de volgende componenten:

1. **Database backups** - PostgreSQL dumps van de Supabase database
2. **Storage backups** - Bestanden uit de Supabase storage buckets
3. **Configuratie backups** - Systeeminstellingen en configuratie

## Backup Schema

| Type | Frequentie | Tijd | Retentie |
|------|------------|------|----------|
| Database | Dagelijks | 01:00 | 30 dagen |
| Configuratie | Dagelijks | 02:00 | 30 dagen |
| Storage | Wekelijks (zondag) | 03:00 | 30 dagen |
| Volledig | Wekelijks (zaterdag) | 04:00 | 30 dagen |

## Opslag Locaties

Backups worden op twee locaties opgeslagen:

1. **Lokaal** - Op de server in `/var/backups/bhv360`
2. **Cloud** - In een S3 bucket `bhv360-backups`

## Monitoring

Alle backup jobs worden gelogd in `/var/log/bhv360/backups/`. Bij fouten worden notificaties verstuurd via:

- E-mail naar het beheerteam
- Slack webhook naar het #ops kanaal

## Herstel Procedure

### Database Herstel

\`\`\`bash
# Herstel de database van een backup
pg_restore -d [CONNECTION_STRING] [BACKUP_FILE]
\`\`\`

### Storage Herstel

Storage bestanden kunnen worden hersteld via de admin interface of via de API:

\`\`\`bash
curl -X POST https://api.bhv360.nl/api/backup/restore \
  -H "Authorization: Bearer [API_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"type": "storage", "paths": {"storage": "/path/to/storage/backup"}}'
\`\`\`

### Volledige Herstel

Voor een volledig herstel, gebruik de admin interface of de API:

\`\`\`bash
curl -X POST https://api.bhv360.nl/api/backup/restore \
  -H "Authorization: Bearer [API_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "full", 
    "paths": {
      "database": "/path/to/db/backup.sql",
      "storage": "/path/to/storage/backup",
      "config": "/path/to/config/backup.json"
    }
  }'
\`\`\`

## Verantwoordelijkheden

- **Dagelijkse controle**: Operations team
- **Wekelijkse test restore**: DevOps engineer
- **Kwartaal audit**: Security officer

## Disaster Recovery

In geval van een calamiteit:

1. Herstel de meest recente volledige backup
2. Pas incrementele backups toe indien beschikbaar
3. Valideer de data integriteit
4. Schakel over naar de herstelde omgeving

## Contact

Bij vragen of problemen met backups, neem contact op met:

- **E-mail**: ops@bhv360.nl
- **Telefoon**: +31 6 12345678
\`\`\`
