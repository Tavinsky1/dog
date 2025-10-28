# Authentication System - Fixes and Learnings

## Sign-Out Issue - RESOLVED ✅

### The Problem
Sign-out button was calling the API successfully (`POST /api/auth/signout 200`) but then entering an infinite loop, calling sign-out repeatedly.

### Root Cause
The sign-out button handler was using `e.preventDefault()` which blocked NextAuth's redirect mechanism:

```typescript
// WRONG - This caused the loop
onClick={async (e) => {
  e.preventDefault();  // ❌ This blocks the redirect!
  e.stopPropagation();
  await signOut({ redirect: true, callbackUrl: '/' });
}}
```

When `preventDefault()` blocks the redirect, the component stays mounted, NextAuth re-renders, and triggers sign-out again → infinite loop.

### The Fix
Remove `preventDefault()` and let NextAuth handle the redirect naturally:

```typescript
// CORRECT - Simple and works
onClick={() => signOut({ callbackUrl: '/' })}
```

### Key Learnings
1. **Never use `e.preventDefault()` with NextAuth redirects** - It blocks the navigation
2. **Keep sign-out simple** - Just call `signOut({ callbackUrl: '/' })`
3. **Let NextAuth handle the flow** - Don't try to manually manage redirects
4. **Sign-out doesn't need async/await** - NextAuth handles it internally

### Files Changed
- `src/components/HeaderWrapper.tsx` - Simplified sign-out button handler

---

## NextAuth Configuration - Critical Rules

### What Works
```typescript
export const authOptions: NextAuthOptions = {
  providers: [GoogleProvider, CredentialsProvider],
  session: { strategy: "jwt" },  // Simple JWT strategy
  callbacks: { jwt, session, signIn },
  pages: { signIn: "/login" }
};
```

### What DOESN'T Work
1. ❌ **PrismaAdapter with CredentialsProvider + JWT** - Fundamentally incompatible
2. ❌ **Custom cookie configuration** - Breaks session persistence
3. ❌ **Debug mode in development** - Causes warnings and issues
4. ❌ **Using `database` strategy with CredentialsProvider** - Won't create sessions

### The Golden Rule
**For CredentialsProvider: Use JWT strategy WITHOUT PrismaAdapter**
- Google OAuth can still create users in DB via `signIn` callback
- Sessions stored in JWT tokens (cookies)
- No database session table needed

---

## Current Status

### Working ✅
- **Google OAuth** - Sign in, creates user in database, session persists
- **Sign-out** - Clears session, redirects to home page
- **Username/Email login** - Accepts both email and username

### Not Working ❌
- **Credentials login session** - Login succeeds but session cookie not persisting

### Next Steps
1. Fix credentials login session persistence
2. Test end-to-end authentication flow
3. Deploy to production

---

## Environment Configuration

### Development (.env.local)
```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

### Production (Vercel)
```bash
NEXTAUTH_URL="https://dog-atlas.com"
NEXTAUTH_SECRET="your-secret-here"
```

**CRITICAL:** NEXTAUTH_URL must match the actual URL you're using, or sessions won't work!
