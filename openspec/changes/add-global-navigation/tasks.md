# Global Navigation Implementation Tasks

## Phase 1: Foundation (Week 1)
- [x] 1.1 Create OpenSpec proposal and validate
- [x] 1.2 Create `data/countries.json` with 6 current countries
- [x] 1.3 Create `scripts/vercel-rollback.js` helper script
- [x] 1.4 Create Playwright smoke tests (`tests/smoke.spec.ts`)
- [x] 1.5 Write comprehensive DEPLOYMENT.md
- [x] 1.6 Expand CONTRIBUTING.md with workflows
- [ ] 1.7 Implement `lib/routing.ts` (slug helpers, URL builders)
- [ ] 1.8 Implement `lib/featureFlags.ts` (runtime toggles)
- [ ] 1.9 Create `components/Header.tsx` with global navigation
- [ ] 1.10 Create `components/CountryCard.tsx` component

## Phase 2: Core Routes (Week 1-2)
- [ ] 2.1 Update `app/page.tsx` to show countries grid
- [ ] 2.2 Create `app/[country]/page.tsx` with ISR
- [ ] 2.3 Adapt `app/[country]/[city]/page.tsx` to new hierarchy
- [ ] 2.4 Add generateStaticParams for country/city routes
- [ ] 2.5 Add OpenGraph metadata per route
- [ ] 2.6 Add JSON-LD breadcrumbs

## Phase 3: Search & Discovery (Week 2)
- [ ] 3.1 Build search index from countries.json
- [ ] 3.2 Create `app/search/page.tsx` with typeahead
- [ ] 3.3 Add global search to Header
- [ ] 3.4 Implement filtering by country/city/category
- [ ] 3.5 Add search results page with pagination

## Phase 4: Map View (Week 2-3)
- [ ] 4.1 Create `components/WorldMapSvg.tsx` (simple SVG)
- [ ] 4.2 Create `app/map/page.tsx` with lazy loading
- [ ] 4.3 Add map toggle to Header (feature-flagged)
- [ ] 4.4 Add tooltips on hover (country name + place count)
- [ ] 4.5 Add click handlers (navigate to country page)

## Phase 5: Data Integration (Week 3)
- [ ] 5.1 Update Prisma schema with country field on Place model
- [ ] 5.2 Add country migration to existing places
- [ ] 5.3 Update API routes to filter by country
- [ ] 5.4 Generate countries.json from database
- [ ] 5.5 Add admin UI to manage country metadata

## Phase 6: SEO & Performance (Week 3-4)
- [ ] 6.1 Add sitemap generation for country/city routes
- [ ] 6.2 Add canonical URLs to all pages
- [ ] 6.3 Optimize ISR revalidation times
- [ ] 6.4 Add loading skeletons for ISR pages
- [ ] 6.5 Test Core Web Vitals (LCP, CLS, FID)

## Phase 7: Deployment & Testing (Week 4)
- [ ] 7.1 Create DEPLOYMENT.md documentation
- [ ] 7.2 Add Vercel deployment scripts to package.json
- [ ] 7.3 Set up feature flags in Vercel environment variables
- [ ] 7.4 Create Playwright smoke tests
- [ ] 7.5 Test preview deployment workflow
- [ ] 7.6 Test rollback procedure
- [ ] 7.7 Document CONTRIBUTING.md workflow

## Phase 8: Polish & Launch (Week 4-5)
- [ ] 8.1 Add empty states ("No cities yet - coming soon")
- [ ] 8.2 Add accessibility audit (WCAG 2.1 AA)
- [ ] 8.3 Test keyboard navigation
- [ ] 8.4 Test screen reader compatibility
- [ ] 8.5 Mobile responsiveness testing
- [ ] 8.6 Cross-browser testing (Chrome, Safari, Firefox)
- [ ] 8.7 Performance testing on slow connections

## Phase 9: Advanced Features (Future)
- [ ] 9.1 Add continent filtering on countries page
- [ ] 9.2 Implement A/B test (list vs map as default)
- [ ] 9.3 Add Mapbox integration (feature-flagged)
- [ ] 9.4 Add interactive city maps on country pages
- [ ] 9.5 Add "nearby cities" suggestions
- [ ] 9.6 Add country/city statistics dashboard

## Verification Checklist
- [ ] Home shows countries grid with flags and counts
- [ ] Country pages list cities with place counts
- [ ] City pages show categories (existing functionality)
- [ ] Map view loads without blocking (lazy)
- [ ] Search returns relevant places/cities/countries
- [ ] All routes have proper metadata (title, description, OG)
- [ ] Breadcrumbs work on all pages
- [ ] Feature flags toggle map view correctly
- [ ] Preview deployment works for PRs
- [ ] Production deployment succeeds
- [ ] Rollback works correctly
- [ ] Page load times < 2s (3G connection)
- [ ] Lighthouse score > 90 (performance, accessibility, SEO)
