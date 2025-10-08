# Coordinates Fix Summary

## Problem
141 out of 166 places were missing latitude/longitude coordinates, preventing them from displaying on maps.

## Solution
Created and ran `scripts/fetch_coordinates.ts` to fetch coordinates for all places using the Google Places API (New).

## Results
✅ **166/166 places now have coordinates** (100% coverage)

### Statistics
- **Total places**: 166
- **Places fixed**: 141
- **Success rate**: 99.3% (140/141 via API)
- **Manual fixes**: 1 (VétoAdom mobile vet service)

### Breakdown by City
- **Barcelona**: 31 places - All with coordinates ✅
- **Berlin**: 39 places - All with coordinates ✅
- **Paris**: 60 places - All with coordinates ✅
- **Rome**: 36 places - All with coordinates ✅

## Implementation Details

### Script: `fetch_coordinates.ts`
- Uses Google Places API (New) text search
- Query format: `{place name} {city}`
- Rate limited to 5 requests per second
- Extracts `location.latitude` and `location.longitude` from API response
- Updates Place model with lat/lng values

### API Used
- **Google Places API (New)**: `https://places.googleapis.com/v1/places:searchText`
- **API Key**: AIzaSyD6kBUSUmSYYrLksTkW-NR-rNmSq3i4hoE
- **Field Mask**: `places.displayName,places.location`

### Manual Fix
- **VétoAdom (SOS Vétérinaires à Domicile)**: Mobile veterinary service - assigned Paris center coordinates (48.8566, 2.3522)

## Map Display
Places now correctly display on:
- Individual place detail pages (via `PlaceMap` component)
- City map pages (`/[city]/map`)
- Google Maps links ("Open in Maps" button)

## Files Modified
1. `/scripts/fetch_coordinates.ts` - New script for fetching coordinates
2. Database: Updated all Place records with lat/lng values

## Date
October 8, 2025

---

**Status**: ✅ Complete - All 166 places now have map locations
