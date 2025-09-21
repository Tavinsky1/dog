# Quickstart Validation Scenarios

## City Flow

**Given** an active city "paris" with ≥ 1 place  
**When** navigating to `/paris`  
**Then** the list renders ≤50 items, filters operate via querystring, and the map shows markers.

## Place Detail

**Given** the URL `/paris/p/bois-de-boulogne-trail`  
**Then** the page shows hero image, descriptions, rules, amenities, contacts, and rating if present.

## Auth + Favorites

**Given** a verified account  
**When** POST `/api/user/favorites` with `placeId`  
**Then** the favorites list includes it; POST again removes it.

## CSV Validate

**Given** a CSV with 10 rows where 2 are invalid  
**When** POST `/api/admin/ingest`  
**Then** the summary shows `total: 10`, `valid: 8`, and `errors: [2 items]`.

## CSV Apply

**Given** a validated CSV with new city "barcelona"  
**When** POST apply  
**Then** City("barcelona") is created and Places are upserted.

## Accessibility

**Given** Axe core testing on `/`, `/{city}`, and `/{city}/p/{slug}`  
**Then** no critical issues are found.