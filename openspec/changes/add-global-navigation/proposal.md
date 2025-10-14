# Global Navigation System Proposal

## Why

DogAtlas currently has a single-city focus with a hard-coded "Berlin" location selector. This doesn't scale globally. Users need:
- Easy discovery of dog-friendly places across multiple countries
- Intuitive navigation from country → city → category → place
- Visual exploration option (map view) for geographic context
- Fast, SEO-friendly pages that rank well in search engines

Current limitations:
- Homepage only shows categories, not countries
- Location dropdown is limited to European cities
- No country-level landing pages
- No global search across all locations
- No visual/map-based exploration option

This change enables global expansion from 5 cities to 50+ cities across 10+ countries while maintaining performance and SEO.

## What Changes

- **New Information Architecture**: Home → Countries → Cities → Categories → Places
- **Hybrid Navigation Pattern**: List-based (default) + Interactive Map (feature-flagged)
- **Dynamic Routing**: `/[country]/[city]` with ISR for scalability
- **Global Search**: Search across places, cities, and countries
- **Country Landing Pages**: Showcase cities within each country
- **Map View**: Lazy-loaded SVG world map (Phase 1), optional Mapbox upgrade (Phase 2)
- **Feature Flags**: Toggle map view and advanced features without deployment
- **Vercel Workflow**: Preview deploys, promote to production, instant rollback

**Navigation Hierarchy:**
```
/ (Home)
├─ Countries grid
├─ Global search
└─ [List View] / [Map View] toggle

/[country] (e.g., /germany)
├─ Country hero
├─ Cities list/carousel
└─ Quick stats

/[country]/[city] (e.g., /germany/berlin)
├─ City hero
├─ Category grid (existing)
├─ Map (existing MapLibre)
└─ Featured places

/map (Global Map View - lazy loaded)
├─ SVG world map
├─ Click country → navigate to country page
└─ Feature flag: ENABLE_MAPBOX for Mapbox upgrade
```

## Impact

**Affected Components:**
- `app/layout.tsx` - Add new Header with global navigation
- `app/page.tsx` - Transform from category-focused to country-focused
- `app/[country]/page.tsx` - NEW country landing page
- `app/[country]/[city]/page.tsx` - Adapt existing city page
- `app/map/page.tsx` - NEW interactive map view
- `app/search/page.tsx` - NEW global search
- `components/Header.tsx` - NEW global header component
- `components/CountryCard.tsx`, `CityCarousel.tsx` - NEW components

**Affected Specs:**
- NEW capability: `navigation` (global IA and routing)
- MODIFIED capability: `homepage` (from categories to countries)
- MODIFIED capability: `city-pages` (nested under countries)

**Data Changes:**
- NEW: `data/countries.json` - Country metadata and city mappings
- MODIFIED: Database queries to group by country
- NEW: `lib/routing.ts` - URL helpers and slug generation
- NEW: `lib/featureFlags.ts` - Runtime feature toggles

**SEO Impact:**
- Better crawlability with country/city hierarchy
- Clearer breadcrumbs (Home > Germany > Berlin > Cafés)
- JSON-LD structured data (Country, City, BreadcrumbList)
- Improved internal linking structure

**Performance:**
- Countries page: SSG (24h revalidation)
- Country pages: ISR (1h revalidation)
- City pages: ISR (30min revalidation)
- Map view: Code-split, lazy-loaded
- Search: Client-side with pre-built index

**Deployment:**
- Feature branch → Vercel preview (automatic)
- PR review with preview link
- Merge → Production deployment
- Rollback via `vercel rollback` or `git revert`
- Feature flags allow gradual rollout
