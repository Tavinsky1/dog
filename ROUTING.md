# Global Navigation & Routing System

This document explains the new global navigation structure and how legacy city routes are handled.

## Overview

DogAtlas now uses a **namespaced routing structure** to support global growth while maintaining backward compatibility with legacy city routes.

### New Structure (Canonical)

```
/countries/{country}            → Country page (e.g., /countries/germany)
/countries/{country}/{city}     → City page (e.g., /countries/germany/berlin)
/countries/{country}/{city}/p/{place} → Place detail page
```

### Legacy Structure (Backward Compatible)

```
/{city}                         → Legacy city page (e.g., /berlin)
```

Legacy pages (Berlin, Paris, Rome, Barcelona) continue to work but include `<link rel="canonical">` metadata pointing to the new `/countries/...` URLs for SEO.

## Why This Structure?

### Problems Solved

1. **Route Collision**: Old `/[city]` dynamic route conflicted with new `/[country]` route
2. **Scalability**: Hundreds of cities need clear organization by country
3. **SEO**: Single canonical URL per page prevents duplicate content issues
4. **Backward Compatibility**: Existing bookmarks and external links keep working

### Architecture Decision

We chose **namespaced routes** (`/countries/...`) over:
- **Top-level routes** (`/{country}/{city}`) - Would conflict with existing `/[city]` pages
- **Catch-all routes** (`/[...slug]`) - Loses Next.js static generation benefits
- **Complete migration** - Would break existing links and bookmarks

## File Structure

```
src/app/
├── [city]/                    # Legacy city pages (Berlin, Paris, Rome, Barcelona)
│   └── page.tsx              # Has canonical metadata → /countries/{country}/{city}
├── countries/
│   └── [country]/
│       ├── page.tsx          # Country page (cities grid)
│       └── [city]/
│           └── page.tsx      # City page (places list)
├── page.tsx                  # Homepage (all countries)
└── ...

legacyCityMap.json            # Maps legacy slugs to country/city
redirects.generated.cjs       # Generated redirects config
next.config.js                # Loads redirects
scripts/
└── generate-redirects.cjs    # Generates redirects from legacyCityMap.json
```

## How It Works

### 1. Canonical URLs (SEO)

**All pages** include canonical metadata pointing to the authoritative URL:

**Legacy pages** (`src/app/[city]/page.tsx`):
```typescript
export async function generateMetadata({ params }) {
  const { city } = await params;
  const canonical = `https://dog-atlas.com/countries/germany/${city}`;
  
  return {
    title: `${city} - Dog-Friendly Places`,
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}
```

**New pages** (`src/app/countries/[country]/[city]/page.tsx`):
```typescript
export async function generateMetadata({ params }) {
  const { country, city } = await params;
  const canonical = `https://dog-atlas.com/countries/${country}/${city}`;
  
  return {
    title: `${city}, ${country} - Dog-Friendly Places`,
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}
```

### 2. Redirects (Future URLs)

For legacy city slugs **without existing page files**, automatic 301 redirects are generated:

```javascript
// redirects.generated.cjs (auto-generated)
module.exports = [
  {
    source: "/vienna",  // No src/app/vienna/ folder exists
    destination: "/countries/austria/vienna",
    permanent: true
  }
];
```

**How redirects are generated:**

1. Edit `legacyCityMap.json` to add new mappings:
   ```json
   {
     "vienna": { "country": "austria", "city": "vienna" }
   }
   ```

2. Run generator:
   ```bash
   node scripts/generate-redirects.cjs
   ```

3. Restart Next.js dev server

**Note:** Redirects DON'T apply to existing page files (Berlin, Paris, Rome, Barcelona) - those pages serve normally with canonical metadata.

### 3. Routing Helpers

Always use routing helpers to generate URLs:

```typescript
import { countryUrl, cityUrl, placeUrl } from '@/lib/routing';

// ✅ Correct (canonical URLs)
const url1 = countryUrl('germany');  // → /countries/germany
const url2 = cityUrl('germany', 'berlin');  // → /countries/germany/berlin
const url3 = placeUrl('germany', 'berlin', 'central-park');  // → /countries/germany/berlin/p/central-park

// ❌ Avoid (hard-coded URLs)
const bad = '/germany/berlin';  // Wrong structure
const bad2 = '/berlin';  // Legacy format
```

## Usage Guide

### Adding a New Country/City

1. **Add to data/countries.json:**
   ```bash
   node scripts/add-location.js country "Austria" AT
   node scripts/add-location.js city austria Vienna
   ```

2. **Add to legacyCityMap.json** (if you want short URL redirects):
   ```json
   {
     "vienna": { "country": "austria", "city": "vienna" }
   }
   ```

3. **Regenerate redirects:**
   ```bash
   node scripts/generate-redirects.cjs
   ```

4. **Test:**
   ```bash
   npm run dev
   # Visit: http://localhost:3000/countries/austria/vienna
   # Or: http://localhost:3000/vienna (redirects to canonical)
   ```

### Updating Internal Links

Update all internal links to use new canonical URLs:

**Before:**
```tsx
<Link href={`/${city.slug}`}>
  {city.name}
</Link>
```

**After:**
```tsx
import { cityUrl } from '@/lib/routing';

<Link href={cityUrl(country.slug, city.slug)}>
  {city.name}
</Link>
```

### Sitemap Generation

Ensure sitemap.xml uses canonical URLs:

```typescript
// app/sitemap.ts
import { getCountries } from '@/lib/data';
import { countryUrl, cityUrl } from '@/lib/routing';

export default function sitemap() {
  const countries = getCountries();
  const urls = [];

  for (const country of countries) {
    // Country page
    urls.push({
      url: `https://dog-atlas.com${countryUrl(country.slug)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });

    // City pages
    for (const city of country.cities) {
      urls.push({
        url: `https://dog-atlas.com${cityUrl(country.slug, city.slug)}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  return urls;
}
```

## Migration Path

### Current State (Phase 2)

✅ New pages: `/countries/{country}/{city}` (fully functional)  
✅ Legacy pages: `/{city}` (working with canonical metadata)  
✅ Routing helpers: Use `/countries/...` format  
✅ Homepage: Links to new canonical URLs  
✅ Redirects: Generated for unmapped legacy slugs  

### Future (Phase 3+)

1. **Deprecate legacy pages** (optional):
   - Remove `src/app/[city]/` folder
   - All traffic uses `/countries/...` structure
   - Redirects handle all legacy URLs

2. **Add localized routes** (optional):
   - `/de/deutschland/berlin` (German)
   - `/fr/allemagne/berlin` (French)
   - All point to canonical English URL

## Troubleshooting

### Issue: Route returns 404

**Check:**
1. Does country exist in `data/countries.json`?
2. Does city exist under that country?
3. Did you regenerate static params? (`npm run build`)

**Solution:**
```bash
# Verify data files
cat data/countries.json | jq '.countries[] | select(.slug=="germany")'

# Rebuild to regenerate static paths
npm run build
```

### Issue: Redirect not working

**Check:**
1. Does a page file exist at `src/app/{slug}/`?
2. Is slug in `legacyCityMap.json`?
3. Did you run `node scripts/generate-redirects.cjs`?

**Solution:**
- Redirects ONLY work for slugs WITHOUT page files
- If page exists, it takes precedence (use canonical metadata instead)

### Issue: Canonical URL is wrong

**Check:**
1. Is `NEXT_PUBLIC_BASE_URL` set in `.env`?
2. Did you use routing helpers correctly?

**Solution:**
```bash
# .env.local
NEXT_PUBLIC_BASE_URL=https://dog-atlas.com

# Verify in page metadata
const canonical = `${baseUrl}/countries/${country}/${city}`;
```

## Best Practices

### ✅ Do

- Use routing helpers for all internal links
- Set canonical metadata on every page
- Keep `legacyCityMap.json` updated
- Regenerate redirects after mapping changes
- Test both new and legacy URLs

### ❌ Don't

- Hard-code URLs in components
- Create top-level city folders for new cities
- Skip canonical metadata
- Forget to regenerate redirects
- Mix old and new URL formats

## Resources

- **Data layer**: `src/lib/data.ts`
- **Routing helpers**: `src/lib/routing.ts`
- **Country data**: `data/countries.json`
- **Legacy mapping**: `legacyCityMap.json`
- **Redirect generator**: `scripts/generate-redirects.cjs`
- **Next.js redirects**: `next.config.js`
- **Seed data guide**: `SEED_DATA.md`
