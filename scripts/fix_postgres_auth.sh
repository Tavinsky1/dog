#!/usr/bin/env bash
set -euo pipefail

# Find pg_hba.conf location
PG_HBA=""
if [ -f "/opt/homebrew/var/postgresql@16/pg_hba.conf" ]; then
  PG_HBA="/opt/homebrew/var/postgresql@16/pg_hba.conf"
elif [ -f "/usr/local/var/postgresql@16/pg_hba.conf" ]; then
  PG_HBA="/usr/local/var/postgresql@16/pg_hba.conf"
else
  echo "ERROR: Could not find pg_hba.conf file"
  exit 1
fi

echo "Found pg_hba.conf at: $PG_HBA"

# Backup original
cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d_%H%M%S)"

# Create new pg_hba.conf with md5 authentication
cat > "$PG_HBA" << 'EOF'
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     md5
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     md5
host    replication     all             127.0.0.1/32            md5
host    replication     all             ::1/128                 md5
EOF

echo "Updated pg_hba.conf to use md5 authentication"
echo "Restarting PostgreSQL..."

brew services restart postgresql@16

echo "Waiting for PostgreSQL to be ready..."
sleep 3

echo "Done! Test with: psql \"postgresql://dogatlas:dogatlas@localhost:5432/dogatlas\" -c '\\du'"
