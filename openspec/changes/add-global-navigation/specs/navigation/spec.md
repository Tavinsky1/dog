## ADDED Requirements

### Requirement: Global Navigation Hierarchy
The system SHALL provide a hierarchical navigation structure from countries to cities to categories to places.

#### Scenario: User browses from home to place
- **WHEN** user visits homepage
- **THEN** countries grid is displayed with flags and place counts
- **AND** user can click a country to see its cities
- **AND** user can click a city to see categories
- **AND** user can click a category to see places

#### Scenario: SEO-friendly URL structure
- **WHEN** user navigates to a place
- **THEN** URL follows pattern `/[country]/[city]/places/[id]`
- **AND** URLs use lowercase, hyphenated slugs
- **AND** breadcrumbs show full path (Home > Country > City > Category > Place)

### Requirement: Country Landing Pages
The system SHALL provide dedicated landing pages for each country showing cities and statistics.

#### Scenario: Country page displays cities
- **WHEN** user visits `/germany`
- **THEN** page shows country flag and name
- **AND** page lists all cities in that country
- **AND** each city shows place count
- **AND** page includes quick links to popular categories

#### Scenario: Country metadata for SEO
- **WHEN** country page is rendered
- **THEN** page includes OpenGraph metadata
- **AND** page includes JSON-LD Country schema
- **AND** page includes canonical URL
- **AND** page title follows pattern "[Country] - Dog-Friendly Places | DogAtlas"

### Requirement: Hybrid Navigation Pattern
The system SHALL support both list-based and map-based navigation with list as default.

#### Scenario: List view as default
- **WHEN** user visits homepage or explore page
- **THEN** countries are displayed in a grid/list format
- **AND** no JavaScript map library loads initially
- **AND** page is fully functional without JavaScript

#### Scenario: Map view toggle
- **WHEN** feature flag ENABLE_MAP_VIEW is true
- **THEN** header shows "Map View" navigation link
- **AND** clicking opens `/map` page
- **AND** map loads lazily with dynamic import
- **AND** map is code-split from main bundle

#### Scenario: Map view disabled
- **WHEN** feature flag ENABLE_MAP_VIEW is false
- **THEN** map navigation link is hidden
- **AND** `/map` route returns 404
- **AND** no map-related code is loaded

### Requirement: Dynamic Routing with ISR
The system SHALL use Next.js dynamic routes with Incremental Static Regeneration for scalability.

#### Scenario: Country route generation
- **WHEN** build process runs
- **THEN** static paths generated for all known countries
- **AND** fallback is set to 'blocking' for new countries
- **AND** pages revalidate every 1 hour

#### Scenario: City route generation
- **WHEN** build process runs
- **THEN** static paths generated for all known cities
- **AND** fallback is set to 'blocking' for new cities
- **AND** pages revalidate every 30 minutes

#### Scenario: 404 for invalid routes
- **WHEN** user visits non-existent country or city
- **THEN** system returns 404 Not Found
- **AND** custom 404 page suggests valid countries

### Requirement: Global Search Functionality
The system SHALL provide global search across places, cities, and countries.

#### Scenario: Search from header
- **WHEN** user types in global search bar
- **THEN** typeahead suggestions appear
- **AND** suggestions include places, cities, and countries
- **AND** suggestions are ranked by relevance

#### Scenario: Search results page
- **WHEN** user submits search query
- **THEN** navigates to `/search?q=[query]`
- **AND** results show places matching query
- **AND** results can be filtered by country, city, category
- **AND** results show breadcrumb path for each place

#### Scenario: Search index build
- **WHEN** application starts
- **THEN** search index built from countries.json and database
- **AND** index includes place names, cities, countries
- **AND** index is optimized for fuzzy matching

### Requirement: Feature Flag System
The system SHALL support runtime feature flags for gradual rollout of new features.

#### Scenario: Feature flag evaluation
- **WHEN** feature flag is checked
- **THEN** value is read from environment variable
- **AND** default is false if not set
- **AND** flag works in both server and client components

#### Scenario: Map view feature flag
- **WHEN** NEXT_PUBLIC_ENABLE_MAP_VIEW is 'true'
- **THEN** map navigation link appears
- **AND** `/map` route is accessible
- **AND** map component loads

#### Scenario: Mapbox feature flag
- **WHEN** NEXT_PUBLIC_ENABLE_MAPBOX is 'true'
- **THEN** Mapbox library loads instead of SVG map
- **AND** interactive features are available
- **AND** API key is used from environment

### Requirement: Vercel Deployment Workflow
The system SHALL support preview deployments, production promotion, and instant rollback via Vercel.

#### Scenario: Preview deployment on PR
- **WHEN** pull request is created
- **THEN** Vercel automatically creates preview deployment
- **AND** preview URL is posted to PR
- **AND** preview uses staging environment variables
- **AND** preview is isolated from production

#### Scenario: Production deployment on merge
- **WHEN** PR is merged to main branch
- **THEN** Vercel automatically deploys to production
- **AND** production uses production environment variables
- **AND** deployment completes within 5 minutes
- **AND** deployment status is visible in Vercel dashboard

#### Scenario: Rollback to previous deployment
- **WHEN** production issue is detected
- **THEN** developer can run `vercel rollback [deployment]`
- **AND** traffic instantly switches to previous deployment
- **AND** rollback completes within 30 seconds
- **AND** no data is lost during rollback

#### Scenario: Environment variable management
- **WHEN** environment variables need updating
- **THEN** variables are set in Vercel dashboard
- **AND** variables can be pulled with `vercel env pull`
- **AND** variables are scoped by environment (preview, production)
- **AND** secrets are encrypted at rest

### Requirement: SEO Optimization
The system SHALL provide comprehensive SEO metadata for all country and city pages.

#### Scenario: Structured data markup
- **WHEN** page is rendered
- **THEN** JSON-LD script includes appropriate schema type
- **AND** BreadcrumbList schema shows navigation path
- **AND** Place schema includes name, address, rating
- **AND** Country/City schemas are used on landing pages

#### Scenario: OpenGraph metadata
- **WHEN** page is shared on social media
- **THEN** OpenGraph tags provide title, description, image
- **AND** image is optimized (1200x630, <300KB)
- **AND** og:type is set appropriately
- **AND** Twitter Card tags are included

#### Scenario: Sitemap generation
- **WHEN** build process runs
- **THEN** sitemap.xml is generated with all routes
- **AND** sitemap includes country pages
- **AND** sitemap includes city pages
- **AND** sitemap includes lastmod timestamps
- **AND** sitemap is submitted to search engines

### Requirement: Performance Optimization
The system SHALL maintain fast page load times across all navigation routes.

#### Scenario: Code splitting
- **WHEN** user loads a page
- **THEN** only required JavaScript is loaded
- **AND** map components are lazy-loaded
- **AND** search index loads asynchronously
- **AND** images are lazy-loaded below the fold

#### Scenario: ISR revalidation strategy
- **WHEN** page is requested after revalidation period
- **THEN** stale page is served immediately
- **AND** fresh page is generated in background
- **AND** next request receives fresh page
- **AND** revalidation times vary by route depth (home: 24h, country: 1h, city: 30min)

#### Scenario: Core Web Vitals targets
- **WHEN** page performance is measured
- **THEN** Largest Contentful Paint (LCP) < 2.5s
- **AND** First Input Delay (FID) < 100ms
- **AND** Cumulative Layout Shift (CLS) < 0.1
- **AND** Time to First Byte (TTFB) < 600ms

### Requirement: Accessibility Compliance
The system SHALL meet WCAG 2.1 AA accessibility standards for all navigation components.

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard only
- **THEN** all interactive elements are reachable via Tab
- **AND** focus indicators are visible
- **AND** skip links allow jumping to main content
- **AND** dropdown menus are keyboard-accessible

#### Scenario: Screen reader support
- **WHEN** screen reader is active
- **THEN** all navigation elements have proper ARIA labels
- **AND** landmark regions are defined (header, nav, main)
- **AND** breadcrumbs are announced correctly
- **AND** map view has text alternative

#### Scenario: Color contrast
- **WHEN** colors are tested
- **THEN** text has minimum 4.5:1 contrast ratio
- **AND** interactive elements have 3:1 contrast
- **AND** focus indicators have 3:1 contrast
- **AND** color is not sole means of conveying information
