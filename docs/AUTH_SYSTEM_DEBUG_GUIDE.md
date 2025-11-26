# Dog Atlas Authentication System - Debug Guide

## Current Status: ✅ RUNNING
- **Server Port:** localhost:3000
- **Framework:** Next.js 15.5.4 with NextAuth.js v4
- **Session Strategy:** JWT (JSON Web Tokens)
- **Providers:** Google OAuth + Credentials (Email/Username + Password)

---

## Architecture Overview

### Session Strategy
- **Type:** JWT (not database sessions)
- **Location:** HTTP-only cookies
- **Max Age:** 30 days
- **Why JWT:** Required for CredentialsProvider compatibility

### Authentication Flow
1. User submits credentials (email/username + password)
2. Server validates against database via `authorize()` callback
3. JWT token created with user data (`token.sub = user.id`)
4. Token stored in HTTP-only cookie
5. Session hydrated on each request via `session()` callback

---

## Files to Share with External AI

### Core Authentication Files (MUST INCLUDE)

1. **`src/lib/auth.ts`** - Main NextAuth configuration
   - Defines providers (Google OAuth + Credentials)
   - JWT and session callbacks
   - Redirect logic
   - User authorization logic

2. **`src/app/login/page.tsx`** - Login form and logic
   - Email/username input
   - Password input
   - Form submission handling
   - Error display
   - Google sign-in button

3. **`src/components/HeaderWrapper.tsx`** - Sign-out button and session display
   - Displays user session status
   - Sign-out button implementation
   - Session loading states
   - User profile display

4. **`src/app/layout.tsx`** - Root layout with providers
   - SessionProvider wrapper
   - Provider initialization
   - Global component setup

5. **`src/components/Providers.tsx`** - Authentication provider setup
   - SessionProvider configuration
   - Toast context setup

### Supporting Files (INCLUDE IF ISSUES PERSIST)

6. **`next.config.js`** - Next.js configuration
   - CSP headers
   - Redirect rules
   - Build configuration

7. **`prisma/schema.prisma`** - Database schema
   - User model definition
   - Password hash storage
   - Email and name fields

8. **`.env.local`** - Environment variables
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET

---

## Known Issues & Current Implementation

### Issue #1: JWT Token Persistence
**Status:** ✅ FIXED
- **Solution:** Added `token.sub = user.id` in JWT callback
- **Critical:** Without this, sessions don't persist

### Issue #2: Port Mismatch
**Status:** ✅ FIXED
- **Solution:** Added dynamic `redirect()` callback in auth.ts
- **Critical:** Prevents redirect loops when port changes

### Issue #3: CSP Blocking JavaScript
**Status:** ✅ FIXED
- **Solution:** Added CSP headers with `unsafe-eval` in development
- **Location:** next.config.js

### Issue #4: Sign-out Loop
**Status:** ✅ FIXED
- **Solution:** Using `signOut({ callbackUrl: "/" })` with proper async handling
- **Critical:** Multiple implementations exist in HeaderWrapper

---

## Testing Checklist

### Login Flow
- [ ] Navigate to /login
- [ ] Enter email/username and password
- [ ] Click "Sign in" button
- [ ] Should redirect to home page
- [ ] User should be visible in header

### Google OAuth Flow
- [ ] Click "Sign in with Google" button
- [ ] Complete Google authentication
- [ ] Should redirect to home page
- [ ] User created in database automatically
- [ ] Session established

### Sign-out Flow
- [ ] Click sign-out button
- [ ] Should redirect to home page
- [ ] User should be removed from header
- [ ] Session cleared from browser

---

## Prompt for External AI

### Primary Prompt:

```
I have a Next.js 15 application with NextAuth.js v4 authentication system.

CURRENT STATE:
- Using JWT session strategy (required for CredentialsProvider + Google OAuth)
- Providers: Google OAuth + Email/Username credentials
- Database: Prisma with SQLite (local) / PostgreSQL (production)

ISSUE/REQUEST:
[DESCRIBE YOUR SPECIFIC ISSUE HERE - e.g., "Login works but sign-out doesn't clear session", "Google OAuth redirects incorrectly", etc.]

CONTEXT:
- The system uses both database-based user lookup (via Prisma) and JWT tokens for session management
- Email/username normalization happens on both signup and login (lowercased + trimmed)
- There are two sign-out implementations in HeaderWrapper that may be conflicting

FILES BELOW:
1. src/lib/auth.ts - NextAuth configuration
2. src/app/login/page.tsx - Login page implementation
3. src/components/HeaderWrapper.tsx - Header with sign-out button
4. src/app/layout.tsx - Root layout with SessionProvider
5. src/components/Providers.tsx - Provider setup
6. prisma/schema.prisma - User model
7. next.config.js - CSP headers configuration
8. .env.local - Environment variables
```

---

## Debug Commands

```bash
# Check if server is running
curl -i http://localhost:3000/api/auth/csrf

# Check session endpoint
curl http://localhost:3000/api/auth/session

# Check providers
curl http://localhost:3000/api/auth/providers

# View raw cookies
curl -v http://localhost:3000 | grep -i cookie

# Check for errors
npm run lint
npm run build
```

---

## Key Callback Functions

### JWT Callback
- **When:** After successful sign-in
- **Purpose:** Create/modify JWT token
- **Critical:** Must set `token.sub = user.id`

### Session Callback
- **When:** On every request after authentication
- **Purpose:** Hydrate session object from token
- **Must return:** User with id, email, name, role

### SignIn Callback
- **When:** During OAuth flow only
- **Purpose:** Create/update user in database
- **Must return:** true/false for allow/deny

### Redirect Callback
- **When:** After successful authentication
- **Purpose:** Determine redirect destination
- **Must return:** Valid URL within same origin

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Session not persisting | Missing `token.sub` | Add `token.sub = user.id` in JWT callback |
| Sign-out redirect fails | Port mismatch | Use dynamic redirect callback |
| CSP blocks scripts | Strict CSP | Add `unsafe-eval` for development |
| Login loop | Incorrect redirect | Check redirect callback for origin mismatch |
| Google OAuth fails | Missing env vars | Ensure GOOGLE_CLIENT_ID/SECRET set |
| Email case mismatch | Inconsistent normalization | Ensure both signup and login use `.toLowerCase().trim()` |

---

## Next Steps

1. Test all three flows (credentials login, Google OAuth, sign-out)
2. Check browser console for errors
3. Check DevTools Network tab for failed requests
4. Verify environment variables are loaded
5. Check Prisma query logs for database errors

