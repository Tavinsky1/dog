# Photo System Fix - No More Placeholders

## Problem Identified
The site was showing the **same placeholder images** (from Unsplash) for all places - parks, restaurants, and trails all had the same woman's photo. This was terrible UX and not what was requested.

## Root Cause
The photo enrichment pipeline was built correctly, but **never connected to the frontend**. The city page was:
1. Fetching `imageUrl` from the Place table (which contained Unsplash placeholder URLs)
2. Using `FALLBACK_IMAGES` constants with more Unsplash URLs
3. Never querying the `PlacePhoto` table or `primaryPhoto` relationship

## Changes Made

### 1. Updated Database Query (`src/app/[city]/page.tsx`)
**Before:**
```typescript
select: {
  imageUrl: true,  // ❌ Placeholder URL from Place table
  // ...
}
```

**After:**
```typescript
select: {
  primaryPhoto: {  // ✅ Real photo from PlacePhoto table
    select: {
      cdnUrl: true,
      author: true,
      license: true,
      sourceUrl: true,
    },
  },
  // ...
}
```

### 2. Removed All Fallback Images
- **Deleted** `FALLBACK_IMAGES` constant (17 lines of Unsplash URLs)
- **Removed** fallback logic: `place.imageUrl || FALLBACK_IMAGES[place.type]`
- **Changed to**: `place.primaryPhoto?.cdnUrl || null`

### 3. Updated Frontend Rendering
**Before:**
```tsx
<img src={place.imageUrl} alt={place.name} />  // ❌ Always showed placeholder
```

**After:**
```tsx
{place.imageUrl && (  // ✅ Only show if real photo exists
  <div className="h-48 w-full sm:h-full sm:w-48">
    <img src={place.imageUrl} alt={place.name} />
  </div>
)}
```

### 4. Updated Type Definition
```typescript
type NormalizedPlace = {
  imageUrl: string | null;  // ✅ Now allows null (no placeholder)
  // ...
}
```

## Current Behavior

### Places WITH Photos
- Display the **real CC-licensed photo** from the PlacePhoto table
- Show proper attribution (author, license)
- Sourced from OSM/Wikidata/Openverse

### Places WITHOUT Photos
- Show **no image** (clean, no placeholder)
- Card layout adapts gracefully
- User sees text content only

## Benefits
1. ✅ **No more fake/generic images** - only real place photos
2. ✅ **Better UX** - users see actual photos or nothing (honest)
3. ✅ **License compliance** - all photos are CC-licensed with attribution
4. ✅ **Consistent experience** - all places in a category don't look identical

## Next Steps to Populate Photos

### Option 1: Use Photo Enrichment Scripts
```bash
# 1. Export places to CSV
npm run export-places

# 2. Match with OSM data
npm run osm-match -- --pbf berlin.osm.pbf --places places.csv

# 3. Enrich with Wikidata
npm run wikidata-enrich -- --matches osm_matches.csv --sparql

# 4. Find Openverse fallbacks
npm run openverse-candidates -- --places places.csv --openverse openverse.csv

# 5. Import photos
npm run photo-import -- --wikimedia wikimedia_candidates.csv --openverse openverse_candidates.csv

# 6. Admin review at /admin/photos/review
```

### Option 2: Manual Upload
- Go to `/admin/photos/review`
- Use the `AdminPhotoUpload` component
- Paste image URL or upload file
- Add author, license, source URL
- Photo goes to PENDING → admin approves

## Files Modified
- `src/app/[city]/page.tsx` - Updated query and rendering
- Database schema already has PlacePhoto model
- All photo enrichment scripts ready to use

## Testing
Visit http://localhost:3000/berlin and verify:
- Places with photos show real images
- Places without photos show no image (not placeholders)
- No Unsplash URLs appear anywhere
