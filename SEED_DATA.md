# Seed Data System

This document explains how to work with the new seed-based data system for places.

## Quick Start

```bash
# Run the dev server
npm run dev

# Visit the new routes
open http://localhost:3000
open http://localhost:3000/countries/united-states
open http://localhost:3000/countries/united-states/new-york
open http://localhost:3000/countries/japan/tokyo

# Legacy routes redirect to canonical URLs:
# /berlin → /countries/germany/berlin
# /paris → /countries/france/paris
```

## Architecture

### Data Sources

1. **countries.json** (authoritative)
   - Location: `data/countries.json`
   - Contains all countries and cities
   - Metadata: counts, coordinates, timezones, etc.
   - Managed via `scripts/add-location.js`

2. **places.seed.json** (temporary/development)
   - Location: `data/places.seed.json`
   - Lightweight place data for new cities
   - Used until database is populated
   - Managed via `scripts/csv-to-seed.js`

3. **PostgreSQL Database** (production)
   - Existing Berlin/Paris/Rome/Barcelona data
   - Toggle with `NEXT_PUBLIC_USE_DATABASE=true`
   - See `DATABASE_ARCHITECTURE.md`

### Data Access Layer

All data access goes through `src/lib/data.ts`:

```typescript
import { getCountries, getCities, getPlaces } from '@/lib/data';

// Get all countries
const countries = getCountries();

// Get cities for a country
const cities = getCities('united-states');

// Get places (from seed file)
const places = await getPlaces('united-states', 'new-york');

// Get places (from database)
const places = await getPlaces('germany', 'berlin', undefined, true);
```

## Adding Data

### 1. Add a Country

```bash
# Interactive prompt
node scripts/add-location.js country "United Kingdom" GB

# Will ask for:
# - Latitude/longitude (capital city center)
# - Timezone (e.g., Europe/London)
# - Primary language
```

**Output:**
- Updates `data/countries.json`
- Increments version number
- Sets totalCountries count

### 2. Add a City

```bash
# Interactive prompt
node scripts/add-location.js city united-kingdom London

# Will ask for:
# - Latitude/longitude
# - Population (optional)
# - Timezone (default: inherited from country)
# - Description
```

**Output:**
- Updates `data/countries.json`
- Increments version number
- Sets totalCities count
- Creates URL route: `/united-kingdom/london`

### 3. Add Places (CSV Import)

#### CSV Format

```csv
country,city,name,category,lat,lon,address,website,phone,description,photo_url,verified
united-states,new-york,Central Park,parks,40.785,-73.968,,,,Great off-leash area,https://...,false
united-kingdom,london,Hyde Park,parks,51.507,-0.166,,,,Beautiful royal park,https://...,false
```

**Required columns:**
- country, city, name, category, lat, lon

**Optional columns:**
- address, website, phone, description, photo_url, verified

#### Import Commands

```bash
# Create new seed file
node scripts/csv-to-seed.js places.csv > data/places.seed.json

# Append to existing seed file
node scripts/csv-to-seed.js more-places.csv --append

# Preview without saving
node scripts/csv-to-seed.js places.csv
```

**Output:**
- Updates `data/places.seed.json`
- Generates IDs: `{citySlug}-{placeSlug}`
- Skips duplicates in append mode

## Feature Flags

Control what's visible via `.env.local`:

```bash
# Use database instead of seed files
NEXT_PUBLIC_USE_DATABASE=true

# Enable map view (Phase 4)
NEXT_PUBLIC_ENABLE_MAP_VIEW=false

# Enable Mapbox integration
NEXT_PUBLIC_ENABLE_MAPBOX=false

# ISR revalidation (seconds)
NEXT_PUBLIC_ISR_REVALIDATE=3600
```

Check current flags:

```typescript
import { featureFlags } from '@/lib/featureFlags';
console.log(featureFlags);
```

## Routing System

All URLs use consistent patterns:

```typescript
import { countryUrl, cityUrl, placeUrl } from '@/lib/routing';

// Country page: /countries/united-states
const url1 = countryUrl('united-states');

// City page: /countries/united-states/new-york
const url2 = cityUrl('united-states', 'new-york');

// Place page: /countries/united-states/new-york/p/central-park
const url3 = placeUrl('united-states', 'new-york', 'central-park');

// Category filter: /countries/united-states/new-york?category=parks
const url4 = categoryUrl('united-states', 'new-york', 'parks');
```

### URL Structure

```
/                                          → Homepage (all countries)
/countries/{country}                       → Country page (cities grid)
/countries/{country}/{city}                → City page (places list)
/countries/{country}/{city}?category=parks → Filtered places
/countries/{country}/{city}/p/{place}      → Place detail
/countries/{country}/{city}/map            → Map view (Phase 4)

# Legacy routes (redirected to canonical):
/{city} → /countries/{country}/{city}      → 301 redirect
```

## Migration Path

### Current State (Phase 2)

- ✅ Seed files for new cities (USA, Australia, Argentina, Japan)
- ✅ Database for existing cities (Berlin, Paris, Rome, Barcelona)
- ✅ Feature flag to toggle between sources
- ✅ Country/city pages with ISR

### Future (Phase 3+)

1. **Populate Database**
   - Import seed data to PostgreSQL
   - Add `country` field to Place model
   - Run migration to link places to cities
   - Update sync scripts

2. **Enable Database Mode**
   - Set `NEXT_PUBLIC_USE_DATABASE=true`
   - Remove seed files (optional)
   - Keep for development/testing

3. **Add Map View**
   - Set `NEXT_PUBLIC_ENABLE_MAP_VIEW=true`
   - Implement `/map` routes
   - Add Mapbox integration (optional)

## Development Workflow

### Local Testing

```bash
# 1. Add a country
node scripts/add-location.js country "Canada" CA

# 2. Add cities
node scripts/add-location.js city canada Toronto
node scripts/add-location.js city canada Vancouver

# 3. Create CSV with places
cat > toronto-places.csv << EOF
country,city,name,category,lat,lon,description
canada,toronto,Trinity Bellwoods Park,parks,43.648,-79.417,Popular dog park
canada,toronto,Snakes and Lattes,cafes_restaurants,43.671,-79.444,Board game cafe with patio
EOF

# 4. Import CSV
node scripts/csv-to-seed.js toronto-places.csv --append

# 6. Test locally
npm run dev
open http://localhost:3000/countries/canada/toronto

# 7. Commit when satisfied
git add data/
git commit -m "Add Canada with Toronto and Vancouver"
git push
```

### Deploy to Vercel

```bash
# Preview deploy (automatic on PR)
git checkout -b add-canada
git push origin add-canada
# → Check Vercel preview URL

# Production deploy (merge to master)
git checkout master
git merge add-canada
git push origin master
# → Deploys to www.dog-atlas.com
```

## Troubleshooting

### Issue: Country/city page shows 404

**Solution:**
```bash
# Regenerate static paths
npm run build

# Or wait for ISR (1 hour)
# Or clear Next.js cache:
rm -rf .next
npm run dev
```

### Issue: Places not showing

**Check:**
1. Is `data/places.seed.json` valid JSON?
2. Do place `country` and `city` slugs match `countries.json`?
3. Is feature flag correct? (`NEXT_PUBLIC_USE_DATABASE`)

```bash
# Validate JSON
cat data/places.seed.json | jq .

# Check slugs
cat data/countries.json | jq '.countries[].slug'
cat data/places.seed.json | jq '.[].country' | sort -u
```

### Issue: TypeScript errors in data.ts

**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate

# Check schema matches usage
cat prisma/schema.prisma
```

## Best Practices

### 1. Consistent Slugs

Always use slugify for slugs:

```typescript
import { slugify } from '@/lib/routing';

const countrySlug = slugify('United States'); // → 'united-states'
const citySlug = slugify('New York');         // → 'new-york'
```

### 2. Complete Metadata

When adding countries/cities, provide:
- ✅ Accurate coordinates (city center)
- ✅ Correct timezone (IANA format)
- ✅ Descriptive text (for SEO)
- ✅ Population (if available)

### 3. Quality Photos

When adding places:
- Use high-quality images (min 800px wide)
- Prefer Unsplash or Wikimedia Commons
- Include multiple photos if possible
- Add proper attributions

### 4. Verify Before Push

```bash
# Build locally
npm run build

# Check for errors
npm run lint

# Preview production mode
npm start
```

## Resources

- **Countries data**: `data/countries.json`
- **Places seed**: `data/places.seed.json`
- **Data layer**: `src/lib/data.ts`
- **Routing**: `src/lib/routing.ts`
- **Feature flags**: `src/lib/featureFlags.ts`
- **Database**: `DATABASE_ARCHITECTURE.md`
- **Deployment**: `DEPLOYMENT.md`
- **OpenSpec**: `openspec/changes/add-global-navigation/`
