# Database Architecture

## Overview

Dog Atlas uses a **two-database architecture**:

| Environment | Database | Provider | Location | Purpose |
|-------------|----------|----------|----------|---------|
| **Local Development** | SQLite | `sqlite` | `prisma/dev.db` | Fast local iteration and testing |
| **Production (Vercel)** | PostgreSQL | `postgresql` | `db.prisma.io:5432` | Deployed application serving users |

## Critical Rules

### 🚨 Production PostgreSQL is the Source of Truth

- All user-facing data MUST exist in production PostgreSQL
- Local SQLite is for development only
- When in conflict, production data is authoritative

### ⚠️ All Local Changes MUST Sync to Production

If you modify data locally (via scripts or direct database access):
1. ✅ Test with local SQLite
2. ✅ Run sync script to replicate to production
3. ✅ Verify production database
4. ✅ Trigger Vercel redeployment if needed

**Never assume local changes automatically reach production!**

## Environment Configuration

### Local Development (`.env`)
```bash
# Local SQLite database (fast development)
DATABASE_URL="file:/Users/tavinsky/Documents/ai/DOG ATLAS/prisma/dev.db"
```

### Production (`.env.local` and Vercel)
```bash
# Production PostgreSQL (Vercel deployment)
DATABASE_URL="postgres://USERNAME:PASSWORD@db.prisma.io:5432/postgres?sslmode=require"
```

### Getting Production Database URL
1. Check `.env.local` file (not committed to git)
2. Or retrieve from Vercel dashboard: Project Settings → Environment Variables
3. Save as `PROD_DATABASE_URL` for sync scripts

## Common Operations

### Running Database Scripts

#### Scripts that Target Local SQLite
```bash
# Uses DATABASE_URL from .env (SQLite)
npx tsx scripts/imageScraperV2.ts
npx prisma studio
npx prisma migrate dev
```

#### Scripts that Target Production PostgreSQL
```bash
# Requires explicit PROD_DATABASE_URL
PROD_DATABASE_URL="postgres://..." npx tsx scripts/sync_images_raw.ts
PROD_DATABASE_URL="postgres://..." npx tsx scripts/check_prod_db.ts
```

### Syncing Local Changes to Production

After modifying data locally (e.g., running image scraper):

```bash
# 1. Verify local changes
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Place WHERE imageUrl IS NOT NULL;"

# 2. Run sync script
PROD_DATABASE_URL="postgres://..." npx tsx scripts/sync_images_raw.ts

# 3. Verify production
PROD_DATABASE_URL="postgres://..." npx tsx scripts/check_prod_db.ts

# 4. Trigger redeployment
git commit --allow-empty -m "Trigger redeployment after data sync"
git push
```

## Database Script Patterns

### Required Script Header Documentation

Every database script MUST include:

```typescript
/**
 * TARGET DATABASE: [Local SQLite | Production PostgreSQL | Both]
 * SYNC REQUIRED: [Yes | No]
 * 
 * Description: What this script does
 * 
 * Usage:
 *   For local: npx tsx scripts/my-script.ts
 *   For production: PROD_DATABASE_URL="..." npx tsx scripts/my-script.ts
 */
```

### Required Environment Validation

```typescript
// For production scripts
const prodDbUrl = process.env.PROD_DATABASE_URL;
if (!prodDbUrl) {
  throw new Error('PROD_DATABASE_URL environment variable required');
}
console.log('🎯 Targeting: Production PostgreSQL');
```

### Matching Records Between Databases

**❌ WRONG: Match by ID** (local and production have different UUIDs)
```typescript
await prisma.place.update({
  where: { id: localPlace.id },  // Will fail!
  data: { imageUrl: newUrl }
});
```

**✅ RIGHT: Match by Business Keys** (name + country)
```typescript
await pgClient.query(
  'UPDATE "Place" SET "imageUrl" = $1 WHERE name = $2 AND country = $3',
  [newUrl, place.name, place.country]
);
```

## Troubleshooting

### "Placeholders still showing on production"

**Cause**: Local database updated but production not synced

**Solution**:
1. Run sync script: `scripts/sync_images_raw.ts`
2. Verify production: `scripts/check_prod_db.ts`
3. Clear cache: Hard refresh browser (Cmd+Shift+R)
4. Redeploy: `git commit --allow-empty && git push`

### "Script can't connect to database"

**Cause**: Wrong DATABASE_URL or missing environment variable

**Solution**:
- Check which database you're targeting (local or production)
- For local: Ensure `.env` has `DATABASE_URL="file:..."`
- For production: Pass `PROD_DATABASE_URL="postgres://..."` explicitly
- Verify connection string format matches provider (sqlite vs postgresql)

### "Prisma migrate fails on production"

**Cause**: Trying to run SQLite migrations on PostgreSQL

**Solution**:
- NEVER run `prisma migrate` directly on production
- Instead: Update schema, test locally, then update production via Vercel
- For production schema changes: Use Vercel environment variables, let deployment handle it

### "Data exists locally but not in production"

**Cause**: Forgot to sync after local operation

**Solution**:
1. Confirm local data: `sqlite3 prisma/dev.db "SELECT * FROM Place LIMIT 5"`
2. Run sync: `scripts/sync_images_raw.ts`
3. Add checklist reminder to script output

## Safety Measures

### Before Destructive Operations

```typescript
// Create timestamped backup
const backup = `backups/db-${new Date().toISOString()}.sql`;
console.log(`📦 Creating backup: ${backup}`);
// ... backup logic ...

// Then proceed with operation
```

### Production Database Protection

- ❌ NEVER run `prisma migrate reset` on production
- ❌ NEVER run `DROP DATABASE` without explicit confirmation
- ❌ NEVER test destructive scripts on production first
- ✅ ALWAYS test on local copy first
- ✅ ALWAYS create backups before schema changes
- ✅ ALWAYS use transactions for multi-step updates

## Checklist for New Database Scripts

- [ ] Header documentation (target database, sync requirement)
- [ ] Environment validation (`if (!dbUrl) throw Error`)
- [ ] Target database logging (`console.log('🎯 Targeting: ...')`)
- [ ] Business key matching (not ID-based)
- [ ] Error handling with clear messages
- [ ] Success/failure statistics reporting
- [ ] Sync reminder in output (if local-only)
- [ ] Testing on local before production

## Reference Scripts

- **`scripts/sync_images_raw.ts`** - Canonical sync pattern (SQLite → PostgreSQL)
- **`scripts/check_prod_db.ts`** - Production database validation
- **`scripts/imageScraperV2.ts`** - Example of local-only script requiring sync

## Emergency Procedures

### If Production Database Corrupted

1. **Stop deployments**: Pause in Vercel dashboard
2. **Assess damage**: Run `check_prod_db.ts` to see what's affected
3. **Restore from backup**: If available, restore previous state
4. **Re-sync from local**: If local is correct, re-run sync script
5. **Verify data**: Manually check sample records
6. **Redeploy**: Resume deployments and verify site

### If Sync Script Fails

1. **Check error message**: Look for connection issues vs data issues
2. **Verify environment**: Ensure `PROD_DATABASE_URL` is correct
3. **Test connection**: Use `check_prod_db.ts` to verify access
4. **Check business keys**: Ensure name+country combinations are unique
5. **Run with verbose logging**: Add debug output to identify issue
6. **Manual fallback**: If script fails, document manual SQL commands

## Best Practices

1. **Default to Local**: Always test with SQLite first
2. **Explicit Production**: Require explicit flag/env var for production access
3. **Log Everything**: Verbose logging helps debug sync issues
4. **Validate Results**: Always verify data after sync
5. **Document Changes**: Keep audit trail of database modifications
6. **Ask for Help**: If unsure, ask before running on production

---

**Remember**: Local database is for experimentation. Production database serves real users. Always sync your changes! 🐕
