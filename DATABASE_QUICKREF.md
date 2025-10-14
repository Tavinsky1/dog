# 🚨 DATABASE QUICK REFERENCE

## Two-Database System
```
Local Dev:  SQLite (prisma/dev.db)
Production: PostgreSQL (db.prisma.io) ← SOURCE OF TRUTH
```

## ⚠️ Golden Rules

1. **Production is Truth**: Always assume production PostgreSQL has correct data
2. **Sync Required**: Local changes do NOT automatically reach production
3. **Match by Business Keys**: Use name+country, NOT IDs (UUIDs differ)
4. **Test Locally First**: Never run untested scripts on production

## Common Workflows

### After Scraping Images Locally
```bash
# 1. Scrape images (updates local SQLite)
npx tsx scripts/imageScraperV2.ts

# 2. Verify local
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Place WHERE imageUrl IS NOT NULL"

# 3. Sync to production
PROD_DATABASE_URL="postgres://..." npx tsx scripts/sync_images_raw.ts

# 4. Verify production
PROD_DATABASE_URL="postgres://..." npx tsx scripts/check_prod_db.ts

# 5. Redeploy (if needed)
git push
```

### Verify Database State
```bash
# Local (SQLite)
sqlite3 prisma/dev.db "SELECT name, imageUrl FROM Place LIMIT 5"

# Production (PostgreSQL)
PROD_DATABASE_URL="postgres://..." npx tsx scripts/check_prod_db.ts
```

### When Production Shows Wrong Data
```bash
# 1. Check production state
PROD_DATABASE_URL="postgres://..." npx tsx scripts/check_prod_db.ts

# 2. Re-sync from local
PROD_DATABASE_URL="postgres://..." npx tsx scripts/sync_images_raw.ts

# 3. Hard refresh browser (Cmd+Shift+R)

# 4. Trigger redeployment
git commit --allow-empty -m "Redeploy" && git push
```

## Key Scripts

| Script | Purpose | Target DB |
|--------|---------|-----------|
| `imageScraperV2.ts` | Scrape images | Local SQLite |
| `sync_images_raw.ts` | Sync data | Local → Production |
| `check_prod_db.ts` | Verify data | Production PostgreSQL |

## Getting Production DB URL

```bash
# From .env.local (not in git)
cat .env.local | grep DATABASE_URL

# Or from Vercel dashboard:
# Project → Settings → Environment Variables → DATABASE_URL
```

## Emergency Contacts

- Full Guide: [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- OpenSpec: [openspec/changes/add-database-management-rules/](./openspec/changes/add-database-management-rules/)
- Scripts: [scripts/](./scripts/)

## Common Mistakes to Avoid

❌ Running scripts without checking target database
❌ Assuming local changes automatically sync to production
❌ Matching records by ID (UUIDs differ between databases)
❌ Running `prisma migrate reset` on production
❌ Forgetting to verify production after sync

✅ Always log which database you're targeting
✅ Explicitly pass PROD_DATABASE_URL for production
✅ Match by business keys (name + country)
✅ Test locally, then sync to production
✅ Verify results with check_prod_db.ts

---

**Remember**: If users see wrong data, production database needs updating! 🐕
