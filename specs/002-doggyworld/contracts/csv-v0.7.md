# CSV v0.7 Contract

## Overview
DOGGYWORLD supports data ingestion via CSV files following the v0.7 specification. This contract defines the exact column structure, validation rules, and error handling for CSV imports.

## Column Specification

The CSV must contain exactly these columns in this order:

| Column | Type | Required | Validation | Description |
|--------|------|----------|------------|-------------|
| id | String | No | UUID format or auto-generated | Unique identifier (UUIDv5 fallback if missing) |
| name | String | Yes | 1-200 characters | Place name |
| type | String | Yes | Enum: trail, park, cafe, vet, grooming, activity, beach, hotel, store, event | Place category |
| city | String | Yes | 1-100 characters | City name (used for slug generation) |
| region | String | No | 1-100 characters | State/province/region |
| country | String | Yes | 1-100 characters | Country name/code |
| latitude | Number | Yes | -90 to 90 | Latitude coordinate |
| longitude | Number | Yes | -180 to 180 | Longitude coordinate |
| short_description | String | Yes | 1-500 characters | Brief description |
| full_description | String | No | 0-5000 characters | Detailed description |
| image_url | String | No | Valid URL format | Primary image URL |
| gallery_urls | String | No | Semicolon-separated URLs | Additional images (url1;url2;url3) |
| dog_friendly_level | Number | No | 1-5 integer | Dog-friendliness rating |
| amenities | String | No | Comma-separated values | Amenities list (wifi,parking,outdoor) |
| rules | String | No | 0-1000 characters | Dog-specific rules |
| website_url | String | No | Valid URL format | Official website |
| contact_phone | String | No | Valid phone format | Contact phone number |
| contact_email | String | No | Valid email format | Contact email address |
| price_range | String | No | 1-10 characters | Price category ($, $$, $$$) |
| opening_hours | String | No | 0-500 characters | Hours of operation |
| rating | Number | No | 0-5 float | External rating |
| tags | String | No | Comma-separated values | Tags/keywords (pet-friendly,leash-required) |

## Validation Rules

### Required Fields
- name, type, city, country, latitude, longitude, short_description

### Data Type Validation
- latitude/longitude: Must be valid numbers within geographic bounds
- dog_friendly_level: Must be integer 1-5
- rating: Must be number 0-5
- image_url, website_url: Must be valid URLs (http/https)
- contact_email: Must be valid email format
- id: If provided, must be valid UUID format

### Business Logic Validation
- type must be one of the allowed PlaceType enum values
- latitude/longitude must form valid geographic coordinates
- If id is missing, generate UUIDv5 from: `${name}|${city}|${country}|${latitude}|${longitude}`

### Array Fields Processing
- gallery_urls: Split by semicolon (;), trim whitespace, filter empty
- amenities: Split by comma (,), trim whitespace, filter empty
- tags: Split by comma (,), trim whitespace, filter empty

## Error Handling

### Validation Response Format
```typescript
{
  summary: {
    total: number,      // Total rows processed
    valid: number,      // Number of valid rows
    errors: Array<{     // Validation errors
      row: number,      // Row number (1-based)
      field?: string,   // Field name if field-specific
      error: string     // Error message
    }>
  },
  rows: Array<NormalizedRow>  // First 100 valid normalized rows
}
```

### Error Types
- **Missing Required Field**: `{field} is required`
- **Invalid Type**: `{field} must be {expectedType}`
- **Invalid Value**: `{field} has invalid value: {value}`
- **Out of Range**: `{field} must be between {min} and {max}`
- **Invalid Format**: `{field} has invalid format`
- **Duplicate ID**: `id must be unique: {id}`

### Row Processing
- Invalid rows are skipped but reported
- Valid rows are normalized and returned
- Processing continues even with errors
- Maximum 100 valid rows returned in preview

## Normalized Row Format
After validation, rows are transformed to match the database schema:

```typescript
interface NormalizedRow {
  id: string                    // UUID (provided or generated)
  name: string                  // Trimmed name
  type: PlaceType               // Validated enum
  city: string                  // Trimmed city
  region?: string              // Trimmed region
  country: string              // Trimmed country
  latitude: number             // Parsed float
  longitude: number            // Parsed float
  short_description: string    // Trimmed description
  full_description?: string    // Trimmed description
  image_url?: string           // Validated URL
  gallery_urls: string[]       // Processed array
  dog_friendly_level?: number  // Validated integer
  amenities: string[]          // Processed array
  rules?: string              // Trimmed rules
  website_url?: string        // Validated URL
  contact_phone?: string      // Trimmed phone
  contact_email?: string      // Validated email
  price_range?: string        // Trimmed range
  opening_hours?: string      // Trimmed hours
  rating?: number             // Parsed float
  tags: string[]              // Processed array
}
```

## Import Process

### Validation Phase
1. Parse CSV with UTF-8 BOM support
2. Validate column headers match expected order
3. Process each row with Zod schema validation
4. Collect errors and valid rows
5. Return validation summary and preview

### Apply Phase
1. Verify user has editor/admin role
2. Use Prisma transactions for atomic updates
3. Upsert places (create or update based on id)
4. Auto-create cities if they don't exist
5. Generate slugs for new places
6. Return success count

## Security Considerations
- CSV upload limited to authenticated editor/admin users
- File size limits enforced
- No execution of formulas or scripts in CSV
- Input sanitization prevents injection attacks