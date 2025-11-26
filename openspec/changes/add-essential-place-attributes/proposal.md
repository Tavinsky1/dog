# Proposal: Add Essential Place Attributes

**Change ID:** `add-essential-place-attributes`  
**Status:** Implemented  
**Created:** 2025-11-26  
**Completed:** 2025-11-26  
**Author:** AI Assistant  
**Branch:** `feature/enhance-place-details`  

---

## Why

Dog owners need **critical information** before visiting a place that the current schema doesn't capture. Without this data, users must call ahead or guess—defeating the purpose of DogAtlas. These attributes are **standard in competitors** like BringFido and expected by users.

**Problem Statement:**
- Users can't filter by dog size (Great Dane vs Chihuahua needs)
- No indication if water/bowls are provided
- No leash policy clarity (off-leash allowed?)
- No pet fee information for accommodations/cafes
- No indication if outdoor seating is available (critical for restaurants)

---

## What Changes

### Database Schema (Non-Breaking)
Add **optional** fields to the `Place` model:

| Field | Type | Purpose |
|-------|------|---------|
| `dogSizeAllowed` | Enum | `all`, `small_only`, `small_medium`, `large_ok` |
| `hasWaterBowl` | Boolean | Water provided for dogs |
| `offLeashAllowed` | Boolean | Dogs can be off-leash |
| `hasOutdoorSeating` | Boolean | Outdoor/patio seating (cafes/restaurants) |
| `petFee` | String? | Fee info like "€15/night" or "Free" |
| `maxDogsAllowed` | Int? | Maximum number of dogs permitted |

### UI Updates
- Add filter chips on city/category pages
- Display badges on PlaceCard component
- Show details in place detail page sidebar

### API Updates
- Extend `/api/[city]/places` with filter query params
- Update place detail endpoint response

---

## Impact

### Affected Specs
- `places` capability (to be created)

### Affected Code
- `prisma/schema.prisma` - Add new fields
- `src/components/PlaceCard.tsx` - Add badges
- `src/app/[city]/page.tsx` - Add filter UI
- `src/app/api/[city]/places/route.ts` - Add filter params

### Migration
- **Non-breaking**: All new fields are optional with defaults
- **Data population**: Existing places will have `null` values; can be enriched over time via admin UI or CSV import

### Risk Assessment
- **Low risk**: No breaking changes, purely additive
- **Data quality**: New places should have these fields filled; existing data remains valid

---

## Success Criteria

1. Users can filter places by dog size allowed
2. Place cards show visual badges for key attributes
3. Place detail pages display all new attributes
4. Existing data continues to work (backward compatible)
5. Admin can update these fields via existing CSV ingest

---

## Alternatives Considered

1. **Store in JSON `amenities` field**: Rejected—not queryable, inconsistent structure
2. **Separate `PlaceAttribute` table**: Rejected—over-engineering for 6 fields
3. **Do nothing**: Rejected—core user need not met

---

## Approval

- [ ] Product review
- [ ] Technical review
- [ ] Ready for implementation
