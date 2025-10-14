# Global Navigation Design

## Context

DogAtlas needs to scale from 5 European cities to global coverage (50+ cities, 10+ countries) while maintaining:
- Fast page loads (< 2s)
- Strong SEO (rank for "dog cafe [city]" searches)
- Accessibility (WCAG 2.1 AA)
- Safe deployments (preview → promote → rollback)

**Current Architecture:**
- Next.js 15.5.4 (App Router)
- TypeScript strict mode
- Tailwind CSS 3.4.1
- Two-database system (SQLite local, PostgreSQL production)
- Vercel hosting
- 166 places across 5 cities

**Constraints:**
- No runtime third-party photo APIs
- Must work without JavaScript (progressive enhancement)
- Mobile-first design
- Sub-2s page loads on 3G
- Maintain existing orange/amber theme

**Stakeholders:**
- Dog owners searching for places
- SEO (Google crawlers)
- Content editors (adding new cities)
- Developers (maintaining code)

## Goals / Non-Goals

**Goals:**
- Scalable IA for 10+ countries, 50+ cities
- SEO-first with crawlable routes
- Fast performance (Lighthouse > 90)
- Safe deployment workflow
- Hybrid list/map navigation
- Feature-flagged rollout

**Non-Goals:**
- Real-time data updates (ISR is sufficient)
- User-generated country/city data (admin-curated only)
- Multi-language i18n (English first, future enhancement)
- Native mobile apps (PWA-ready but not required)
- Complex map interactions (simple click-to-navigate sufficient)

## Decisions

### Decision: Hybrid Navigation (List Default + Map Optional)
**What**: List-based hierarchy as default, interactive map as feature-flagged enhancement.

**Why**: 
- SEO requires crawlable HTML links (maps are JavaScript black boxes)
- List view works on all devices/connections (accessibility-first)
- Map adds visual delight without blocking core functionality
- Progressive enhancement philosophy

**Alternatives considered:**
- Map-only: Rejected due to SEO/accessibility concerns
- List-only: Rejected due to lack of visual engagement

**Implementation:**
```typescript
// Feature flag evaluation
export const FEATURE_FLAGS = {
  ENABLE_MAP_VIEW: process.env.NEXT_PUBLIC_ENABLE_MAP_VIEW === 'true',
  ENABLE_MAPBOX: process.env.NEXT_PUBLIC_ENABLE_MAPBOX === 'true',
};

// Conditional navigation
{FEATURE_FLAGS.ENABLE_MAP_VIEW && <Link href="/map">Map View</Link>}

// Lazy loading
const WorldMap = dynamic(() => import('@/components/WorldMapSvg'), { 
  ssr: false, 
  loading: () => <MapSkeleton /> 
});
```

### Decision: Dynamic Routes with ISR
**What**: Use Next.js `[country]/[city]` dynamic routes with Incremental Static Regeneration.

**Why**:
- Generate pages at build time for known routes (fast)
- Handle new countries/cities dynamically (fallback: 'blocking')
- Auto-update content without full rebuilds (ISR revalidation)
- Balance between SSG speed and SSR flexibility

**Revalidation Strategy:**
```typescript
// app/page.tsx (home)
export const revalidate = 86400; // 24 hours

// app/[country]/page.tsx
export const revalidate = 3600; // 1 hour

// app/[country]/[city]/page.tsx
export const revalidate = 1800; // 30 minutes

// app/[country]/[city]/places/[id]/page.tsx
export const revalidate = 300; // 5 minutes
```

**Rationale**: Deeper pages change more frequently (new reviews, updated hours).

### Decision: Slug-Based URLs (Not ISO Codes)
**What**: Use human-readable slugs in URLs (`/germany/berlin`) not codes (`/de/ber`).

**Why**:
- Better SEO (keywords in URL)
- User-friendly (shareable links)
- No confusion with language codes

**Implementation:**
```typescript
// lib/routing.ts
import slugify from 'slugify';

export function makeSlug(name: string): string {
  return slugify(name, { lower: true, strict: true });
}

// Examples:
// "United States" → "united-states"
// "São Paulo" → "sao-paulo"
// "Île-de-France" → "ile-de-france"
```

### Decision: Client-Side Search (Not API)
**What**: Build search index at build time, search client-side.

**Why**:
- No backend load (serverless-friendly)
- Instant typeahead (no network latency)
- Offline-capable (PWA future-ready)
- Simple implementation (no Algolia/Elasticsearch needed)

**Trade-offs**:
- Search index adds ~50-100KB to bundle
- Can't search dynamic content instantly (ISR revalidation delay)
- Acceptable for current scale (166 places → ~20KB index)

**Implementation:**
```typescript
// lib/searchIndex.ts
export function buildSearchIndex(countries: Country[]) {
  const index: SearchEntry[] = [];
  
  countries.forEach(country => {
    // Add country
    index.push({
      type: 'country',
      name: country.name,
      slug: country.slug,
      url: `/${country.slug}`,
      keywords: [country.name, country.iso],
    });
    
    // Add cities
    country.cities.forEach(city => {
      index.push({
        type: 'city',
        name: `${city.name}, ${country.name}`,
        slug: city.slug,
        url: `/${country.slug}/${city.slug}`,
        keywords: [city.name, country.name],
      });
    });
  });
  
  return index;
}

// Search with fuzzy matching
export function search(query: string, index: SearchEntry[]) {
  const lowerQuery = query.toLowerCase();
  return index.filter(entry => 
    entry.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
  ).slice(0, 10);
}
```

### Decision: SVG Map First, Mapbox Optional
**What**: Phase 1 uses lightweight SVG world map, Phase 2 adds Mapbox behind feature flag.

**Why**:
- SVG map is ~20KB, Mapbox is ~500KB
- SVG works offline, Mapbox requires API key
- Can ship faster without external dependencies
- Mapbox adds value later (zoom, pan, layers) but not required for MVP

**SVG Map Approach:**
```typescript
// components/WorldMapSvg.tsx
export default function WorldMapSvg({ countries }: Props) {
  return (
    <svg viewBox="0 0 1000 500">
      {countries.map(country => (
        <path
          key={country.iso}
          d={countryPaths[country.iso]} // Pre-defined SVG paths
          onClick={() => router.push(`/${country.slug}`)}
          className="hover:fill-amber-500 transition"
          aria-label={`${country.name} - ${country.totalPlaces} places`}
        />
      ))}
    </svg>
  );
}
```

### Decision: Countries Data in JSON (Not Database)
**What**: Store country/city metadata in `data/countries.json`, not Prisma database.

**Why**:
- Country data is static (rarely changes)
- No database query overhead for navigation
- Can edit manually or via script
- Type-safe with TypeScript interfaces
- Future: generate from database if needed

**Data Structure:**
```json
{
  "countries": [
    {
      "iso": "DE",
      "name": "Germany",
      "slug": "germany",
      "flag": "🇩🇪",
      "continent": "Europe",
      "coordinates": [51.1657, 10.4515],
      "cities": [
        {
          "name": "Berlin",
          "slug": "berlin",
          "coordinates": [52.5200, 13.4050],
          "placeCount": 45
        }
      ]
    }
  ]
}
```

**Update Process:**
1. Manual edit for new countries
2. Run `npm run update-place-counts` to sync from database
3. Commit changes
4. Deploy (ISR picks up new data)

## Risks / Trade-offs

### Risk: ISR Revalidation Lag
**Impact**: New places don't appear immediately on country/city pages.

**Mitigation:**
- Set aggressive revalidation (30min for city pages)
- Add "Last updated: X minutes ago" timestamp
- Provide manual revalidation endpoint for admins
- Document expected lag in CONTRIBUTING.md

### Risk: Search Index Size Growth
**Impact**: Search index could grow large with 1000+ places (100-200KB).

**Mitigation:**
- Current: 166 places → ~20KB index (acceptable)
- Threshold: If >1000 places, switch to API-based search
- Use compression (gzip reduces JSON by 70%)
- Consider Algolia or MeiliSearch at scale

### Risk: SVG Map Complexity
**Impact**: World map SVG with 200+ countries is ~500KB uncompressed.

**Mitigation:**
- Simplify SVG paths (use Mapshaper to reduce complexity)
- Only include countries with data (skip empty countries)
- Lazy load map component
- Provide "List View" as lightweight alternative

### Risk: URL Slug Collisions
**Impact**: Two cities with same name in different countries (e.g., "Portland, OR" vs "Portland, ME").

**Mitigation:**
- Include country in city slug if collision detected
- Example: `/united-states/portland-oregon`, `/united-states/portland-maine`
- Validate uniqueness in build script
- Add slug validation to admin UI

### Trade-off: ISR vs SSR
**Chosen**: ISR with revalidation

**Trade-off**: ISR serves stale content briefly, SSR always fresh.

**Accepted because:**
- Dog-friendly places don't change every second
- 30min staleness is acceptable
- ISR is faster (no server rendering on every request)
- Reduces database load (no query per request)

## Migration Plan

### Phase 1: Data Preparation (Week 1)
1. Create `data/countries.json` with existing 6 countries
2. Add `country` field to Prisma `Place` model
3. Run migration to add country to existing places
4. Script to sync place counts from database to JSON

### Phase 2: Core Routes (Week 1-2)
1. Implement routing utilities (`lib/routing.ts`)
2. Build country landing pages (`app/[country]/page.tsx`)
3. Adapt city pages to nested routes (`app/[country]/[city]/page.tsx`)
4. Update header with global navigation
5. Add breadcrumbs to all pages

### Phase 3: Search & Discovery (Week 2)
1. Build search index at build time
2. Create search bar component
3. Implement typeahead
4. Create search results page
5. Add global search to header

### Phase 4: Map View (Week 2-3)
1. Create lightweight SVG world map
2. Implement lazy loading
3. Add feature flag toggle
4. Test on mobile devices
5. Optional: Add Mapbox behind second feature flag

### Phase 5: SEO & Performance (Week 3)
1. Add OpenGraph metadata
2. Generate JSON-LD structured data
3. Create sitemap
4. Optimize images
5. Run Lighthouse audits

### Phase 6: Deployment (Week 3-4)
1. Write DEPLOYMENT.md
2. Add Vercel deployment scripts
3. Set up feature flags in Vercel
4. Test preview workflow
5. Test rollback procedure
6. Create Playwright smoke tests

### Rollback Plan
If issues arise after deployment:

**Immediate (< 5 minutes):**
```bash
vercel ls  # Find last good deployment
vercel rollback [deployment-id]
```

**Code Revert (if needed):**
```bash
git revert [commit-sha]
git push origin main
# Vercel auto-deploys reverted code
```

**Feature Flag Disable (instant):**
```bash
# In Vercel dashboard:
NEXT_PUBLIC_ENABLE_MAP_VIEW=false
# Or via CLI:
vercel env rm NEXT_PUBLIC_ENABLE_MAP_VIEW production
```

## Open Questions

1. **Should we show place counts on map tooltips?**
   - Pro: Helps users see which countries have content
   - Con: Requires loading counts data with map
   - Decision: Yes, but lazy-load with map (acceptable trade-off)

2. **Should country pages have their own maps?**
   - Pro: Shows city locations within country
   - Con: Adds complexity, map library overhead
   - Decision: Phase 2 enhancement, not MVP

3. **How to handle cities with multiple areas (e.g., NYC boroughs)?**
   - Option A: Separate city pages (/united-states/manhattan)
   - Option B: Single page with area filter (/united-states/new-york?area=manhattan)
   - Decision: Start with Option A (simpler routing), revisit if needed

4. **Should we support custom country/city slugs?**
   - Pro: Handle edge cases (e.g., "United Kingdom" vs "UK")
   - Con: Adds configuration complexity
   - Decision: Auto-generate from name, allow manual override in JSON if needed
