# Deployment Guide — Vercel Preview / Production / Rollback

This guide covers the complete deployment workflow for DogAtlas using Vercel, from feature development to production deployment and emergency rollback procedures.

## Quick Reference

| Action | Command | When |
|--------|---------|------|
| Preview | `git push origin feat/my-feature` | After committing changes to feature branch |
| Production | Merge PR to `main` | After review and testing |
| Rollback | `npm run vercel:rollback` | When production has issues |
| Manual Deploy | `npm run vercel:prod` | Rare - usually automatic |

## Prerequisites

1. **Vercel CLI** installed: `npm install -g vercel`
2. **Authenticated**: `vercel login`
3. **Linked project**: `vercel link` (first time only)
4. **Environment variables** synced: `vercel env pull .env.local`

## Branching Strategy

### Never Commit Directly to `main`

The `main` branch is protected and represents production. All changes must go through the PR workflow:

```
main (production)
  ↓
feat/my-feature (development)
  ↓
pull request → preview deployment → review → merge → production
```

### Branch Naming Convention

- Features: `feat/global-navigation`
- Bug fixes: `fix/search-typeahead`
- Documentation: `docs/deployment-guide`
- Database: `db/add-country-field`

## Workflow Step-by-Step

### 1. Create Feature Branch

```bash
# Start from latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/my-feature

# Make changes...
git add .
git commit -m "Add my feature"
```

### 2. Push and Create Preview Deployment

```bash
# Push to remote
git push origin feat/my-feature
```

**Vercel automatically**:
- Detects the push
- Builds the project
- Creates a preview deployment
- Posts URL to GitHub (if PR exists)

**Preview URL format**: `https://dog-atlas-{hash}-tavinskys-projects.vercel.app`

### 3. Open Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Fill in:
   - **Title**: Clear description of change
   - **Description**: What changed and why
   - **Checklist**: Mark completed items from template
4. Add **preview URL** from Vercel to PR description
5. Request review (if applicable)

### 4. Review Preview Deployment

Before merging, thoroughly test the preview:

**Functional Testing:**
- [ ] All links work
- [ ] Forms submit correctly
- [ ] Search returns results
- [ ] Images load
- [ ] No console errors

**Visual Testing:**
- [ ] Layout correct on mobile
- [ ] Layout correct on desktop
- [ ] Colors match design system
- [ ] Animations work smoothly

**Performance Testing:**
- [ ] Lighthouse score > 90
- [ ] Page load < 2s on 3G
- [ ] No layout shifts (CLS < 0.1)

**Database Testing:**
- [ ] Data loads correctly
- [ ] Queries performant
- [ ] No N+1 query issues

### 5. Merge to Production

Once preview is approved:

```bash
# Via GitHub UI: click "Merge pull request"
# Or via command line:
git checkout main
git pull origin main
git merge --no-ff feat/my-feature
git push origin main
```

**Vercel automatically**:
- Detects merge to `main`
- Builds production deployment
- Updates live site at dog-atlas.com
- Keeps previous deployment for rollback

**Production deployment takes**: 2-5 minutes

### 6. Verify Production

After merge, verify production deployment:

```bash
# Check deployment status
vercel ls

# Visit production site
open https://dog-atlas.com
```

**Production checklist:**
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Database queries work
- [ ] Images display correctly
- [ ] Search functional
- [ ] No breaking changes

## Rollback Procedures

### When to Rollback

Rollback immediately if:
- Site is down (500 errors)
- Critical feature broken (search, navigation)
- Database queries failing
- Severe performance degradation
- Security vulnerability introduced

**Don't rollback** for minor issues that can be fixed forward.

### Quick Rollback (< 1 minute)

```bash
# Interactive mode - shows recent deployments
npm run vercel:rollback

# Follow prompts to select previous deployment
# Confirms before executing
```

### Manual Rollback

```bash
# List recent deployments
vercel ls

# Find the last working deployment
# Look for "Production" + "Ready" status

# Rollback to specific deployment
vercel rollback https://dog-atlas-abc123.vercel.app
```

### Rollback via Vercel Dashboard

1. Visit https://vercel.com/tavinskys-projects/dog-atlas
2. Go to "Deployments" tab
3. Find last working deployment
4. Click "..." menu → "Promote to Production"

**Rollback is instant**: Traffic switches in < 30 seconds.

### After Rollback: Fix Forward

Rollback is temporary. Fix the issue properly:

```bash
# Create hotfix branch
git checkout -b fix/broken-feature

# Fix the issue
# ...

# Test locally
npm run dev

# Push and create PR
git push origin fix/broken-feature

# Follow preview → production workflow again
```

## Git Revert (Alternative to Rollback)

If you want to revert code changes permanently:

```bash
# Find the bad commit
git log --oneline

# Revert it (creates new commit)
git revert <commit-sha>

# Push revert
git push origin main

# Vercel auto-deploys the revert
```

**Difference**:
- **Rollback**: Instant, doesn't change git history
- **Revert**: Permanent, adds revert commit to history

Use **rollback** for emergencies, **revert** for permanent fixes.

## Environment Variables

### Viewing Environment Variables

```bash
# Pull from Vercel
vercel env pull .env.local

# View in dashboard
# https://vercel.com/tavinskys-projects/dog-atlas/settings/environment-variables
```

### Adding Environment Variables

```bash
# Via CLI
vercel env add NEXT_PUBLIC_FEATURE_FLAG

# Enter value when prompted
# Select environment: production, preview, development
```

### Environment Scopes

- **Production**: Live site only
- **Preview**: All preview deployments
- **Development**: `vercel dev` locally

**Important**: Use `NEXT_PUBLIC_` prefix for client-side variables.

### Common Environment Variables

```bash
# Database
DATABASE_URL="postgres://..." # Production PostgreSQL

# Feature Flags
NEXT_PUBLIC_ENABLE_MAP_VIEW="true"
NEXT_PUBLIC_ENABLE_MAPBOX="false"

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://dog-atlas.com"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Manual Deployment (Rare)

Usually, deployments are automatic via git push. Manual deployment is rarely needed.

### Build and Deploy

```bash
# Build locally
npm run build

# Deploy to preview
npm run vercel:preview

# Deploy to production (be careful!)
npm run vercel:prod
```

### When to Use Manual Deployment

- Testing Vercel configuration changes
- Debugging deployment issues
- Emergency hotfix (faster than git)

**Warning**: Manual deployments bypass PR review. Use sparingly.

## Troubleshooting

### Build Fails

**Error**: `Build failed with exit code 1`

**Solutions**:
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to reproduce
3. Check for TypeScript errors: `npm run lint`
4. Verify all dependencies installed: `npm install`
5. Check environment variables are set

### Database Connection Errors

**Error**: `PrismaClientInitializationError`

**Solutions**:
1. Verify `DATABASE_URL` set in Vercel
2. Check PostgreSQL database is accessible
3. Run `npx prisma generate` after schema changes
4. Verify SSL mode: `?sslmode=require`

### Images Not Loading

**Error**: 404 on `/images/places/*`

**Solutions**:
1. Verify images committed to git (not .gitignored)
2. Check `public/images/places/` directory exists
3. Run sync script if images added: `npm run sync:images`
4. Clear Vercel cache: Redeploy

### Feature Flag Not Working

**Error**: Feature still appears when flag is false

**Solutions**:
1. Verify flag name: `NEXT_PUBLIC_` prefix required
2. Check flag value in Vercel dashboard
3. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. Redeploy to pick up new environment variables

### Preview URL 404

**Error**: Preview deployment shows 404

**Solutions**:
1. Wait for build to complete (check Vercel dashboard)
2. Verify branch pushed to GitHub
3. Check build logs for errors
4. Try pushing again: `git push origin feat/my-feature --force-with-lease`

## Best Practices

### Before Merging

- [ ] Test preview deployment thoroughly
- [ ] Run `npm run lint` locally
- [ ] Check for console errors in browser
- [ ] Test on mobile device
- [ ] Verify database queries work
- [ ] Check Lighthouse score

### After Merging

- [ ] Verify production deployment succeeded
- [ ] Test critical user flows
- [ ] Monitor error logs (first 15 minutes)
- [ ] Check performance metrics
- [ ] Keep Vercel dashboard open

### Safety Tips

1. **Never skip preview testing**: Even "small" changes can break things
2. **Deploy during low traffic**: Prefer mornings over evenings
3. **Keep rollback command ready**: Have terminal open to `npm run vercel:rollback`
4. **Monitor after deploy**: Watch for 10-15 minutes post-deployment
5. **Communicate**: Let team know about deployments

## Deployment Checklist

### Pre-Deployment

- [ ] Feature branch up to date with main
- [ ] All tests passing locally
- [ ] TypeScript compiles without errors
- [ ] Preview deployment tested
- [ ] Database migrations applied (if any)
- [ ] Environment variables set
- [ ] Team notified

### Post-Deployment

- [ ] Production site loads
- [ ] No console errors
- [ ] Database queries working
- [ ] Images loading
- [ ] Search functional
- [ ] Mobile responsive
- [ ] Lighthouse score > 90

### Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Repository Owner**: @Tavinsky1
- **Database Management**: See DATABASE_ARCHITECTURE.md

## Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Git Workflow**: See CONTRIBUTING.md
- **Database Sync**: See DATABASE_QUICKREF.md

---

**Remember**: When in doubt, rollback and fix forward. It's better to be safe than sorry! 🐕✨
