# DOGGYWORLD Data Model

## Overview
The data model supports a multi-city directory of dog-friendly places with user authentication and favorites. It uses PostgreSQL with Prisma ORM.

## Entities

### City
Represents a geographic city/location containing places.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | String (UUID) | Yes | Primary key, auto-generated UUID |
| slug | String | Yes | URL-friendly identifier, unique |
| name | String | Yes | Display name of the city |
| region | String | No | State/province/region |
| country | String | Yes | Country code or name |
| lat | Float | Yes | Latitude coordinate |
| lng | Float | Yes | Longitude coordinate |
| bbox | Json | No | Bounding box for map fitting |
| active | Boolean | Yes | Whether city is active (default: true) |

**Indexes:**
- Primary: id
- Unique: slug

**Relationships:**
- One-to-many: places (Place.cityId → City.id)

### Place
Represents a dog-friendly place/location.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | String (UUID) | Yes | Primary key, auto-generated or from CSV |
| slug | String | Yes | URL-friendly identifier, unique |
| name | String | Yes | Display name |
| type | PlaceType (enum) | Yes | Category of place |
| cityId | String (UUID) | Yes | Foreign key to City |
| region | String | No | State/province/region |
| country | String | Yes | Country |
| lat | Float | Yes | Latitude |
| lng | Float | Yes | Longitude |
| shortDescription | String | Yes | Brief description (≤ 200 chars) |
| fullDescription | String | No | Detailed description |
| imageUrl | String | No | Primary image URL |
| gallery | String[] | No | Array of additional image URLs |
| dogFriendlyLevel | Int | No | Rating 1-5 (1=not friendly, 5=very friendly) |
| amenities | String[] | No | List of amenities |
| rules | String | No | Specific rules for dogs |
| websiteUrl | String | No | Official website |
| phone | String | No | Contact phone number |
| email | String | No | Contact email |
| priceRange | String | No | Price category ($, $$, $$$) |
| openingHours | String | No | Hours of operation |
| rating | Float | No | External rating (0-5) |
| tags | String[] | No | Additional tags/keywords |
| source | String | No | Data source identifier |
| createdAt | DateTime | Yes | Auto-generated creation timestamp |
| updatedAt | DateTime | Yes | Auto-updated modification timestamp |

**Indexes:**
- Primary: id
- Unique: slug
- Foreign: cityId
- Performance: type, cityId + type

**Relationships:**
- Many-to-one: city (Place.cityId → City.id)
- One-to-many: favorites (Favorite.placeId → Place.id)

### User
Represents authenticated users.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | String (CUID) | Yes | Primary key, auto-generated |
| name | String | No | Display name |
| email | String | No | Email address, unique |
| emailVerified | DateTime | No | Email verification timestamp |
| image | String | No | Profile image URL |
| role | String | Yes | User role (user/editor/admin), default: user |
| passwordHash | String | No | Bcrypt hashed password |
| accounts | Account[] | No | OAuth accounts |
| sessions | Session[] | No | Active sessions |
| favorites | Favorite[] | No | User's favorite places |

**Indexes:**
- Primary: id
- Unique: email

### Favorite
Represents user favorites/bookmarks.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | String (CUID) | Yes | Primary key, auto-generated |
| userId | String | Yes | Foreign key to User |
| placeId | String | Yes | Foreign key to Place |

**Indexes:**
- Primary: id
- Unique: userId + placeId (composite)
- Foreign: userId, placeId

**Relationships:**
- Many-to-one: user (Favorite.userId → User.id)
- Many-to-one: place (Favorite.placeId → Place.id)

### Account (Auth.js)
OAuth account links.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | String (CUID) | Yes | Primary key |
| userId | String | Yes | Foreign key to User |
| type | String | Yes | OAuth provider type |
| provider | String | Yes | OAuth provider name |
| providerAccountId | String | Yes | Provider's account ID |
| refresh_token | String | No | OAuth refresh token |
| access_token | String | No | OAuth access token |
| expires_at | Int | No | Token expiration |
| token_type | String | No | Token type |
| scope | String | No | OAuth scope |
| id_token | String | No | OpenID token |
| session_state | String | No | Session state |

**Indexes:**
- Primary: id
- Unique: provider + providerAccountId
- Foreign: userId

### Session (Auth.js)
User sessions.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | String (CUID) | Yes | Primary key |
| sessionToken | String | Yes | Session token, unique |
| userId | String | Yes | Foreign key to User |
| expires | DateTime | Yes | Expiration timestamp |

**Indexes:**
- Primary: id
- Unique: sessionToken
- Foreign: userId

### VerificationToken (Auth.js)
Email verification tokens.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| identifier | String | Yes | User identifier (email) |
| token | String | Yes | Verification token, unique |
| expires | DateTime | Yes | Expiration timestamp |

**Indexes:**
- Unique: identifier + token

## Enums

### PlaceType
Categories of dog-friendly places.

- trail
- park
- cafe
- vet
- grooming
- activity
- beach
- hotel
- store
- event

## Database Design Notes

### Constraints
- All foreign keys have cascade delete where appropriate
- UUID fields use database-generated values
- String fields have reasonable length limits
- Email fields validated at application level

### Performance Considerations
- Indexes on frequently queried fields (cityId, type, slug)
- Composite indexes for common filter combinations
- JSON fields for flexible data (bbox, gallery, amenities, tags)

### Data Integrity
- Unique constraints prevent duplicate data
- Required fields enforced at database level
- Referential integrity maintained via foreign keys

### Migration Strategy
- Prisma migrations for schema changes
- Seed scripts for initial data
- CSV import for bulk data updates