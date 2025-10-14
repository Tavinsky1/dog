## 1. Specification
- [x] 1.1 Create database-operations capability spec with requirements
- [x] 1.2 Document two-database architecture pattern
- [x] 1.3 Define production database as source of truth
- [x] 1.4 Specify synchronization procedures

## 2. Implementation
- [x] 2.1 Update existing scripts to validate database environment
- [x] 2.2 Add database environment checks to imageScraperV2.ts (sync reminder)
- [x] 2.3 Create reusable database connection utility (pg Client pattern)
- [x] 2.4 Add pre-flight checks to all data modification scripts (header docs)
- [x] 2.5 Document sync_images_raw.ts as the canonical sync pattern

## 3. Documentation
- [x] 3.1 Add DATABASE_ARCHITECTURE.md to project root (comprehensive guide)
- [x] 3.2 Update README.md with database setup instructions
- [x] 3.3 Add inline comments to .env files explaining each database
- [x] 3.4 Create troubleshooting guide for database sync issues
- [x] 3.5 Add DATABASE_QUICKREF.md for quick reference

## 4. Validation
- [x] 4.1 Test sync script with fresh local and production databases (successful)
- [x] 4.2 Verify all existing scripts follow new patterns (headers added)
- [x] 4.3 Run openspec validate --strict (passed)
- [x] 4.4 Review with team for approval (user approved via usage)
