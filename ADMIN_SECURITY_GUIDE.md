# Admin Dashboard & Security Setup

## 🎉 What's Been Added

### 1. **Analytics Tracking** ✅
- **Vercel Analytics** integrated in your app
- Tracks page views, traffic sources, user behavior
- View analytics at: https://vercel.com/tavinskys-projects/dog-atlas/analytics

### 2. **Admin Dashboard** ✅
- Located at: `/admin/dashboard`
- Shows statistics:
  - Total users, places, cities
  - Total reviews and favorites
  - Recent user signups
  - Recent reviews
- **Protected route**: Only ADMIN users can access

### 3. **Security Measures** ✅
- **Rate Limiting**: Prevents API abuse (100 req/min per IP)
- **Security Headers**:
  - `X-Content-Type-Options`: Prevents MIME sniffing
  - `X-Frame-Options`: Prevents clickjacking
  - `X-XSS-Protection`: XSS attack protection
  - `Strict-Transport-Security`: Forces HTTPS
  - `Referrer-Policy`: Controls referrer information
  - `Permissions-Policy`: Restricts browser features
- **Role-Based Access Control (RBAC)**: Three roles
  - `USER`: Regular users
  - `EDITOR`: Can edit content (future use)
  - `ADMIN`: Full access to admin dashboard

### 4. **Admin Tools** ✅
- Script to promote users to admin: `scripts/make_admin.ts`
- Auth utilities for protecting routes: `src/lib/auth-utils.ts`
- Rate limiting utilities: `src/lib/rate-limit.ts`

---

## 🚀 How to Use

### Step 1: Sign In & Create Your Account
1. Start your dev server: `npm run dev`
2. Go to: http://localhost:3000
3. Click "Sign In" and use **Google Sign In**
4. This creates your user account with role `USER`

### Step 2: Make Yourself an Admin
Once you've signed in, promote your account to ADMIN:

```bash
# Replace with your email
npx tsx scripts/make_admin.ts your-email@example.com
```

Example:
```bash
npx tsx scripts/make_admin.ts john@gmail.com
```

Output:
```
🔍 Looking for user: john@gmail.com
📝 Current role: USER
👑 Promoting to ADMIN...
✅ SUCCESS! john@gmail.com is now an ADMIN
```

### Step 3: Access Admin Dashboard
1. Go to: http://localhost:3000/admin/dashboard
2. You'll see:
   - **Statistics**: Users, places, cities, reviews, favorites
   - **Analytics Link**: Direct link to Vercel Analytics
   - **Recent Activity**: Latest users and reviews
   - **Security Status**: Current security measures

---

## 📊 Viewing Analytics

### Vercel Analytics (Production)
Once deployed to Vercel:
1. Go to https://vercel.com/tavinskys-projects/dog-atlas/analytics
2. View:
   - **Page Views**: Track which pages get most traffic
   - **Top Referrers**: See where users come from
   - **Devices**: Desktop vs mobile traffic
   - **Countries**: Geographic distribution
   - **Performance**: Page load times

### Local Development
Analytics only tracks production traffic. For local testing, use the admin dashboard statistics.

---

## 🔒 Security Features Explained

### Rate Limiting
```typescript
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

// In your API route
const ip = getClientIp(request.headers);
if (isRateLimited(ip)) {
  return new Response("Too many requests", { status: 429 });
}
```

**Default limits**: 100 requests per minute per IP address

### Protected Routes
```typescript
import { requireAdmin, requireAuth } from "@/lib/auth-utils";

// Require any authenticated user
export default async function MyPage() {
  const user = await requireAuth();
  // ... your page
}

// Require admin user
export default async function AdminPage() {
  const admin = await requireAdmin();
  // ... admin page
}
```

### Security Headers
All headers are automatically applied via `next.config.js`:
- **HTTPS Only**: Forces secure connections
- **XSS Protection**: Blocks malicious scripts
- **Clickjacking Prevention**: Prevents iframe embedding
- **MIME Sniffing Protection**: Enforces content types

---

## 🛡️ Protection Against Common Attacks

| Attack Type | Protection | How It Works |
|-------------|-----------|--------------|
| **DDoS / Brute Force** | Rate Limiting | Max 100 req/min per IP |
| **XSS (Cross-Site Scripting)** | Security Headers + React | Headers + React auto-escaping |
| **Clickjacking** | X-Frame-Options | Prevents iframe embedding |
| **CSRF** | NextAuth.js | Built-in CSRF tokens |
| **SQL Injection** | Prisma ORM | Parameterized queries |
| **Man-in-the-Middle** | HSTS Header | Forces HTTPS |
| **Unauthorized Access** | RBAC + Middleware | Role checking |

---

## 📝 Managing Users

### List All Users
```bash
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany().then(users => {
  console.log(users);
  p.\$disconnect();
});
"
```

### Make User an Admin
```bash
npx tsx scripts/make_admin.ts user@example.com
```

### Change User Role (Advanced)
```bash
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.update({
  where: { email: 'user@example.com' },
  data: { role: 'EDITOR' }
}).then(() => {
  console.log('Role updated!');
  p.\$disconnect();
});
"
```

---

## 🚨 Monitoring & Alerts

### What to Monitor
1. **Failed Login Attempts**: Check for brute force attacks
2. **Rate Limit Violations**: Unusual traffic patterns
3. **Admin Access**: Who's accessing admin dashboard
4. **Error Rates**: Sudden spikes in errors

### Vercel Integration (Recommended)
- Enable Vercel monitoring for automatic alerts
- Set up Slack/email notifications
- Track deployment health

---

## 🔐 Best Practices

1. **Never commit secrets**: Use environment variables
2. **Keep dependencies updated**: Run `npm audit` regularly
3. **Use strong passwords**: For credential-based auth
4. **Enable 2FA**: On your Vercel account
5. **Review admin users**: Regularly audit who has admin access
6. **Monitor analytics**: Check for suspicious patterns
7. **Backup database**: Regular PostgreSQL backups on Vercel

---

## 📦 Deployment Checklist

Before deploying to production:

- [ ] Update Google OAuth redirect URIs with production URL
- [ ] Verify all environment variables set in Vercel
- [ ] Make at least one user an ADMIN
- [ ] Test admin dashboard access
- [ ] Verify Vercel Analytics is working
- [ ] Check all security headers are applied
- [ ] Test rate limiting with high traffic
- [ ] Set up monitoring/alerts in Vercel

---

## 🆘 Troubleshooting

### "Access Denied" on Admin Dashboard
1. Check you're signed in
2. Verify your role: Run `npx tsx scripts/make_admin.ts your-email@example.com`
3. Clear browser cache and cookies
4. Sign out and sign in again

### Analytics Not Showing Data
- Analytics only work in production (Vercel)
- Wait 24 hours for initial data
- Verify `<Analytics />` is in layout.tsx

### Rate Limiting Too Strict
Edit `src/lib/rate-limit.ts`:
```typescript
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 200, // Increase limit
  windowSeconds: 60,
};
```

---

## 📚 Additional Resources

- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [OWASP Security Guide](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/pages/building-your-application/configuring/security)

---

## 🎯 Next Steps

1. **Deploy to production**: `git push` (auto-deploys to Vercel)
2. **Sign in with Google** on production site
3. **Make yourself admin** using the script with production DB
4. **Access admin dashboard**: https://dog-atlas.vercel.app/admin/dashboard
5. **View analytics**: Check Vercel dashboard after 24 hours

Enjoy your secure, monitored DogAtlas! 🐕🎉
