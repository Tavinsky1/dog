# Vercel Deployment Guide

## Current Issue
❌ **SQLite database won't work on Vercel** (serverless environment doesn't support file-based databases)

## Solution: Use PostgreSQL

### Step 1: Create a PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**
1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a name (e.g., `dog-atlas-db`)
6. Click "Create"
7. Vercel will automatically add `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc. to your environment variables

**Option B: Neon (Free Alternative)**
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@host/db`)
4. You'll use this as `DATABASE_URL`

**Option C: Supabase (Free Alternative)**
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (Transaction mode)
5. You'll use this as `DATABASE_URL`

---

## Step 2: Update Prisma Schema

Your `prisma/schema.prisma` needs to support PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

---

## Step 3: Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

### Required Variables:

```bash
# Database (from Vercel Postgres, Neon, or Supabase)
DATABASE_URL="postgresql://..."

# NextAuth (CRITICAL - generate a secure secret!)
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secure-random-string-here"

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Places API (optional - for images/coordinates)
GOOGLE_PLACES_API_KEY="your-google-places-api-key"
```

### Generate NEXTAUTH_SECRET:
```bash
# Run this locally to generate a secure secret:
openssl rand -base64 32
```

---

## Step 4: Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID
3. Add these **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   https://your-preview-url.vercel.app/api/auth/callback/google
   ```

---

## Step 5: Migrate Database Schema

After setting up PostgreSQL, run migrations:

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Push schema to your new database
npx prisma db push

# (Optional) Seed your production database
npx prisma db seed
```

---

## Step 6: Add Build Configuration (Optional)

Create/update `vercel.json`:

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_URL": "@nextauth_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "GOOGLE_CLIENT_ID": "@google_client_id",
    "GOOGLE_CLIENT_SECRET": "@google_client_secret"
  }
}
```

---

## Step 7: Deploy

### Quick Fix (Keep SQLite for now - NOT RECOMMENDED):
If you want to deploy immediately with SQLite (will have issues):

1. Add to Vercel environment variables:
   ```
   DATABASE_URL="file:./dev.db"
   ```
2. Add all other env vars above
3. Redeploy

⚠️ **WARNING**: This won't work properly because Vercel is serverless and can't persist SQLite files between requests.

### Proper Solution (PostgreSQL):

1. Switch to PostgreSQL (see Step 1)
2. Update `prisma/schema.prisma` (see Step 2)
3. Add all environment variables to Vercel (see Step 3)
4. Update Google OAuth URIs (see Step 4)
5. Push schema to PostgreSQL (see Step 5)
6. Git commit and push:
   ```bash
   git add prisma/schema.prisma
   git commit -m "feat: switch to PostgreSQL for Vercel deployment"
   git push origin 001-implementation-planning
   ```
7. Vercel will auto-deploy

---

## Quick Checklist

- [ ] Create PostgreSQL database (Vercel Postgres/Neon/Supabase)
- [ ] Update `prisma/schema.prisma` to use `postgresql`
- [ ] Add `DATABASE_URL` to Vercel (PostgreSQL connection string)
- [ ] Add `NEXTAUTH_URL` to Vercel (your deployed URL)
- [ ] Generate and add `NEXTAUTH_SECRET` to Vercel
- [ ] Add `GOOGLE_CLIENT_ID` to Vercel
- [ ] Add `GOOGLE_CLIENT_SECRET` to Vercel
- [ ] Add `GOOGLE_PLACES_API_KEY` to Vercel (optional)
- [ ] Update Google OAuth redirect URIs
- [ ] Run `npx prisma db push` to create tables
- [ ] (Optional) Seed production database
- [ ] Commit and push changes
- [ ] Verify deployment successful

---

## Troubleshooting

### Build fails with "Environment variable not found: DATABASE_URL"
✅ Add `DATABASE_URL` to Vercel environment variables

### "Invalid datasource provider"
✅ Change `prisma/schema.prisma` provider to `postgresql`

### "Can't reach database server"
✅ Check your PostgreSQL connection string is correct
✅ Make sure database allows connections from Vercel IPs

### Google Sign-In doesn't work
✅ Update authorized redirect URIs in Google Cloud Console
✅ Verify `NEXTAUTH_URL` matches your deployed URL

### Database is empty after deployment
✅ Run `npx prisma db push` after setting up PostgreSQL
✅ (Optional) Run `npx prisma db seed` to populate data

---

## Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Add your domain in Vercel → Domains
   - Update `NEXTAUTH_URL` to use custom domain
   - Update Google OAuth redirect URIs

2. **Production Data**
   - Import your places data to PostgreSQL
   - Run seed scripts if needed

3. **Monitoring**
   - Check Vercel Analytics
   - Monitor database usage
   - Set up error tracking (Sentry, etc.)

---

**Need Help?**
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
