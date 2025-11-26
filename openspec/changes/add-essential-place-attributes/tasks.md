# Tasks: Add Essential Place Attributes

## 1. Database Schema Update
- [x] 1.1 Add `DogSizeAllowed` enum to Prisma schema
- [x] 1.2 Add new optional fields to `Place` model
- [x] 1.3 Create and run database migration
- [x] 1.4 Update Prisma client types

## 2. API Updates
- [x] 2.1 Update `/api/[city]/places` to accept filter query params
- [x] 2.2 Add filter logic for new attributes
- [x] 2.3 Update place detail response to include new fields

## 3. UI Components
- [x] 3.1 Create `PlaceBadges` component for displaying attribute icons
- [x] 3.2 Update `PlaceCard` to show key badges (water bowl, off-leash, outdoor)
- [x] 3.3 Update place detail page sidebar with new attributes section

## 4. Filter UI
- [x] 4.1 Create filter chip components for city/category pages
- [x] 4.2 Add dog size filter dropdown
- [x] 4.3 Add toggle filters for boolean attributes
- [x] 4.4 Connect filters to API query params

## 5. Admin/Data Management
- [ ] 5.1 Update CSV import script to handle new fields
- [ ] 5.2 Add fields to admin place edit form (if exists)

## 6. Testing & Validation
- [x] 6.1 Test migration on dev database
- [x] 6.2 Verify backward compatibility with existing places
- [ ] 6.3 Test filter combinations
- [ ] 6.4 Verify UI displays correctly with null values

## 7. Documentation
- [ ] 7.1 Update API documentation
- [ ] 7.2 Update data import CSV template
