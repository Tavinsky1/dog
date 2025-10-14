# 🚨 DATABASE SAFETY GUIDE

## ⚠️ CRITICAL: What Happened on Oct 14, 2025

**The entire production database was accidentally wiped** by running:
```bash
npx prisma db push --force-reset
```

While `.env.local` pointed to the production PostgreSQL database at `db.prisma.io`.

**ALL 167 PLACES, 4 CITIES, AND ALL USER DATA WAS LOST.**

Data was successfully restored from CSV backups in `/data/` directory.

## 🛡️ Protection Systems Now In Place

### 1. Automatic Daily Backups

**Every day at 2 AM**, the database is automatically backed up to:
```
/backups/YYYY-MM-DD/
  ├── cities.csv
  ├── cities.json
  ├── places.csv
  ├── places.json
  ├── reviews.csv
  ├── reviews.json
  ├── users.json
  ├── photos.json
  └── manifest.json
```

**Run manual backup anytime:**
```bash
npm run backup
```

Backups are kept for 30 days, then automatically cleaned up.

### 2. Safe Prisma Commands

**NEVER run `npx prisma` directly anymore!**

Instead, use the safe wrapper:
```bash
npm run db:safe -- db push
npm run db:safe -- migrate dev
npm run db:safe -- db reset
```

This wrapper will:
- ✅ Show you which database you're targeting
- ✅ Detect if it's production
- ✅ Require double confirmation for destructive operations
- ✅ Create automatic emergency backup before proceeding

### 3. Separate Development Database

The new `.env` file uses **local SQLite** by default:
```env
DATABASE_URL="file:./dev.db"
```

**Production database** is ONLY in `.env.local` (git-ignored):
```env
DATABASE_URL="postgresql://...@db.prisma.io/..."
```

## 🔧 How to Work Safely

### For Local Development:

```bash
# 1. Use local SQLite (default)
npm run dev

# 2. Push schema changes to local DB
npm run db:safe -- db push

# 3. View local data
npm run prisma:studio
```

### To Test Against Production:

```bash
# 1. Load production environment
export $(cat .env.local | grep -v '^#' | xargs)

# 2. ALWAYS use safe wrapper
npm run db:safe -- db push

# 3. Backup first if needed
npm run backup
```

### To Restore Data:

```bash
# From latest backup
npm run restore

# Or from specific backup date
npx tsx scripts/restore_from_backup.ts 2025-10-14
```

## 📋 Checklist Before ANY Database Command

- [ ] Am I using `.env` (local) or `.env.local` (production)?
- [ ] Did I create a backup? (`npm run backup`)
- [ ] Am I using the safe wrapper? (`npm run db:safe`)
- [ ] Do I have a tested rollback plan?

## 🚀 Backup to Cloud (Recommended)

Set up automated backups to cloud storage:

```bash
# Add to cron (daily at 2 AM)
0 2 * * * cd /path/to/dog-atlas && npm run backup && aws s3 sync backups/ s3://dogatlas-backups/

# Or use Vercel Cron Jobs
# See: https://vercel.com/docs/cron-jobs
```

## 🔗 Quick Commands Reference

```bash
# Backup
npm run backup              # Create backup now
npm run backup:now          # Alias

# Restore
npm run restore             # Restore from CSV

# Safe Prisma
npm run db:safe -- db push
npm run db:safe -- migrate dev
npm run db:safe -- generate

# NEVER DO THIS:
# npx prisma db push --force-reset  ❌ DANGEROUS!
```

## 📞 Emergency Recovery

If data is lost again:

1. **STOP EVERYTHING** - Don't run any more commands
2. Check `/backups/` directory for latest backup
3. Run: `npm run restore`
4. Check `/data/` for CSV exports
5. Verify restoration: Check Prisma Studio

## 🎓 Lessons Learned

1. **Never use `--force-reset`** in production
2. **Always separate dev and prod databases**
3. **Backup before risky operations**
4. **Test restoration procedures regularly**
5. **Use confirmation prompts for destructive operations**

---

**Remember**: Data loss is permanent. These safeguards exist to protect months of work.

**When in doubt**: Backup first, ask questions later.
