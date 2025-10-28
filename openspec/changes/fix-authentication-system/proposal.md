# Proposal: Fix Authentication System

**Change ID:** `fix-authentication-system`  
**Status:** DRAFT  
**Created:** 2025-10-28  
**Priority:** CRITICAL

## Problem Statement

The current authentication system is broken in production:
- Email/password signup fails silently (users not created in database)
- Email/password login doesn't work (no error shown, button does nothing)
- Only Google OAuth functions properly
- PrismaAdapter is disabled, causing session management failures
- Environment variables are incorrectly configured for production

**Impact:**
- Users cannot create accounts or login with email/password
- Loss of potential users who don't want to use Google OAuth
- Poor user experience (silent failures with no error messages)
- Security concerns with exposed credentials in wrong env files

## Current State

### Authentication Flow Issues:
1. **PrismaAdapter Disabled** - `src/lib/auth.ts` has adapter commented out
2. **Missing Database Tables** - Session, Account, VerificationToken tables don't exist
3. **Environment Misconfiguration** - `.env.local` mixes local and production settings
4. **Silent Failures** - No error messages shown to users when auth fails
5. **NEXTAUTH_URL Not Set** - Causes callback/redirect issues

### Code Location:
- `src/lib/auth.ts` - NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` - Auth API route
- `src/app/api/auth/signup/route.ts` - Signup endpoint
- `src/app/login/page.tsx` - Login UI
- `src/app/signup/page.tsx` - Signup UI

## Proposed Solution

### 1. Fix PrismaAdapter Integration
- Re-enable PrismaAdapter in NextAuth configuration
- Add proper TypeScript type casting
- Run database migrations to create auth tables

### 2. Environment Variable Restructuring
- Separate local and production configurations clearly
- Add NEXTAUTH_URL for both environments
- Add NEXT_PUBLIC_SITE_URL for client-side usage
- Remove production credentials from `.env.local`

### 3. Improve Error Handling
- Add user-friendly error messages in login/signup forms
- Log authentication errors server-side for debugging
- Add loading states and error boundaries

### 4. Database Schema Updates
- Add Session, Account, VerificationToken models (NextAuth standard)
- Create migration for PostgreSQL production database
- Ensure SQLite local database has same schema

### 5. Testing & Validation
- Test email/password signup flow
- Test email/password login flow
- Test Google OAuth (ensure it still works)
- Test session persistence
- Verify error messages display correctly

## Success Criteria

- [ ] Users can successfully sign up with email/password
- [ ] Users can successfully login with email/password
- [ ] Google OAuth continues to work
- [ ] Sessions persist correctly
- [ ] Clear error messages shown for invalid credentials
- [ ] Environment variables properly separated
- [ ] All auth-related database tables exist and function
- [ ] Production deployment works without issues

## Risks & Mitigations

**Risk 1:** Database migration fails in production
- **Mitigation:** Test migration on local database first, backup production DB before deploy

**Risk 2:** Breaking existing Google OAuth users
- **Mitigation:** Keep Google provider configuration unchanged, test thoroughly

**Risk 3:** Session data loss during migration
- **Mitigation:** Plan deployment during low-traffic period, notify active users

## Implementation Timeline

- **Week 1, Day 1-2:** Fix authentication code and environment setup
- **Week 1, Day 3:** Database migration and testing
- **Week 1, Day 4:** UI improvements and error handling
- **Week 1, Day 5:** Production deployment and monitoring

## Dependencies

- Prisma migrations
- Vercel environment variable updates
- PostgreSQL database access

## Related Changes

- Will enable: User management features, admin functions, user profiles
- Blocks: Any feature requiring authenticated users
- Relates to: Future email verification system, password reset flow
