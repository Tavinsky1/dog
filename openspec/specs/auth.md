# Authentication Specification

## Overview
Authentication is handled by NextAuth.js using JWT strategy.
We support:
- Google OAuth
- Email/Password (Credentials)

## Critical Configuration
**Production Domain Handling:**
To ensure authentication works seamlessly across `dog-atlas.com` and `www.dog-atlas.com`, we **MUST** explicitly configure the cookie domain.

### Cookie Configuration
In `src/lib/auth.ts`, the `cookies` option must be set when `VERCEL_ENV === 'production'`:

```typescript
cookies: process.env.VERCEL_ENV === 'production' ? {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true,
      domain: '.dog-atlas.com' // <--- CRITICAL: Allows sharing between www and root
    }
  }
} : undefined,
```

### Environment Variables
- `NEXTAUTH_URL`: Must be set to `https://www.dog-atlas.com` in production.
- `NEXTAUTH_SECRET`: Must be set.

### Middleware
Middleware should enforce the correct `NEXTAUTH_URL` to prevent Vercel preview URLs from breaking auth callbacks.

```typescript
if (process.env.VERCEL_ENV === 'production') {
  process.env.NEXTAUTH_URL = 'https://www.dog-atlas.com'
}
```

## History
- **Dec 5, 2025**: Fixed auth by restoring the explicit cookie configuration.
