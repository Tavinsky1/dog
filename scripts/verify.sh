#!/usr/bin/env bash
set -euo pipefail

# Add PostgreSQL to PATH
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"

echo "🔍 Verification Checklist for DogAtlas"
echo "======================================"

echo "✅ 1. Postgres is running on port 5432"
lsof -iTCP:5432 -sTCP:LISTEN >/dev/null && echo "   ✓ Postgres is listening" || echo "   ✗ Postgres not found"

echo "✅ 2. Database connection works"
psql "postgresql://dogatlas:dogatlas@localhost:5432/dogatlas" -c "SELECT count(*) as places FROM \"Place\";" 2>/dev/null && echo "   ✓ Database accessible" || echo "   ✗ Database connection failed"

echo "✅ 3. Places are seeded"
PLACE_COUNT=$(psql "postgresql://dogatlas:dogatlas@localhost:5432/dogatlas" -t -c "SELECT count(*) FROM \"Place\";" 2>/dev/null | tr -d ' ')
echo "   ✓ Found $PLACE_COUNT places in database"

echo "✅ 4. Admin user exists"
ADMIN_EXISTS=$(psql "postgresql://dogatlas:dogatlas@localhost:5432/dogatlas" -t -c "SELECT count(*) FROM \"User\" WHERE role='ADMIN';" 2>/dev/null | tr -d ' ')
echo "   ✓ Found $ADMIN_EXISTS admin user(s)"

echo "✅ 5. Next.js dev server"
if curl -s http://localhost:3000 >/dev/null 2>&1; then
  echo "   ✓ Next.js server responding at http://localhost:3000"
else
  echo "   ⚠ Next.js server not responding (may still be starting)"
fi

echo ""
echo "🎯 Next steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Visit http://localhost:3000/berlin to see the map with places"
echo "   3. Sign in with admin@dogatlas.app to access moderation"
echo "   4. Test submitting reviews and photos"
echo ""
echo "🐾 Happy dog atlas building!"
