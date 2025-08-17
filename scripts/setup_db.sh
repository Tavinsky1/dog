#!/usr/bin/env bash
set -euo pipefail

# Path hint for Homebrew Postgres binaries
if [ -d "/opt/homebrew/opt/postgresql@16/bin" ]; then
  export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
elif [ -d "/usr/local/opt/postgresql@16/bin" ]; then
  export PATH="/usr/local/opt/postgresql@16/bin:$PATH"
fi

DB=dogatlas
USER=dogatlas
PASS=dogatlas

echo "Starting/ensuring Postgres@16 is running..."
brew services start postgresql@16 >/dev/null 2>&1 || true

echo "Creating role/user if missing…"
psql -d postgres -v ON_ERROR_STOP=1 -c "DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='${USER}') THEN
    CREATE ROLE ${USER} LOGIN PASSWORD '${PASS}';
  END IF;
END \$\$;"

echo "Creating database if missing…"
psql -d postgres -v ON_ERROR_STOP=1 -c "DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname='${DB}') THEN
    CREATE DATABASE ${DB} OWNER ${USER};
  END IF;
END \$\$;"

echo "Granting privileges…"
psql -d "${DB}" -v ON_ERROR_STOP=1 -c "GRANT ALL PRIVILEGES ON DATABASE ${DB} TO ${USER};"

echo "Done. Verify with: psql \"postgresql://${USER}:${PASS}@localhost:5432/${DB}\" -c '\\du'"
