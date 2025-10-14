# Database Management Rules Proposal

## Why

Critical database management incident occurred where:
1. Image scraping script updated local SQLite database only
2. Production (Vercel) uses separate PostgreSQL database
3. User saw placeholders despite successful scraping
4. Root cause: Two-database architecture was not documented
5. Initial sync used wrong matching criteria (ID instead of name+country)

This led to confusion, wasted time, and poor user experience. We need clear rules to prevent database mismatches and ensure all scripts target the correct database.

## What Changes

- **Add database management capability specification** with strict rules
- Document two-database architecture (SQLite for local dev, PostgreSQL for production)
- Establish that production PostgreSQL is the source of truth
- Require all data modification scripts to target production database OR include sync step
- Define synchronization procedures for local → production data flow
- Prevent database erasure by requiring backups before destructive operations
- Mandate environment variable validation before database operations

## Impact

- **Affected specs**: New capability `database-operations`
- **Affected code**:
  - All scripts in `scripts/` directory that interact with database
  - Environment configuration (`.env`, `.env.local`)
  - `prisma/schema.prisma` provider selection
  - Future scraping, import, and data modification scripts
- **Documentation**: Add database management guidelines to project docs
- **Development workflow**: Require production database testing for all data changes
