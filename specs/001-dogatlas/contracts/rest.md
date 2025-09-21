# API Contracts

## GET /api/cities

- **Response 200**: Array of city objects
  - `{ id, slug, name, country }`

## GET /api/{city}/places

Query parameters: `type`, `q`, `minLevel`, `tags`, `amenities`

- **Response 200**: 
  - `{ items: PlaceDTO[], total: number }`
  - PlaceDTO (minimal list view): `{ id, slug, name, type, lat, lng, shortDescription, imageUrl, dogFriendlyLevel, tags }`
- **Response 404**: If city not found or inactive
  - `{ items: [], total: 0 }` (MVP)

## GET /api/{city}/places/{slug}

- **Response 200**: Full Place object + city details
  - `{ ...fullPlace, city: { slug, name } }`
- **Response 404**: Not found

## GET /api/user/favorites (auth required)

- **Response 200**: Array of Favorite objects
  - `Favorite[]` including `{ place }`
- **Response 401**: If unauthenticated

## POST /api/user/favorites (auth required)

Body: `{ placeId: string }`

- **Response 200**: 
  - `{ ok: true }` or `{ ok: true, removed: true }` (toggle behavior)
- **Response 401**: If unauthenticated

## POST /api/admin/ingest (editor/admin required)

FormData: `file: .csv`

- **Response 200**: 
  - `{ summary: { total, valid, errors: [{ row, error }] }, rows: [first 100 rows] }`
- **Response 403**: Forbidden

## POST /api/admin/ingest/{jobId}/apply (editor/admin required)

FormData: `file: .csv`

- **Response 200**: 
  - `{ ok: true, upserts: number }`

### Upsert Semantics

- If `id` exists → update
- Else → create with deterministic UUIDv5 from normalized fields
- Auto-upsert City by slug (from city field)