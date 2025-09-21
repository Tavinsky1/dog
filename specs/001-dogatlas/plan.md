# DogAtlas Implementation Plan

## Principles
- **Simplicity**: ≤ 3 deployables (single web app + DB)
- **Anti-abstraction**: Use framework primitives (no wrapper libraries)
- **Integration-first testing**: Contract tests before implementation

## Target Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: Prisma + PostgreSQL
- **Auth**: Auth.js (NextAuth)
- **Maps**: Leaflet + OpenStreetMap tiles
- **Styling**: Tailwind CSS

## Architecture Overview

### Web App
- **SSR Pages**: Home, city hub, place detail, auth views
- **API Routes**: RESTful endpoints for data operations
- **Client Components**: Interactive map, filters, favorites

### API Routes
```
/api/cities                    # List active cities
/api/{city}/places            # Filtered places with pagination
/api/{city}/places/{slug}     # Place detail by slug
/api/user/favorites           # User favorites management
/api/admin/ingest*            # CSV upload and processing
/api/auth/*                   # Authentication endpoints
```

### Database Schema
- **Entities**: City, Place, User, Favorite
- **Indices**: Place(cityId), Place(type), full-text search
- **Relationships**: Place belongs to City, User has many Favorites

## Data Mapping (CSV → Database)

### CSV Fields → Database Fields
```
name → Place.name
type → Place.type
city → City.slug/name (auto-create if missing)
region → Place.region
country → Place.country
latitude/longitude → Place.lat/lng
short_description → Place.shortDescription
full_description → Place.fullDescription
image_url → Place.imageUrl
gallery_urls → Place.gallery[] (semicolon separated)
dog_friendly_level → Place.dogFriendlyLevel
amenities → Place.amenities[] (comma separated)
rules → Place.rules
website_url → Place.websiteUrl
contact_phone → Place.phone
contact_email → Place.email
price_range → Place.priceRange
opening_hours → Place.openingHours
rating → Place.rating
tags → Place.tags[] (comma separated)
```

### Slug Generation Policy
- **City slug**: Lowercased city column (spaces → hyphens, non-alnums stripped)
- **Place slug**: Slugify(name); remains stable across updates
- **ID generation**: UUIDv5 from (name|city|country|lat|lng) if CSV id missing

## Routing & UI Structure

### Public Routes
```
/                    # Home with city selector
/[city]              # City hub (list + map)
/[city]/p/[slug]     # Place detail page
/login               # Authentication
/signup              # User registration
/account             # User profile & favorites
```

### Admin Routes
```
/admin               # Admin dashboard
/admin/ingest        # CSV upload interface
/admin/places        # Places management
/admin/users         # User role management
```

### UI Components
- **Header**: Logo, city selector, search, user menu
- **City Hub**: Filter bar, results list, interactive map
- **Place Detail**: Hero image, gallery, info sections, map
- **Admin Panel**: Upload forms, validation reports, management tables

## Security & Roles

### User Roles
- **user** (default): Browse, favorites, basic features
- **editor**: + CSV ingest, place editing
- **admin**: + User management, site settings

### Security Measures
- **Authentication**: JWT sessions with secure cookies
- **Authorization**: Role-based access control on API routes
- **Input Validation**: Zod schemas for all inputs
- **Data Sanitization**: Strip unknown fields, escape outputs
- **Rate Limiting**: Sensitive endpoints protected

### Route Protection
- Ingest routes require `editor` or `admin` role
- Favorites require authenticated user
- Admin routes require `admin` role

## Performance Optimizations

### Database
- **Indices**: Place(cityId), Place(type), full-text search
- **Query Optimization**: Efficient joins and filtering
- **Pagination**: Ready for large datasets (MVP: 50 items)

### Frontend
- **Lazy Loading**: Map component, heavy images
- **Image Optimization**: Next.js Image component with responsive sizes
- **SSR**: Server-side rendering for SEO and initial load
- **Code Splitting**: Route-based and component-based splitting

### Caching Strategy
- **ISR**: Incremental static regeneration for public pages
- **API Caching**: Appropriate cache headers for data endpoints
- **Browser Caching**: Static assets and images

## Accessibility (WCAG 2.2 AA)

### Navigation
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Focus Management**: Clear focus indicators and logical tab order
- **Screen Reader**: Semantic HTML, ARIA labels where needed

### Content
- **Alt Text**: Descriptive alt attributes for all images
- **Color Contrast**: AA compliance for text and interactive elements
- **Text Alternatives**: Icons with screen reader text

### Interactive Elements
- **Form Labels**: All inputs properly labeled
- **Error Messages**: Clear, accessible error announcements
- **Map Accessibility**: Keyboard navigation, screen reader descriptions

## Testing Strategy (Integration-First)

### Contract Tests
- **API Contracts**: Request/response specifications in `/contracts/`
- **Database Contracts**: Schema and data validation
- **Integration Tests**: Real database, external services mocked

### End-to-End Tests
- **City Flow**: Browse cities → filter places → view details
- **Authentication**: Login/signup → favorites → logout
- **Admin Flow**: CSV upload → validation → publish
- **Accessibility**: Automated accessibility audits

### Unit Tests
- **Utilities**: Slug generation, CSV parsing, validation
- **Components**: UI component behavior and interactions
- **Business Logic**: Favorite toggling, filter application

## Deployment Architecture

### Single Runtime
- **Web App**: Next.js handles both API routes and SSR pages
- **Database**: Managed PostgreSQL service
- **Storage**: S3-compatible for user uploads (future)

### Environment Configuration
```bash
DATABASE_URL=postgres://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MAP_TILES_URL=https://...
```

### Build & Deploy
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Preview**: Pull request previews
- **Production**: Optimized builds with static generation where possible

## Observability & Monitoring

### Logging
- **Structured Logs**: JSON format with consistent fields
- **Error Tracking**: Sentry integration for production errors
- **Performance Monitoring**: Core Web Vitals tracking

### Health Checks
- **API Health**: `/api/health` endpoint
- **Database Health**: Connection and query performance
- **External Services**: Map tiles, OAuth providers

### Metrics
- **User Analytics**: Page views, user journeys
- **Performance**: Load times, error rates
- **Business**: Place views, favorite actions, CSV uploads

## Phase -1 Constitutional Gates

### Simplicity Gate (≤3 deployables)
**Status**: ✅ PASSED
- Single web application + PostgreSQL database
- No microservices or complex deployment topology

### Anti-Abstraction Gate
**Status**: ✅ PASSED
- Using Next.js App Router primitives
- Auth.js without custom wrappers
- Prisma ORM without additional abstraction layers
- Framework-native solutions preferred

### Integration-First Gate
**Status**: ✅ PASSED
- Contract tests defined before implementation
- API specifications completed
- Database schema designed
- Integration test suite planned

### Complexity Tracking
If any gate fails during implementation, document in:
`/specs/001-dogatlas/complexity-tracking.md`

---

**Plan Version**: 1.0
**Created**: 2025-09-19
**Last Updated**: 2025-09-19
**Status**: Ready for Implementation