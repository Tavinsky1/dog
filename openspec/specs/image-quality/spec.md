# Image Quality Standards

**Status:** Active  
**Created:** 2025-10-15  
**Last Updated:** 2025-10-15

## Overview

This specification defines MANDATORY requirements for place images in the Dog Atlas application. These standards exist to prevent regression to generic placeholder images.

## Critical Rules

### ⛔ NEVER ALLOWED

The following image sources are **PERMANENTLY BANNED** from production:

1. **Lorem Picsum** (`picsum.photos/*`)
   - Generic placeholder images
   - Not location-specific
   - Banned since 2025-10-15

2. **Unsplash Source API** (`source.unsplash.com/*`)
   - Deprecated by Unsplash
   - Returns 503 errors
   - Banned since 2025-10-15

3. **Generic stock photos** without location context
   - Images that don't represent the actual place
   - Random dog/park/cafe photos

### ✅ APPROVED IMAGE SOURCES

Images MUST come from one of these sources:

1. **Unsplash Direct Photo URLs** (RECOMMENDED)
   - Format: `https://images.unsplash.com/photo-{photoId}?w=800&h=600&fit=crop&q=80`
   - Stable, curated photos with specific IDs
   - Type-specific photo selections (parks, cafes, trails, etc.)
   - Currently implemented in `scripts/fetch_real_images_unsplash.ts`

2. **Pexels API** (FUTURE)
   - Format: API response URLs
   - Free tier: 200 requests/hour
   - Requires API key: https://www.pexels.com/api/
   - Search-based, returns location-specific results

3. **Google Places API Photos** (FUTURE)
   - Official place photos from Google Maps
   - Most accurate representation
   - Requires Google Cloud API key

4. **Web Scraping from Place Websites** (ADVANCED)
   - Script exists: `scripts/fetch_place_images.ts`
   - Extracts OpenGraph images from place websites
   - Fallback when other sources fail

## Image Requirements

### Quality Standards

- **Minimum dimensions:** 800x600px
- **Aspect ratio:** 4:3 or 16:9 (landscape preferred)
- **Format:** JPEG or WebP
- **Quality:** High resolution, not pixelated
- **CDN:** Must use stable CDN URLs (Unsplash, Pexels, etc.)

### Content Standards

Images MUST be:
- ✅ **Location-specific:** Represents the actual place or similar places in the same city
- ✅ **Type-appropriate:** Matches the place type (park shows parks, cafe shows cafes)
- ✅ **High-quality:** Professional or semi-professional photography
- ✅ **Relevant:** Shows outdoor spaces, dog-friendly environments

Images MUST NOT be:
- ❌ **Generic placeholders:** Lorem Picsum, placeholder.com, etc.
- ❌ **Random stock:** Unrelated photos without context
- ❌ **Broken links:** 404s, 503s, or expired URLs
- ❌ **Low quality:** Pixelated, blurry, or amateur photos

## Implementation

### Current Implementation

File: `scripts/fetch_real_images_unsplash.ts`

This script:
1. Uses curated Unsplash photo IDs organized by place type
2. Assigns photos based on type (parks get park photos, cafes get cafe photos)
3. Uses stable Unsplash CDN URLs with specific photo IDs
4. Does NOT use deprecated source.unsplash.com API

**Photo ID Collections:**
- Parks: 5 curated photo IDs of beautiful parks
- Cafes/Restaurants: 5 curated photo IDs of outdoor cafes
- Trails: 5 curated photo IDs of walking paths
- Shops: 5 curated photo IDs of storefronts
- Accommodation: 5 curated photo IDs of hotels
- Tips: 5 curated photo IDs of city landmarks

### Future Improvements

1. **Pexels Integration** (Priority: High)
   ```typescript
   // Use Pexels API for location-specific search
   const query = `${placeName} ${cityName}`;
   const response = await axios.get('https://api.pexels.com/v1/search', {
     params: { query, per_page: 1 },
     headers: { 'Authorization': PEXELS_API_KEY }
   });
   ```

2. **Google Places Photos** (Priority: Medium)
   ```typescript
   // Use Google Places API for official photos
   const placeId = await getGooglePlaceId(placeName, cityName);
   const photoUrl = await getPlacePhoto(placeId);
   ```

3. **Web Scraping Fallback** (Priority: Low)
   ```typescript
   // Scrape OpenGraph images from place websites
   if (place.websiteUrl) {
     const imageUrl = await fetchImageFromWebsite(place.websiteUrl);
   }
   ```

## Monitoring & Maintenance

### Validation Checklist

Before deploying ANY changes to place images:

1. ✅ Verify NO Lorem Picsum URLs in database
2. ✅ Verify NO source.unsplash.com URLs
3. ✅ Check 5 random places render images correctly
4. ✅ Verify images are location/type-appropriate
5. ✅ Test image loading speed (< 2 seconds)

### Database Query for Validation

```sql
-- Check for banned image sources
SELECT 
  name, 
  imageUrl 
FROM Place 
WHERE 
  imageUrl LIKE '%picsum.photos%' OR 
  imageUrl LIKE '%source.unsplash.com%'
LIMIT 10;
```

Expected result: **0 rows** (no banned sources)

### Script to Run After Any Image Update

```bash
# Always run this after updating images
npx tsx scripts/fetch_real_images_unsplash.ts

# Then verify
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Place WHERE imageUrl LIKE '%images.unsplash.com%';"
# Should return: 269 (or total place count)
```

## Historical Context

### Why This Spec Exists

**October 2025 Crisis:**

1. Initial state: Places had location-specific Unsplash images via `source.unsplash.com`
2. **BUG:** Unsplash deprecated `source.unsplash.com` (started returning 503 errors)
3. **WRONG FIX:** Agent replaced with Lorem Picsum generic placeholders
4. **USER COMPLAINT:** "wtf?! we did 100 steps backwards!!!"
5. **CORRECT FIX:** Created this spec + script using stable Unsplash direct photo URLs

### Lesson Learned

**NEVER use generic placeholders as a "fix" for broken image URLs.**

When image sources break:
1. ✅ Find stable alternative with real photos
2. ✅ Use curated photo IDs or search APIs
3. ❌ DON'T use Lorem Picsum or random placeholders

## References

- [Unsplash Developer Documentation](https://unsplash.com/developers)
- [Pexels API Documentation](https://www.pexels.com/api/)
- [Google Places Photos API](https://developers.google.com/maps/documentation/places/web-service/photos)
- Implementation: `scripts/fetch_real_images_unsplash.ts`
- Database schema: `prisma/schema.prisma` (Place.imageUrl field)

## Enforcement

This specification is **MANDATORY** for all AI agents and developers working on Dog Atlas.

Any PR or change that:
- Uses Lorem Picsum URLs
- Uses source.unsplash.com URLs
- Uses generic non-location-specific images

**MUST BE REJECTED** immediately with reference to this spec.
