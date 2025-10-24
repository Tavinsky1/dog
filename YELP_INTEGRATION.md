# Yelp API Integration

## Overview

This feature allows admins to search and import dog-friendly places from Yelp's database into Dog Atlas.

## Features

- ✅ Search for dog-friendly businesses by city
- ✅ Filter by category (parks, cafés, hotels, etc.)
- ✅ View Yelp ratings, reviews, and photos
- ✅ One-click import to Dog Atlas database
- ✅ Automatic de-duplication
- ✅ 500 free API calls per day

## Setup Instructions

### 1. Get a Yelp API Key (FREE)

1. Go to https://www.yelp.com/developers
2. Click "Get Started" or "Create App"
3. Log in or create a Yelp account
4. Fill out the application form:
   - **App Name**: Dog Atlas
   - **Industry**: Travel & Hospitality
   - **Contact Email**: your-email@example.com
   - **Description**: "Dog-friendly place discovery platform"
5. Agree to terms and submit
6. You'll receive your **API Key** immediately

### 2. Add API Key to Environment Variables

#### Local Development:

Add to `.env.local`:
```bash
YELP_API_KEY=your_api_key_here
```

#### Production (Vercel):

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `YELP_API_KEY`
   - **Value**: your_api_key_here
   - **Environments**: Production, Preview, Development
4. Redeploy your app

### 3. Restart Development Server

```bash
npm run dev
```

## Usage

### Admin Dashboard

1. Go to `/admin` (requires ADMIN role)
2. Click "Yelp Import" card
3. Enter a city name (e.g., "Paris, France")
4. Select a category (optional)
5. Click "Search Yelp"
6. Review results and click "Import" for places you want to add

### API Endpoints

#### Search Places
```
GET /api/admin/yelp?city=Paris&category=parks
```

Response:
```json
{
  "businesses": [
    {
      "id": "yelp-business-id",
      "name": "Parc des Buttes-Chaumont",
      "rating": 4.5,
      "review_count": 234,
      "location": { "city": "Paris" }
    }
  ],
  "total": 50,
  "message": "Found 50 dog-friendly places in Paris"
}
```

#### Import a Place
```
POST /api/admin/yelp
Content-Type: application/json

{
  "businessId": "yelp-business-id",
  "cityId": "city-uuid-from-database"
}
```

## Rate Limits

- **Free Tier**: 500 API calls per day
- **Resets**: Daily at midnight PST
- **Monitored**: No automatic warnings when approaching limit
- **Recommendation**: Track usage manually if importing many places

## Data Mapping

Yelp → Dog Atlas:
- **Name**: Direct copy
- **Type**: Auto-detected from Yelp categories
- **Rating**: Yelp rating (1-5 stars)
- **Reviews**: Count from Yelp
- **Photos**: First image + gallery if available
- **Location**: Lat/lng coordinates
- **Phone**: Business phone number
- **Website**: Links to Yelp page
- **Source**: Tagged as "yelp" for attribution

## Category Mapping

| Dog Atlas | Yelp Categories |
|-----------|----------------|
| parks | dog_parks, parks |
| cafes_restaurants | restaurants, cafes, bars |
| accommodation | hotels, bedbreakfast, vacation_rentals |
| shops_services | petservices, pet_stores, veterinarians |
| walks_trails | hiking, beaches |

## De-duplication

The system automatically checks for duplicates based on:
- Same name
- Coordinates within ~100m radius

If a duplicate is found, import will be rejected with a warning.

## Troubleshooting

### "YELP_API_KEY is not configured"
- Ensure `.env.local` has the API key
- Restart dev server after adding key
- Check for typos in variable name

### "API Error: Unauthorized"
- API key is invalid
- Regenerate key at https://www.yelp.com/developers

### "City not found in database"
- The city must exist in Dog Atlas first
- Create the city before importing places
- Use exact city name when searching

### "Place already exists"
- A place with same name and location exists
- Check database to avoid duplicates
- Edit existing place instead of importing

## Best Practices

1. **Start with one city**: Test with a small city first
2. **Review before importing**: Check Yelp data quality
3. **Monitor API usage**: Track calls to stay within 500/day limit
4. **Verify imports**: Check imported places on site
5. **Add manual improvements**: Enhance Yelp data with local knowledge

## Files Modified

```
src/lib/yelp.ts                      - Yelp API client
src/app/api/admin/yelp/route.ts     - API endpoints
src/app/admin/yelp-import/page.tsx  - Admin UI
```

## Future Enhancements

- [ ] Batch import multiple places
- [ ] Auto-update existing places with fresh Yelp data
- [ ] Show API usage counter
- [ ] Export Yelp data to CSV before importing
- [ ] Schedule automatic updates for imported places
