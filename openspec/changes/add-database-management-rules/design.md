# Database Management Design

## Context

The Dog Atlas application uses a two-database architecture:
- **Local Development**: SQLite database (`prisma/dev.db`) for fast local iterations
- **Production (Vercel)**: PostgreSQL database hosted at `db.prisma.io` for deployed application

This dual-database setup caused critical issues when the image scraping script updated only the local SQLite database, leaving production with placeholder images. The root cause was lack of documented procedures and awareness of the two-database architecture.

**Constraints:**
- Prisma schema supports single provider (`sqlite` or `postgresql`)
- Local and production databases may have different UUIDs for same entities
- Vercel deployment uses environment variables for database connection
- Some operations (scraping, imports) are run locally but must affect production

**Stakeholders:**
- Developers running local scripts
- Users viewing production site (must see correct data)
- DevOps deploying to Vercel

## Goals / Non-Goals

**Goals:**
- Prevent database synchronization issues between local and production
- Ensure all data modifications reach production database
- Protect production database from accidental erasure
- Provide clear patterns for database operations
- Enable safe local development with production sync capability

**Non-Goals:**
- Real-time bidirectional sync (local ↔ production)
- Automatic synchronization (requires explicit sync step)
- Single unified database (two-database pattern is acceptable)
- Complex ORM abstraction (Prisma + raw SQL is sufficient)

## Decisions

### Decision: Production PostgreSQL as Source of Truth
**Why**: Vercel deployment serves real users from PostgreSQL. All user-facing data must be in production.

**Alternatives considered:**
- Local SQLite as source: Rejected - doesn't reflect what users see
- Bidirectional sync: Rejected - adds complexity, unnecessary for current use case

**Implementation:**
- Document production database as authoritative
- All local changes require sync to production
- Validation scripts check production database state

### Decision: Business Key Matching for Sync
**Why**: Local and production databases use different UUIDs for same records.

**Technical approach:**
```sql
-- WRONG: Match by ID (fails when UUIDs differ)
UPDATE "Place" SET "imageUrl" = $1 WHERE id = $2

-- RIGHT: Match by business keys (name + country)
UPDATE "Place" SET "imageUrl" = $1 WHERE name = $2 AND country = $3
```

**Alternatives considered:**
- UUID synchronization: Rejected - requires schema changes, breaks existing data
- Manual ID mapping table: Rejected - too complex for current scale

### Decision: Explicit Database Targeting
**Why**: Implicit database selection caused production data to be missed.

**Pattern:**
```typescript
// Script header documentation (REQUIRED)
/**
 * TARGET DATABASE: Production PostgreSQL (via PROD_DATABASE_URL)
 * SYNC REQUIRED: No (directly targets production)
 * 
 * This script updates production database directly.
 * Run with: PROD_DATABASE_URL="postgres://..." npx tsx script.ts
 */

// Environment validation (REQUIRED)
const prodDbUrl = process.env.PROD_DATABASE_URL;
if (!prodDbUrl) {
  throw new Error('PROD_DATABASE_URL environment variable required');
}
console.log('🎯 Targeting: Production PostgreSQL');
```

### Decision: Separate Clients for Different Providers
**Why**: Prisma schema is compiled with single provider, can't connect to both SQLite and PostgreSQL simultaneously.

**Solution**: Use `pg` library directly for PostgreSQL when reading from SQLite:
```typescript
// Read from local SQLite (using Prisma)
const localPrisma = new PrismaClient({
  datasources: { db: { url: 'file:./prisma/dev.db' } }
});

// Write to production PostgreSQL (using pg client)
const pgClient = new Client({
  connectionString: process.env.PROD_DATABASE_URL
});
await pgClient.query('UPDATE "Place" SET ...', [params]);
```

### Decision: Sync Script as Canonical Pattern
**Why**: Image scraping issue revealed need for repeatable sync process.

**Reference implementation**: `scripts/sync_images_raw.ts`
- Reads from local SQLite
- Connects to production PostgreSQL with raw SQL
- Matches by business keys (name + country)
- Reports statistics (updated, skipped, failed)
- Handles errors gracefully

**Usage for future scripts:**
1. Modify data locally (fast iteration)
2. Test with local database
3. Run sync script to replicate to production
4. Verify production data
5. Trigger Vercel redeployment if needed

## Risks / Trade-offs

### Risk: Manual Sync Step Forgotten
**Impact**: Production data out of sync, users see stale/incorrect data

**Mitigation:**
- Add sync reminder to script output
- Document sync requirement in script headers
- Create checklist in tasks.md for data operations
- Consider pre-commit hook to detect local-only changes

### Risk: Business Key Collisions
**Impact**: Sync updates wrong record if names aren't unique

**Mitigation:**
- Use compound keys (name + country + type) for uniqueness
- Add validation to detect duplicates before sync
- Log warning if multiple records match criteria

### Risk: Production Database Accidentally Dropped
**Impact**: Total data loss, catastrophic failure

**Mitigation:**
- Never use `prisma migrate reset` on production
- Require backups before destructive operations
- Document production database protection in spec
- Consider read-only credentials for most operations

### Trade-off: Two Databases vs Single Source
**Trade-off**: Maintaining two databases adds complexity but enables fast local development

**Accepted because:**
- Local SQLite is significantly faster for development
- PostgreSQL required for Vercel hosting (no SQLite support)
- Sync overhead is acceptable for current scale (166 places)
- Clear documentation mitigates complexity

## Migration Plan

### Phase 1: Documentation (Immediate)
1. Create `DATABASE_ARCHITECTURE.md` in project root
2. Add comments to `.env` and `.env.local` explaining each database
3. Update `README.md` with database setup section
4. Add script header documentation to all database scripts

### Phase 2: Script Hardening (Within 1 week)
1. Add environment validation to existing scripts
2. Create reusable `validateDatabaseEnv()` utility
3. Update `imageScraperV2.ts` to warn about sync requirement
4. Add pre-flight checks to import scripts

### Phase 3: Monitoring (Within 2 weeks)
1. Create `scripts/validate_prod_sync.ts` to check local/prod consistency
2. Add sync status check to deployment checklist
3. Set up alerts for database drift (optional)

### Rollback Plan
If issues arise:
1. Revert to previous deployment via Vercel dashboard
2. Restore production database from backup (if available)
3. Re-run sync script with corrected data
4. Verify with `scripts/check_prod_db.ts`

## Open Questions

1. **Should we automate sync as post-script hook?**
   - Pro: Guarantees production update
   - Con: Slower local development, accidental production changes
   - Decision: Keep manual for now, revisit if forgotten frequently

2. **Should we add database backup automation?**
   - Pro: Safety net for mistakes
   - Con: Storage costs, retention policy needed
   - Decision: Document manual backup process first, automate if critical

3. **Should local database be periodically refreshed from production?**
   - Pro: Local development uses realistic data
   - Con: Privacy concerns, large data transfers
   - Decision: Not required currently, add if local/prod drift becomes issue
