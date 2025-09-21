# DOGGYWORLD Quickstart Validation

## Overview
This document provides validation scenarios to verify DOGGYWORLD implementation meets specifications. Run these checks after implementation to ensure all features work correctly.

## Prerequisites
- PostgreSQL database running locally
- Environment variables configured (.env.local)
- Sample data seeded (at least 1 city with 2-3 places)
- Development server running on http://localhost:3000

## Validation Scenarios

### 1. City Flow
**Goal:** Verify basic navigation and city browsing works.

**Steps:**
1. Visit http://localhost:3000
2. Should see DOGGYWORLD title and description
3. Click on a city link or navigate to /paris (assuming seeded data)
4. Should see city name, map with markers, and place list
5. Click on a place card
6. Should navigate to place detail page

**Success Criteria:**
- [ ] Home page loads without errors
- [ ] City page shows map with place markers
- [ ] Place list displays correctly
- [ ] Navigation between pages works
- [ ] No console errors

### 2. Place Detail
**Goal:** Verify place information displays correctly.

**Steps:**
1. Navigate to a city page (/paris)
2. Click on any place in the list
3. Verify detail page shows:
   - Place name and city
   - Full description
   - Map with single marker
   - Dog-friendly level, amenities, rules
   - Contact information and website
   - Gallery images (if available)

**Success Criteria:**
- [ ] All place fields display correctly
- [ ] Map centers on place location
- [ ] Images load (or show placeholders)
- [ ] Back navigation works

### 3. Authentication & Favorites
**Goal:** Verify user authentication and favorites functionality.

**Steps:**
1. Visit /signup
2. Create account with email/password
3. Verify redirect to login or auto-login
4. Visit /login if needed
5. Log in with created credentials
6. Navigate to a city page
7. Click favorite button on a place
8. Verify favorite indicator changes
9. Navigate to another page and back
10. Verify favorite persists
11. Check /api/user/favorites returns favorited place

**Success Criteria:**
- [ ] Signup creates account successfully
- [ ] Login works with correct credentials
- [ ] Favorites can be added/removed
- [ ] Favorites persist across navigation
- [ ] API returns correct favorite data

### 4. CSV Validate/Apply
**Goal:** Verify CSV ingestion workflow.

**Steps:**
1. Log in as editor/admin user
2. Visit /admin/ingest
3. Upload a valid CSV file (matching v0.7 spec)
4. Verify validation response shows:
   - Total rows count
   - Valid rows count
   - No errors for valid data
   - Preview of first 100 rows
5. Click "Apply" or use API to apply data
6. Verify places appear in city listings
7. Test with invalid CSV (missing required fields)
8. Verify validation catches errors

**Success Criteria:**
- [ ] Valid CSV validates without errors
- [ ] Invalid CSV shows specific validation errors
- [ ] Apply successfully imports data
- [ ] Imported places appear in UI
- [ ] No duplicate or corrupted data

### 5. Accessibility
**Goal:** Verify basic accessibility compliance.

**Steps:**
1. Use keyboard navigation (Tab, Enter, Arrow keys)
2. Verify focus indicators are visible
3. Test with screen reader (NVDA, JAWS, or VoiceOver)
4. Check color contrast with browser dev tools
5. Verify alt text on images
6. Test form labels and error messages

**Success Criteria:**
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader can navigate and read content
- [ ] Color contrast meets WCAG AA standards
- [ ] Form validation errors announced

### 6. Performance
**Goal:** Verify performance meets targets.

**Steps:**
1. Use browser dev tools network tab
2. Check Lighthouse scores
3. Measure page load times
4. Test on simulated slow 3G connection
5. Verify map loads within 3 seconds
6. Check for unnecessary re-renders

**Success Criteria:**
- [ ] Lighthouse performance score > 80
- [ ] LCP < 2.5s on simulated mobile
- [ ] Map renders within 3 seconds
- [ ] No 404s or failed asset loads

## Automated Testing
Run the following commands to validate:

```bash
# Unit tests
npm run test

# E2E tests (if implemented)
npm run test:e2e

# Build check
npm run build

# Lint check
npm run lint
```

## Troubleshooting
- **Database connection issues:** Check DATABASE_URL in .env.local
- **Auth issues:** Verify NEXTAUTH_SECRET and NEXTAUTH_URL
- **Map not loading:** Check NEXT_PUBLIC_MAP_TILES_URL
- **CSV errors:** Validate CSV format matches v0.7 spec exactly
- **Performance issues:** Check database indexes and query optimization

## Success Checklist
- [ ] All 6 scenarios pass manually
- [ ] Automated tests pass (if implemented)
- [ ] Build completes without errors
- [ ] No lint errors
- [ ] Performance targets met
- [ ] Accessibility requirements satisfied