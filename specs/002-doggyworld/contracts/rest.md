# REST API Contracts

## Overview
DOGGYWORLD provides RESTful APIs for cities, places, user favorites, and administrative data ingestion. All endpoints return JSON responses with consistent error handling.

## Authentication
- JWT-based authentication via NextAuth.js
- Bearer token in Authorization header
- Role-based access: user, editor, admin

## Common Response Formats

### Success Response
```typescript
{ ok: true, data: T }
```

### Error Response
```typescript
{
  error: string,           // Human-readable error message
  code?: string,           // Error code for programmatic handling
  details?: any           // Additional error details
}
```

### Pagination
```typescript
{
  items: T[],
  total: number,
  page?: number,
  limit?: number
}
```

## Endpoints

### GET /api/cities
Get all active cities.

**Auth:** None required
**Query Params:** None
**Response:**
```typescript
{
  items: Array<{
    id: string
    slug: string
    name: string
    country: string
  }>,
  total: number
}
```

### GET /api/[city]/places
Get places for a specific city with optional filtering.

**Auth:** None required
**Path Params:**
- city: string (city slug)

**Query Params:**
- type?: string (filter by place type)
- q?: string (text search in name/description)
- minLevel?: number (minimum dog-friendly level 1-5)
- limit?: number (default 50, max 100)

**Response:**
```typescript
{
  items: Array<{
    id: string
    slug: string
    name: string
    type: string
    lat: number
    lng: number
    shortDescription: string
    imageUrl?: string
    dogFriendlyLevel?: number
    tags: string[]
    cityId: string
  }>,
  total: number
}
```

### GET /api/[city]/places/[slug]
Get detailed information for a specific place.

**Auth:** None required
**Path Params:**
- city: string (city slug)
- slug: string (place slug)

**Response:**
```typescript
{
  id: string
  slug: string
  name: string
  type: string
  city: {
    id: string
    name: string
    country: string
  }
  region?: string
  country: string
  lat: number
  lng: number
  shortDescription: string
  fullDescription?: string
  imageUrl?: string
  gallery: string[]
  dogFriendlyLevel?: number
  amenities: string[]
  rules?: string
  websiteUrl?: string
  phone?: string
  email?: string
  priceRange?: string
  openingHours?: string
  rating?: number
  tags: string[]
  createdAt: string
  updatedAt: string
}
```

### GET /api/user/favorites
Get current user's favorite places.

**Auth:** Required (user role)
**Response:**
```typescript
Array<{
  id: string
  userId: string
  placeId: string
  place: {
    id: string
    slug: string
    name: string
    type: string
    lat: number
    lng: number
    shortDescription: string
    imageUrl?: string
    city: {
      slug: string
      name: string
    }
  }
}>
```

### POST /api/user/favorites
Add or remove a place from user favorites.

**Auth:** Required (user role)
**Body:**
```typescript
{ placeId: string }
```

**Response (add):**
```typescript
{ ok: true }
```

**Response (remove):**
```typescript
{ ok: true, removed: true }
```

### POST /api/admin/ingest
Validate CSV data for ingestion.

**Auth:** Required (editor/admin role)
**Content-Type:** multipart/form-data
**Body:** FormData with 'file' field containing CSV

**Response:**
```typescript
{
  summary: {
    total: number
    valid: number
    errors: Array<{
      row: number
      field?: string
      error: string
    }>
  },
  rows: Array<NormalizedRow>  // First 100 valid rows
}
```

### POST /api/admin/ingest/[jobId]/apply
Apply validated CSV data to database.

**Auth:** Required (editor/admin role)
**Path Params:**
- jobId: string (validation job identifier)

**Content-Type:** multipart/form-data
**Body:** FormData with 'file' field containing same CSV

**Response:**
```typescript
{
  ok: true,
  upserts: number  // Number of places created/updated
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Invalid request data |
| INTERNAL_ERROR | 500 | Server error |

## Rate Limiting
- Public endpoints: 100 requests/minute per IP
- Authenticated endpoints: 1000 requests/minute per user
- Admin endpoints: 50 requests/minute per user

## Caching
- City list: 5 minutes
- Place lists: 1 minute
- Place details: 5 minutes
- User favorites: No cache (personalized)

## Content Types
- Request: application/json (except file uploads)
- Response: application/json
- File uploads: multipart/form-data