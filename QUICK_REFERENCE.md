# 🚀 Quick Reference - DogAtlas Production

## ✅ Safe Production Workflow

### Adding/Editing Places

```bash
# 1. Edit locally in Prisma Studio
npx prisma studio

# 2. Export to seed file
npm run export-seed

# 3. Test locally
npm run build
npm run dev

# 4. Commit & deploy
git add data/places.seed.json
git commit -m "Update places data"
git push origin master
vercel --prod
```

---

## ⚠️ Never Do This

❌ Don't add `NEXT_PUBLIC_USE_DATABASE=true` to Vercel  
❌ Don't modify environment variables without testing  
❌ Don't deploy without running `npm run export-seed` after DB changes  
❌ Don't skip local build testing  
❌ Don't commit `.env` files with secrets  

---

## 🔥 Emergency Rollback

```bash
# Option 1: Git rollback
git revert HEAD
git push origin master

# Option 2: Vercel dashboard
# Go to: https://vercel.com/tavinskys-projects/dog-atlas
# Find last working deployment → Click "Redeploy"
```

---

## 📊 Current Production Status

- **Site**: https://dog-atlas.com
- **Places**: 269 across 13 cities
- **Data Source**: `data/places.seed.json`
- **Database Flag**: NOT SET (correct)
- **Last Update**: October 17, 2025

---

## 🛠️ Useful Commands

```bash
# Check place counts
sqlite3 prisma/dev.db "SELECT c.slug, COUNT(p.id) FROM City c LEFT JOIN Place p ON p.cityId = c.id GROUP BY c.slug;"

# Export seed file
npm run export-seed

# Build locally
npm run build

# Deploy to production
vercel --prod

# View production logs
vercel logs --prod

# Check Vercel env vars
vercel env ls
```

---

## 📚 Documentation

- **Deployment Guide**: [DEPLOYMENT_SAFEGUARDS.md](./DEPLOYMENT_SAFEGUARDS.md)
- **SEO Guide**: [SEO_GUIDE.md](./SEO_GUIDE.md)
- **Full README**: [README.md](./README.md)

---

**Last Updated**: October 17, 2025  
**Status**: 🟢 All systems operational
