## ADDED Requirements

### Requirement: Two-Database Architecture Recognition
The system SHALL recognize and document that two separate databases exist:
- Local development: SQLite (`prisma/dev.db`)
- Production (Vercel): PostgreSQL (via `DATABASE_URL` environment variable)

#### Scenario: Developer understands database separation
- **WHEN** a developer reviews the codebase
- **THEN** documentation clearly explains the two-database architecture
- **AND** environment files include comments identifying each database purpose

#### Scenario: Script identifies target database
- **WHEN** a database operation script runs
- **THEN** it logs which database (local or production) it is targeting
- **AND** it validates the DATABASE_URL before proceeding

### Requirement: Production Database as Source of Truth
The system SHALL treat the production PostgreSQL database as the authoritative source of truth for all deployed data.

#### Scenario: Production data takes precedence
- **WHEN** there is a conflict between local and production data
- **THEN** production data SHALL be considered authoritative
- **AND** local data MAY be overwritten from production for consistency

#### Scenario: Data modifications require production sync
- **WHEN** data is modified locally (via scripts or manual operations)
- **THEN** changes MUST be synchronized to production database
- **AND** deployment MUST be verified against production data

### Requirement: Database Operation Validation
All scripts that modify database data SHALL validate their target database before execution.

#### Scenario: Environment variable validation
- **WHEN** a script attempts to connect to a database
- **THEN** it MUST validate the DATABASE_URL environment variable is set
- **AND** it MUST log the database type (SQLite or PostgreSQL) and connection string (masked)
- **AND** it MUST fail with clear error if DATABASE_URL is missing or invalid

#### Scenario: Interactive confirmation for production
- **WHEN** a script targets the production PostgreSQL database
- **THEN** it SHOULD log a warning about production access
- **AND** it MUST provide clear success/failure feedback after operations

### Requirement: Database Synchronization Pattern
When data is modified in the local database, the system SHALL provide a clear synchronization mechanism to replicate changes to production.

#### Scenario: Local to production sync
- **WHEN** data is added or updated in local SQLite database
- **THEN** a synchronization script MUST be available to replicate changes to PostgreSQL
- **AND** the sync script MUST match records by business keys (name + country) not database IDs
- **AND** the sync script MUST report success/failure statistics

#### Scenario: ID mismatch handling
- **WHEN** local and production databases have different UUIDs for the same entities
- **THEN** synchronization MUST use business keys (e.g., name, country) to match records
- **AND** synchronization MUST NOT rely on primary key IDs

#### Scenario: Sync validation
- **WHEN** synchronization completes
- **THEN** a validation script MUST verify data consistency
- **AND** the validation MUST check record counts and sample data
- **AND** any mismatches MUST be reported with actionable details

### Requirement: Database Erasure Prevention
The system SHALL prevent accidental database erasure through protective measures.

#### Scenario: Backup before destructive operations
- **WHEN** a script performs DELETE, DROP, or TRUNCATE operations
- **THEN** it MUST create a timestamped backup first
- **AND** it MUST log the backup location
- **AND** it MUST fail if backup creation fails

#### Scenario: Production database protection
- **WHEN** attempting to drop or recreate the production database
- **THEN** the system MUST require explicit confirmation
- **AND** it MUST warn about data loss consequences
- **AND** it MUST refuse operations without proper authorization

#### Scenario: Migration safety
- **WHEN** running Prisma migrations on production
- **THEN** migrations MUST be tested on a copy first
- **AND** backups MUST be created before applying
- **AND** rollback procedures MUST be documented

### Requirement: Environment Configuration Clarity
The system SHALL maintain clear environment configuration that identifies each database and its purpose.

#### Scenario: Environment file documentation
- **WHEN** a developer opens .env or .env.local
- **THEN** inline comments MUST explain which database each URL connects to
- **AND** examples MUST show both SQLite and PostgreSQL formats
- **AND** instructions MUST indicate which environment uses which database

#### Scenario: Vercel environment variables
- **WHEN** deploying to Vercel
- **THEN** environment variables MUST be configured to use PostgreSQL
- **AND** the DATABASE_URL MUST point to the production PostgreSQL instance
- **AND** no SQLite file paths MUST be referenced in production

### Requirement: Script Database Targeting
All database scripts SHALL explicitly document and enforce their target database.

#### Scenario: Script header documentation
- **WHEN** a database script is created or modified
- **THEN** file header comments MUST state target database (local, production, or both)
- **AND** comments MUST explain synchronization requirements if targeting local only
- **AND** usage examples MUST show required environment variables

#### Scenario: Default to production safety
- **WHEN** a script can operate on either database
- **THEN** it SHOULD default to local database for safety
- **AND** it MUST require explicit production flag or environment variable
- **AND** it MUST not silently assume production access

### Requirement: Data Modification Audit Trail
The system SHALL maintain an audit trail of database modifications for debugging and rollback purposes.

#### Scenario: Modification logging
- **WHEN** a script modifies database data
- **THEN** it MUST log timestamp, operation type, affected tables, and record counts
- **AND** logs MUST be written to `logs/` directory with ISO timestamps
- **AND** critical operations MUST be logged at ERROR level for visibility

#### Scenario: Sync operation history
- **WHEN** a database sync is performed
- **THEN** a sync report MUST be generated showing before/after state
- **AND** the report MUST include mismatched records, updated records, and failures
- **AND** the report MUST be saved with timestamp for future reference
