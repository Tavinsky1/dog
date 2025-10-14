## 1. Specification
- [x] 1.1 Create database-operations capability spec with requirements
- [x] 1.2 Document two-database architecture pattern
- [x] 1.3 Define production database as source of truth
- [x] 1.4 Specify synchronization procedures

## 2. Implementation
- [ ] 2.1 Update existing scripts to validate database environment
- [ ] 2.2 Add database environment checks to imageScraperV2.ts
- [ ] 2.3 Create reusable database connection utility
- [ ] 2.4 Add pre-flight checks to all data modification scripts
- [ ] 2.5 Document sync_images_raw.ts as the canonical sync pattern

## 3. Documentation
- [ ] 3.1 Add DATABASE_ARCHITECTURE.md to project root
- [ ] 3.2 Update README.md with database setup instructions
- [ ] 3.3 Add inline comments to .env files explaining each database
- [ ] 3.4 Create troubleshooting guide for database sync issues

## 4. Validation
- [ ] 4.1 Test sync script with fresh local and production databases
- [ ] 4.2 Verify all existing scripts follow new patterns
- [ ] 4.3 Run openspec validate --strict
- [ ] 4.4 Review with team for approval
