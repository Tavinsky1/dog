# DogAtlas — multi-city dog-friendly places directory & maps

## Overview
**Status**: Draft v0.7
**Owner**: @product
**Intent**: Help guardians quickly find dog-friendly places (trails, parks, cafés, services, activities) in supported cities.
**Primary artifacts**: CSV v0.7 content layer; public web app; editor ingest tools; auth for favorites.

## Problem & Outcomes

People waste time guessing which places welcome dogs, what rules apply, and which amenities exist. DogAtlas solves this by offering trustworthy, filterable results and clear rules/amenities per city.

### Success Metrics
- First-visit search to saved place ≤ 60s median
- ≥ 70% sessions use filters or map
- Content updates via CSV ingest without breaking schema

## Scope (MVP)

### In Scope
- Home → City selection → City hub (list + map) → Place detail
- Auth: email/password + Google OAuth with email verification and password reset
- Favorites (private lists)
- CSV ingest UI: validate → apply upserts (v0.7 schema)
- Cities: Paris, Berlin, Rome, Barcelona as initial examples
- English UI; content language per row (optional field deferred)

### Out of Scope
- Public reviews/ratings input (read-only rating allowed from CSV)
- Payments, bookings
- Native apps
- Offline mode

## Users & Stories

### Visitor
- Find a city and browse dog-friendly places with filters (type/amenities/tags)
- View clear rules (leash/off-leash), amenities, hours, contacts
- See map with markers and open detail pages

### Authenticated User
- Log in/sign up, manage account
- Save/unsave favorites; see favorites list

### Editor
- Upload CSV; validate against schema; see error report
- Publish (upsert) valid rows atomically

### Admin
- Manage editor roles; toggle city active; feature places (future)

## Functional Requirements (Testable)

### City Routing
- `/{city}` renders active city or 404 for inactive

### Search & Filters
- Type, query text, min dog-friendly level, amenities, tags
- Returns ≤ 50 items sorted by name

### Place Detail
- Displays name, type, city/country, geo, descriptions, rules, amenities, opening hours, contacts, rating, tags, hero image, gallery

### Authentication
- Email/password and Google OAuth
- Email verification and password reset

### Favorites
- Toggle favorite; idempotent; list user favorites

### CSV Ingest
- Validate endpoint returns summary `{total, valid, errors[]}`
- Apply endpoint upserts rows
- City created if missing (slug from row.city)

### Images
- Support remote image URLs
- Basic Next/Image rendering

### Accessibility
- Keyboard navigation; alt text for images; color-contrast ≥ AA

### Performance
- Largest Contentful Paint ≤ 2.5s p75 on mid-tier mobile for city page at 3G Fast

### Security
- Role-gated ingest; OWASP top 10 mitigations; auth session JWT ttl default

## Non-Functional Requirements

### UI/UX
- Mobile-first responsive design
- Server-side rendering for SEO
- Map loads client-side

### Technical
- Postgres persistence
- Prisma ORM
- Error budgets & structured logs

## Data Contract (CSV v0.7)

### Columns (all lower_snake_case)
```
id,name,type,city,region,country,latitude,longitude,short_description,full_description,image_url,gallery_urls,dog_friendly_level,amenities,rules,website_url,contact_phone,contact_email,price_range,opening_hours,rating,tags
```

### Validation Rules
- `id` optional; if empty, deterministic UUIDv5 from `name|city|country|lat|lng`
- `type` ∈ `{trail, park, cafe, vet, grooming, activity, beach, hotel, store, event}`
- `gallery_urls` semicolon `;` separated
- `amenities` and `tags` comma `,` separated
- `latitude` ∈ `[-90, 90]`, `longitude` ∈ `[-180, 180]`
- Strings trimmed; empty becomes null unless noted

## Open Questions / Clarifications

### [NEEDS CLARIFICATION] Favorites visibility
Private only (MVP) or shareable lists?

### [NEEDS CLARIFICATION] Image hosting
Stay remote-URL only (MVP) or S3 upload for editors?

### [NEEDS CLARIFICATION] i18n
City names localized or English?

### [NEEDS CLARIFICATION] Marketing pages
Separate CMS?

**All unresolved markers must be cleared before tag `spec:ready`.**

## Acceptance Criteria (High-level)

### CSV Ingest
Given a valid CSV, when an editor validates, then response shows per-row errors and valid count; when applying, DB changes reflect rows (upsert).

### Favorites
Given a user is logged in, when they toggle favorite, the state persists and idempotency holds on repeated toggles.

### City Navigation
Given a city exists and is active, `/{city}` shows list+map with ≤ 50 results and filters applied in the querystring.

### Accessibility
Axe core audit shows no critical accessibility issues on top 3 pages.

---

**Spec Version**: 0.7
**Created**: 2025-09-19
**Last Updated**: 2025-09-19
**Status**: Draft