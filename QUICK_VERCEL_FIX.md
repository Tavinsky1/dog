# Quick Fix for Vercel Deployment

## The Problem
❌ Vercel build fails with: **"Environment variable not found: DATABASE_URL"**
❌ SQLite (`file:./dev.db`) doesn't work on Vercel (serverless environment)

## The Solution (Choose One)

### Option 1: Quick Deploy with Vercel Postgres (Recommended) ⚡

**Step 1: Create Vercel Postgres Database**
1. Go to your Vercel project dashboard
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Name it (e.g., `dog-atlas-db`)
6. Click **"Create"**
7. ✅ Vercel automatically adds `POSTGRES_PRISMA_URL` to your environment variables

**Step 2: Add Other Environment Variables**
Go to Project Settings → Environment Variables and add:

```
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = [generate with: openssl rand -base64 32]
GOOGLE_CLIENT_ID = [your Google OAuth client ID]
GOOGLE_CLIENT_SECRET = [your Google OAuth client secret]
```

**Step 3: Deploy**
Vercel will auto-deploy. After successful build:

```bash
# Connect to your database and create tables
npx prisma db push

# (Optional) Seed your database
npx prisma db seed
```

---

### Option 2: Use Neon (Free PostgreSQL) 🆓

**Step 1: Create Neon Database**
1. Go to https://neon.tech
2. Sign up (free tier available)
3. Create new project
4. Copy connection string (looks like: `postgresql://user:pass@host.neon.tech/dbname`)

**Step 2: Add to Vercel**
Go to Project Settings → Environment Variables:

```
DATABASE_URL = postgresql://... [from Neon]
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = [generate with: openssl rand -base64 32]
GOOGLE_CLIENT_ID = [your Google OAuth client ID]
GOOGLE_CLIENT_SECRET = [your Google OAuth client secret]
```

**Step 3: Deploy & Migrate**
```bash
npx prisma db push
```

---

### Option 3: Use Supabase (Free PostgreSQL) 🟢

**Step 1: Create Supabase Project**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy **Connection string** (Transaction mode)

**Step 2: Add to Vercel**
Same as Option 2 - add environment variables to Vercel

**Step 3: Deploy & Migrate**
```bash
npx prisma db push
```

---

## Environment Variables Checklist

Add these to Vercel (Project Settings → Environment Variables):

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Your deployed URL (e.g., https://your-app.vercel.app)
- [ ] `NEXTAUTH_SECRET` - Run `openssl rand -base64 32` to generate
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

---

## Generate NEXTAUTH_SECRET

Run this locally:
```bash
openssl rand -base64 32
```

Copy the output and add it to Vercel.

---

## Update Google OAuth

⚠️ **IMPORTANT:** Add your Vercel URL to Google OAuth redirect URIs:

1. Go to https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Add **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   https://your-preview-url.vercel.app/api/auth/callback/google
   ```

---

## Deploy & Test

1. **Redeploy on Vercel** (will auto-deploy after environment variables are set)
2. **Check build logs** - should succeed now
3. **Run migrations**:
   ```bash
   npx prisma db push
   ```
4. **Test the app** - visit your deployed URL
5. **(Optional) Seed data**:
   ```bash
   npx prisma db seed
   ```

---

## Troubleshooting

### Build still fails with DATABASE_URL error
✅ Make sure you added `DATABASE_URL` to **Production** environment (not just Development)

### "Invalid datasource provider: sqlite"
✅ Already fixed! Your schema now uses `postgresql`

### Database tables don't exist
✅ Run: `npx prisma db push`

### Google Sign-In doesn't work
✅ Update Google OAuth redirect URIs with your Vercel URL

### Can't connect to database
✅ Check connection string format
✅ Make sure SSL mode is included: `?sslmode=require`

---

## Next Steps After Successful Deployment

1. ✅ Test Google Sign-In
2. ✅ Import your places data (if needed)
3. ✅ Set up custom domain (optional)
4. ✅ Monitor Vercel Analytics
5. ✅ Set up database backups

---

**Need more help?** See full guide: `VERCEL_DEPLOYMENT_GUIDE.md`
