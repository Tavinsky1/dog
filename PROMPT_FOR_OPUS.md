# Critical Authentication Bug - Sign In/Sign Out Loop Issue

## Context
Next.js 15.5.4 app with NextAuth.js v4, JWT session strategy, Google OAuth + Credentials providers. The app has a critical authentication loop where sign-out is triggered automatically after successful sign-in.

## Current Symptoms
1. **Sign-out loop**: After successful Google OAuth login, `POST /api/auth/signout` is called automatically in a loop without any user interaction
2. **File corruption**: `src/components/HeaderWrapper.tsx` has 192 lines but should have ~163 lines - there appears to be duplicate/hidden code at the bottom
3. **Alternating failures**: When we fix sign-in, sign-out breaks. When we fix sign-out, sign-in breaks. This cycle has repeated ~20 times.

## Terminal Evidence
```
GET /api/auth/callback/google... 302 in 331ms  ← Login succeeds
GET / 200 in 190ms                              ← Redirects to home
POST /api/auth/signout 200 in 20ms             ← AUTOMATIC (no button click!)
GET / 200 in 106ms
POST /api/auth/signout 200 in 11ms             ← Loop continues
GET / 200 in 72ms
POST /api/auth/signout 200 in 14ms             ← Repeats indefinitely
```

## Key Files to Audit

### 1. `/src/components/HeaderWrapper.tsx` (192 lines - CORRUPTED)
- Current size: 192 lines (should be ~163)
- Contains duplicate code at lines 160-192 (OLD problematic implementation)
- The file shows different content when read with different tools
- **Critical issue**: There are TWO sign-out button implementations in this file

### 2. `/src/lib/auth.ts` (152 lines - LIKELY CORRECT)
- JWT session strategy (correct for CredentialsProvider)
- Has `token.sub` set in jwt callback (CRITICAL for session persistence)
- Google OAuth + Credentials providers
- SignIn callback creates/updates users in DB
- Debug mode currently: true

### 3. `/src/app/login/page.tsx` (162 lines - CORRECT)
- Supports email/username + password OR Google OAuth
- No issues found here

## What We've Tried (20+ iterations)

### Attempts that FAILED:
1. ✗ Using `signOut({ redirect: false })` then `window.location.href`
2. ✗ Adding `e.preventDefault()` and `e.stopPropagation()`
3. ✗ Async/await on signOut
4. ✗ State management with `isSigningOut` flag
5. ✗ Switching between database and JWT session strategies
6. ✗ Removing/adding PrismaAdapter
7. ✗ Custom cookie configurations
8. ✗ Various combinations of redirect parameters
9. ✗ Clearing browser cache (helped temporarily but loop returned)
10. ✗ Clearing .next build cache (helped temporarily but loop returned)

### What PARTIALLY Works:
- Fresh incognito browser window + cleared .next cache = sign-in works WITHOUT loop
- But after ANY code change or page refresh, loop returns
- This suggests **browser is caching old JavaScript or there's actual duplicate code**

## Critical Findings

### Finding #1: File Size Discrepancy
```bash
$ wc -l src/components/HeaderWrapper.tsx
192 src/components/HeaderWrapper.tsx

$ read_file (lines 1-170)  # Shows clean code, ends at line 163

$ sed -n '160,192p' (lines 160-192)  # Shows DUPLICATE old code with:
  - Old signOut implementation with isSigningOut state
  - Different button styling (red instead of slate)
  - User profile display with image
```

### Finding #2: Grep Shows Duplicates
```bash
$ grep -n "signOut" src/components/HeaderWrapper.tsx
6:import { useSession, signIn, signOut } from "next-auth/react";
133:                onClick={() => signOut({ callbackUrl: "/" })}
6:import { useSession, signIn, signOut } from "next-auth/react";  # DUPLICATE!
133:                onClick={() => signOut({ callbackUrl: "/" })}  # DUPLICATE!
```

### Finding #3: Terminal Shows Automatic Trigger
- The signOut endpoint is called IMMEDIATELY after successful login
- NOT from button clicks (happens before user can interact)
- Suggests either:
  - Duplicate component rendering and calling signOut
  - useEffect somewhere triggering signOut
  - Corrupted JavaScript being served from cache

## Requirements for Solution

### Must Have:
1. **Clean single implementation** - No duplicate code anywhere
2. **Sign-in works** - Google OAuth authenticates and creates session
3. **Username displays** - Blue badge shows user's name when logged in
4. **Sign-out works** - Button clears session and shows "Sign in" again
5. **No loops** - No automatic sign-out after successful sign-in
6. **Session persistence** - User stays logged in across page refreshes

### Nice to Have:
1. Loading states during sign-out
2. Error handling for auth failures
3. Security best practices (httpOnly cookies, CSRF protection)
4. Disabled button during sign-out to prevent double-clicks

## Tasks for You

### Task 1: Investigate File Corruption
1. Examine the COMPLETE `src/components/HeaderWrapper.tsx` file (all 192 lines)
2. Identify where the duplicate code starts (likely around line 160)
3. Determine if there's actual duplicate JSX or if it's a React rendering issue
4. Check for any hidden characters, encoding issues, or malformed JSX

### Task 2: Find the Auto-Trigger Source
1. Search the ENTIRE codebase for any code that might call `signOut()` automatically:
   - useEffect hooks that might trigger on session change
   - Middleware or route guards
   - Any auth state management
   - Component mount/unmount cycles
2. Check if HeaderWrapper is being rendered multiple times
3. Look for any redirect logic in auth.ts callbacks that might cause loops

### Task 3: Create Clean Implementation
1. Create a SINGLE, clean implementation of HeaderWrapper with:
   - One sign-out button
   - One sign-in button (when not authenticated)
   - User name display when authenticated
   - No duplicate code
2. Use the simplest possible signOut approach that works with NextAuth JWT
3. Ensure no useEffects or side effects that could trigger automatic sign-out

### Task 4: Security & Best Practices
1. Review auth.ts configuration for security issues
2. Ensure NEXTAUTH_SECRET is properly configured
3. Verify JWT token expiration is reasonable
4. Check that cookies are httpOnly and secure in production
5. Add CSRF protection if missing

### Task 5: Testing Strategy
After implementing fix:
1. Test in fresh incognito window
2. Sign in with Google
3. Verify name appears
4. Refresh page - verify session persists
5. Click sign out - verify it works
6. Sign in again - verify no loop

## Debug Commands to Run

```bash
# Check actual file size
wc -l src/components/HeaderWrapper.tsx

# Show last 50 lines to see duplicate
tail -50 src/components/HeaderWrapper.tsx

# Search for ALL signOut occurrences
grep -rn "signOut" src/ --include="*.tsx" --include="*.ts"

# Check for useEffect hooks
grep -rn "useEffect" src/components/ --include="*.tsx"

# Look for any auth-related useEffects
grep -A 10 "useEffect" src/components/HeaderWrapper.tsx

# Check if file has unusual encoding
file src/components/HeaderWrapper.tsx
```

## Expected Output

Please provide:
1. **Root cause analysis** - What exactly is causing the sign-out loop?
2. **File cleanup** - Remove any duplicate code from HeaderWrapper.tsx
3. **Working implementation** - Complete, clean HeaderWrapper.tsx code
4. **Testing confirmation** - Steps showing sign-in and sign-out both work
5. **Additional fixes** - Any other auth or security issues you found

## Project Context

This is a dog-friendly places directory app with:
- User authentication (Google OAuth + email/password)
- City/place browsing
- User reviews and ratings
- Admin dashboard
- Public and protected routes

The authentication is critical as users need to:
- Submit new places
- Write reviews
- Save favorites
- Access admin features (if admin role)

## IMPORTANT NOTES

1. **DO NOT break existing functionality** - The app works except for auth loop
2. **DO NOT overcomplicate** - The simplest solution is usually best
3. **DO test thoroughly** - This bug has been persistent through 20+ attempts
4. **DO provide complete code** - No snippets with "...existing code..." comments
5. **DO explain your reasoning** - Help us understand why this fix will work

## Success Criteria

✅ User can sign in with Google without automatic sign-out loop
✅ User's name displays in blue badge when logged in  
✅ User can click "Sign out" and be logged out successfully
✅ After sign-out, "Sign in" button appears again
✅ No duplicate code in HeaderWrapper.tsx
✅ File size is reasonable (~160-170 lines, not 192)
✅ All authentication flows work in both regular and incognito browsers

---

**Thank you for helping us solve this critical issue!** This bug has been extremely frustrating and we're hoping your fresh perspective will identify what we've been missing.
