# Project Context

## Purpose
DogAtlas is a comprehensive multi-city platform for dog owners to discover, review, and share information about dog-friendly places and services. The platform helps guardians quickly find dog-friendly places (trails, parks, cafés, services, activities) in supported cities with trustworthy, filterable results and clear rules/amenities per location.

## Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js with email/password and Google OAuth
- **Maps**: MapLibre GL for location visualization
- **Deployment**: Vercel with PostgreSQL hosting
- **Development**: Node.js, npm, ESLint, Prettier

## Project Conventions

### Code Style
- TypeScript strict mode enabled
- ESLint with Next.js recommended rules
- Prettier for code formatting
- Component naming: PascalCase for React components
- File naming: kebab-case for files, camelCase for variables/functions
- Import organization: React imports first, then third-party, then local

### Architecture Patterns
- **Component Structure**: Feature-based organization in `/src/components`
- **API Routes**: RESTful endpoints in `/src/app/api/*`
- **Database**: Prisma schema-first approach with migrations
- **State Management**: React hooks and context for client state
- **File Storage**: Local public directory for images (Vercel hosting)

### Testing Strategy
- **Unit Tests**: Vitest for component and utility testing
- **Integration Tests**: API route testing with test database
- **E2E Tests**: Playwright for critical user journeys
- **Test Coverage**: Aim for 80%+ coverage on critical paths

### Git Workflow
- **Main Branch**: `master` for production deployments
- **Feature Branches**: `feature/*` or numbered branches like `001-implementation-planning`
- **Commit Messages**: Descriptive, imperative mood ("Add feature" not "Added feature")
- **PR Reviews**: Required for all changes to master

## Domain Context
DogAtlas serves dog owners and their pets in major European cities. Key domain concepts:
- **Places**: Physical locations (parks, cafes, vets, hotels) with dog-specific attributes
- **Categories**: Hierarchical organization (parks, cafes, veterinary services, etc.)
- **Cities**: Geographic scope (Berlin, Barcelona, Paris, Rome)
- **Reviews**: User-generated feedback with ratings and photos
- **Dog Rules**: Leash requirements, off-leash areas, breed restrictions

## Important Constraints
- **Multi-city Support**: Must handle different languages, regulations, and cultures
- **Real-time Data**: Places and reviews need to be current and accurate
- **Mobile-First**: Responsive design for on-the-go dog owners
- **Performance**: Fast loading for map-heavy interfaces
- **Data Privacy**: GDPR compliance for EU users

## External Dependencies
- **Google OAuth**: User authentication
- **Vercel Postgres**: Database hosting
- **MapLibre**: Open-source mapping
- **Unsplash API**: Fallback images (rate-limited)
- **Tourism APIs**: Official city tourism websites for place data
