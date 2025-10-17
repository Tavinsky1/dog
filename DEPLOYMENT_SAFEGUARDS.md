# Database & Deployment Safeguards

## What Went Wrong Today (October 17, 2025)

### The Problem
1. Production was working fine using seed files
2. I incorrectly added `NEXT_PUBLIC_USE_DATABASE=true` to Vercel
3. This pointed production to an empty Postgres database
4. Result: 0 places showing on the live site

### Root Cause
- **Local development** uses SQLite database (`prisma/dev.db`) with 269 places
- **Production** was using seed files (`data/places.seed.json`) 
- Seed file was missing European cities data
- I tried to "fix" it by forcing database use, which made it worse

### The Solution
Exported all 269 places from local SQLite to `data/places.seed.json` so production has complete data.

---

## Safeguards Going Forward

### 1. **NEVER modify production environment variables without verification**

**Rule**: Before adding/changing Vercel environment variables:
1. Check if the data source (database/seed files) has the required data
2. Test locally with the same configuration
3. Use preview deployments first, NOT production

### 2. **Keep seed files in sync with database**

**Action**: Created an automated export script

```bash
# Run this whenever you update the local database
npm run export-seed
```

This script is now added to package.json.

### 3. **Production deployment checklist**

Before deploying to production, verify:
- [ ] Local build succeeds: `npm run build`
- [ ] All cities show data locally
- [ ] No environment variable changes on Vercel
- [ ] Git changes are intentional and reviewed

### 4. **Database strategy is now clear**

**Current Setup (DO NOT CHANGE):**
- **Local development**: SQLite database (`prisma/dev.db`)
- **Production (Vercel)**: Seed files (`data/places.seed.json`)
- **Why**: Seed files are bundled with deployment, always available
- **Postgres database on Vercel**: Not currently used for places (keep for future user-generated content)

### 5. **When to update places data**

**Workflow**:
1. Add/edit places in local SQLite database
2. Run `npm run export-seed` to update seed file
3. Commit the updated `data/places.seed.json`
4. Deploy to Vercel
5. Verify on production

---

## Emergency Rollback Procedure

If production breaks:

```bash
# 1. Check what changed
git log --oneline -5

# 2. Rollback to last working commit
git revert HEAD
git push origin master

# 3. Or use Vercel UI to rollback to previous deployment
# Go to: https://vercel.com/tavinskys-projects/dog-atlas
# Find last working deployment
# Click "Redeploy"
```

---

## Current Production Status ✅

- **Places in seed file**: 269
- **Cities covered**: 13 (Berlin, Paris, Barcelona, Rome, Vienna, Amsterdam, New York, Los Angeles, Sydney, Melbourne, Buenos Aires, Córdoba, Tokyo)
- **Data source**: `data/places.seed.json`
- **Database flag**: `NEXT_PUBLIC_USE_DATABASE` = NOT SET (uses seed files)
- **Last verified**: October 17, 2025

---

## Key Files

- `data/places.seed.json` - Production data source (269 places)
- `prisma/dev.db` - Local SQLite database (source of truth)
- `data/countries.json` - City metadata and dog rules
- `.env.local` - Local environment config
- Vercel dashboard - Production environment variables

---

## Commands Reference

```bash
# Export database to seed file
npm run export-seed

# Check place counts
sqlite3 prisma/dev.db "SELECT c.slug, COUNT(p.id) FROM City c LEFT JOIN Place p ON p.cityId = c.id GROUP BY c.slug;"

# Build locally before deploying
npm run build

# Deploy to production
vercel --prod

# Check Vercel environment variables
vercel env ls

# View production logs
vercel logs --prod
```

---

## Never Do This Again ❌

1. ❌ Don't add `NEXT_PUBLIC_USE_DATABASE=true` to Vercel without verifying Postgres has data
2. ❌ Don't assume seed files have all data - always verify
3. ❌ Don't deploy directly to production without testing
4. ❌ Don't modify environment variables as a "quick fix"
5. ❌ Don't panic and make rushed changes

## Always Do This ✅

1. ✅ Test changes locally first
2. ✅ Verify data exists in the data source being used
3. ✅ Keep seed files updated with database exports
4. ✅ Use git commits to track changes
5. ✅ Document what you're changing and why
6. ✅ Have a rollback plan ready

---

## Future Improvements (Optional)

1. **Automated seed file updates**: GitHub Action to export seed on database changes
2. **Production monitoring**: Alert if place count drops to 0
3. **Preview deployments**: Test all changes on preview URL before production
4. **Database migration to production**: Properly set up Postgres with all data (future project)

---

**Last Updated**: October 17, 2025  
**Status**: Production stable with 269 places ✅
