# Critical Authentication Configuration

> **WARNING: DO NOT MODIFY THIS CONFIGURATION**
> This specific setup is the ONLY proven configuration that ensures stable authentication (Sign In/Sign Out) on production (`www.dog-atlas.com`) while supporting Google OAuth and Credentials.

## The "Golden" Configuration (Restored from Oct 28, 2025)

After extensive testing and multiple failed attempts with "advanced" cookie configurations, we have confirmed that the **simplest** configuration is the correct one.

### 1. `src/lib/auth.ts`
**Rule:** Do NOT manually configure `cookies`. Let NextAuth handle it automatically.
**Rule:** Do NOT set `domain` attributes manually.
**Rule:** Use `strategy: "jwt"`.

```typescript
export const authOptions: NextAuthOptions = {
  // ... providers ...
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // NO manual cookie configuration here!
  // NO manual domain setting!
  
  callbacks: {
    // ... standard callbacks ...
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};
```

### 2. Environment Variables
**Rule:** `NEXTAUTH_URL` MUST be set to the canonical URL in production.

- **Production (Vercel):** `NEXTAUTH_URL=https://www.dog-atlas.com`
- **Development:** `NEXTAUTH_URL=http://localhost:3004`

### 3. Why This Works
- **Cookie Scope:** By default, NextAuth sets `__Host-` prefixed cookies (secure, host-only) when on HTTPS. These are strictly scoped to the domain (e.g., `www.dog-atlas.com`).
- **No Conflicts:** Manually setting `domain: '.dog-atlas.com'` creates "sticky" cookies that conflict with the `__Host-` cookies, leading to sign-out loops and CSRF mismatches.
- **Google OAuth:** Google's OAuth flow works perfectly with the default Host-only cookies.

## Troubleshooting
If auth breaks again:
1. **Check `src/lib/auth.ts`:** Ensure no `cookies: { ... }` block exists.
2. **Check Vercel Env:** Ensure `NEXTAUTH_URL` is `https://www.dog-atlas.com`.
3. **Clear Cookies:** Users must clear cookies if they have "bad" domain-scoped cookies from previous broken builds.

## Forbidden Changes
- ❌ DO NOT add `cookies` configuration to `authOptions`.
- ❌ DO NOT try to share sessions between `dog-atlas.com` and `www.dog-atlas.com` (it causes instability).
- ❌ DO NOT change `session.strategy` from `"jwt"`.
