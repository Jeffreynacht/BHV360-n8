#!/bin/bash
# Script om backup cron jobs in te stellen

# Controleer of we root zijn
if [ "$EUID" -ne 0 ]; then
  echo "Dit script moet worden uitgevoerd als root"
  exit 1
fi

# Pad naar de applicatie
APP_PATH="/var/www/bhv360"
NODE_PATH=$(which node)
LOG_PATH="/var/log/bhv360/backups"

# Maak log directory aan als deze niet bestaat
mkdir -p $LOG_PATH
chown www-data:www-data $LOG_PATH

# Stel cron jobs in
echo "# BHV360 Backup Cron Jobs" > /tmp/bhv360-backup-cron
echo "# Automatisch gegenereerd op $(date)" >> /tmp/bhv360-backup-cron
echo "" >> /tmp/bhv360-backup-cron

# Dagelijkse database backup om 01:00
echo "0 1 * * * www-data cd $APP_PATH && $NODE_PATH scripts/backup-scheduler.js --type=database >> $LOG_PATH/database-backup.log 2>&1" >> /tmp/bhv360-backup-cron

# Dagelijkse configuratie backup om 02:00
echo "0 2 * * * www-data cd $APP_PATH && $NODE_PATH scripts/backup-scheduler.js --type=config >> $LOG_PATH/config-backup.log 2>&1" >> /tmp/bhv360-backup-cron

# Wekelijkse storage backup op zondag om 03:00
echo "0 3 * * 0 www-data cd $APP_PATH && $NODE_PATH scripts/backup-scheduler.js --type=storage >> $LOG_PATH/storage-backup.log 2>&1" >> /tmp/bhv360-backup-cron

# Wekelijkse volledige backup op zaterdag om 04:00
echo "0 4 * * 6 www-data cd $APP_PATH && $NODE_PATH scripts/backup-scheduler.js --type=full >> $LOG_PATH/full-backup.log 2>&1" >> /tmp/bhv360-backup-cron

# Installeer de cron jobs
crontab -u www-data /tmp/bhv360-backup-cron

# Verwijder het tijdelijke bestand
rm /tmp/bhv360-backup-cron

echo "Backup cron jobs succesvol ingesteld!"
echo "Log bestanden worden opgeslagen in $LOG_PATH"
