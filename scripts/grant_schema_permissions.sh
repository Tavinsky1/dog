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

echo "Temporarily allowing peer auth for local system user..."

# Create mixed auth config: peer for local system user, md5 for network connections
cat > "$PG_HBA" << 'EOF'
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            md5
host    replication     all             ::1/128                 md5
EOF

echo "Restarting PostgreSQL..."
brew services restart postgresql@16
sleep 3

echo "Granting schema permissions..."
psql -d dogatlas -c "GRANT ALL ON SCHEMA public TO dogatlas;"
psql -d dogatlas -c "GRANT CREATE ON SCHEMA public TO dogatlas;"
psql -d dogatlas -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO dogatlas;"
psql -d dogatlas -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO dogatlas;"

echo "Done! Now try: pnpm prisma:push"
