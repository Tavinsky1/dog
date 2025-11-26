# Files to Share with External AI for Login/Logout Debugging

## How to Use This

When sharing with external AI:
1. Include this file
2. Share the files listed below
3. Provide the prompt below
4. Ask them to analyze and suggest fixes

---

## Quick Share Prompt (Copy-Paste Ready)

### For ChatGPT, Claude, or other LLMs:

```
I'm working on a Next.js 15 application with NextAuth.js v4 authentication system that supports both Google OAuth and email/username credentials login.

CURRENT STATUS:
- Framework: Next.js 15.5.4 (App Router)
- Auth: NextAuth.js v4 with JWT session strategy
- Providers: Google OAuth + Credentials Provider
- Database: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- Port: localhost:3000
- Server Status: ✅ Running without errors

SPECIFIC ISSUE(S) TO DEBUG:
[FILL IN YOUR SPECIFIC PROBLEM - e.g.:
- "Login redirects to /login?error=... after credentials submission"
- "Sign-out button doesn't clear the session"
- "Google OAuth doesn't create user in database"
- "Login works but session doesn't persist on page reload"
- etc.
]

ARCHITECTURAL DETAILS:
- Using JWT tokens (stored in HTTP-only cookies)
- Email normalization: lowercase + trim on both signup and login
- Session max age: 30 days
- User lookup: First by email, then by username
- OAuth user creation: Automatic via signIn callback

FILES PROVIDED:
1. src/lib/auth.ts - Complete NextAuth configuration
2. src/app/login/page.tsx - Login page UI and form handling
3. src/components/HeaderWrapper.tsx - Header with sign-out button
4. src/app/layout.tsx - Root layout
5. src/components/Providers.tsx - Provider setup
6. prisma/schema.prisma - Database schema
7. next.config.js - Configuration including CSP headers
8. .env.local excerpt - Environment variable setup

QUESTIONS FOR THE AI:
1. Are there any obvious issues in the JWT callback that would prevent session persistence?
2. Is the redirect callback correctly handling the authentication flow?
3. Are there any race conditions or timing issues in the sign-out flow?
4. Is the credentials authorization logic correctly validating users?
5. What are the most common causes of this specific issue?
6. Are there any missing error handlers?

WHAT I'VE ALREADY TRIED:
- ✅ Added `token.sub = user.id` in JWT callback
- ✅ Added dynamic redirect callback
- ✅ Fixed CSP headers (added unsafe-eval for dev)
- ✅ Normalized email to lowercase + trim
- ✅ Server running without compilation errors
```

---

## Minimal File List (Absolute Minimum)

Share THESE 5 files:
```
1. src/lib/auth.ts
2. src/app/login/page.tsx  
3. src/components/HeaderWrapper.tsx
4. prisma/schema.prisma
5. next.config.js
```

---

## Complete File List (For Thorough Analysis)

Share ALL of these:
```
1. src/lib/auth.ts
2. src/app/login/page.tsx
3. src/app/signup/page.tsx (if it exists - for email normalization comparison)
4. src/components/HeaderWrapper.tsx
5. src/components/Providers.tsx
6. src/app/layout.tsx
7. prisma/schema.prisma
8. next.config.js
9. .env.local (password/secret redacted)
10. src/lib/prisma.ts (if it exists)
11. src/app/api/auth/[...nextauth]/route.ts (if it exists)
```

---

## What to Tell Them About Your System

**Copy-Paste this context:**

```
CURRENT AUTHENTICATION ARCHITECTURE:

Session Strategy: JWT (required for credentials + OAuth combination)

Flow:
1. User logs in with email/username + password
2. Credentials callback validates against Prisma database
3. JWT created with token.sub, token.id, token.email, token.name, token.role
4. Token stored in __Secure-next-auth.session-token (HTTP-only cookie)
5. On each request, session callback reconstructs session.user from token

Critical Details:
- Email normalization: .toLowerCase().trim() applied on both paths
- User lookup: First by email, then by name (username)
- Password hashing: bcryptjs
- Token.sub MUST be set for session to persist
- Redirect callback handles port mismatches (localhost:3000 <-> localhost:3002)
- CSP headers allow unsafe-eval in development

Potential Issues:
- Two different signOut implementations in HeaderWrapper (lines 230 and 327)
- File appears to have duplicate code/definitions
- May have conflicting session management logic
```

---

## Session Flow Diagram

```
LOGIN FLOW:
┌─────────────────────────────────────────────────────────────────┐
│ 1. User submits credentials in /login form                      │
├─────────────────────────────────────────────────────────────────┤
│ 2. signIn("credentials", { email, password, redirect: true })   │
├─────────────────────────────────────────────────────────────────┤
│ 3. authorize() callback finds user in DB, compares password     │
├─────────────────────────────────────────────────────────────────┤
│ 4. jwt() callback creates token with token.sub = user.id ⭐     │
├─────────────────────────────────────────────────────────────────┤
│ 5. Token stored in HTTP-only cookie                             │
├─────────────────────────────────────────────────────────────────┤
│ 6. redirect() callback determines where to send user            │
├─────────────────────────────────────────────────────────────────┤
│ 7. Page redirects to "/" (or specified callbackUrl)             │
├─────────────────────────────────────────────────────────────────┤
│ 8. session() callback reconstructs session.user from token      │
├─────────────────────────────────────────────────────────────────┤
│ 9. User visible in HeaderWrapper, logged in! ✅                 │
└─────────────────────────────────────────────────────────────────┘

LOGOUT FLOW:
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks sign-out button                                  │
├─────────────────────────────────────────────────────────────────┤
│ 2. signOut({ callbackUrl: "/" }) called                         │
├─────────────────────────────────────────────────────────────────┤
│ 3. NextAuth clears HTTP-only cookie                             │
├─────────────────────────────────────────────────────────────────┤
│ 4. Page redirects to "/"                                        │
├─────────────────────────────────────────────────────────────────┤
│ 5. session() callback returns null (no token)                   │
├─────────────────────────────────────────────────────────────────┤
│ 6. HeaderWrapper detects session === null                       │
├─────────────────────────────────────────────────────────────────┤
│ 7. Shows Sign In button instead of user profile ✅              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Expected Behavior Checklist

After login should show:
- [ ] User's profile image (if provided)
- [ ] User's name
- [ ] Sign out button
- [ ] Admin link (if role === "ADMIN")
- [ ] Dashboard link

After sign-out should show:
- [ ] Sign In button
- [ ] Sign Up button
- [ ] No user information visible
- [ ] Back at home page

---

## Testing Steps to Include

Tell the external AI to test these scenarios:

1. **Credentials Login:**
   - Go to /login
   - Enter valid email and password
   - Click "Sign in"
   - Expected: Redirect to home, user visible

2. **Invalid Credentials:**
   - Go to /login
   - Enter wrong password
   - Click "Sign in"
   - Expected: Stay on /login with error message

3. **Google OAuth:**
   - Click "Sign in with Google"
   - Complete Google flow
   - Expected: Redirect to home, user visible, user created in DB

4. **Session Persistence:**
   - Login
   - Refresh page
   - Expected: User still logged in

5. **Sign-out:**
   - Login
   - Click sign-out button
   - Expected: Redirect to home, user info gone

---

## Red Flags to Ask About

If they find these, ask them to investigate:
- [ ] Duplicate code in HeaderWrapper.tsx
- [ ] Conflicting signOut implementations
- [ ] Missing error handling in callbacks
- [ ] Race conditions in async operations
- [ ] Type safety issues with token properties
- [ ] Prisma query errors
- [ ] Environment variable issues
- [ ] CSP or CORS issues

---

## Follow-up Questions to Ask Them

1. "Which specific step in the flow is failing?"
2. "What error messages are in the browser console?"
3. "What does the Network tab show for failed requests?"
4. "Is the JWT token being created correctly?"
5. "Can you identify the duplicate code in HeaderWrapper?"
6. "Are there any race conditions we should be concerned about?"
7. "What's the best way to fix this without breaking other flows?"
8. "Are there security implications of this issue?"

