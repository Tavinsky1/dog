# DogAtlas Photo Enrichment Pipeline

Offline photo enrichment system for DogAtlas that sources CC-licensed images from OpenStreetMap, Wikidata/Wikimedia Commons, and Openverse without calling third-party APIs at runtime.

## Overview

This pipeline enables enriching DogAtlas places with high-quality, properly licensed photos through an offline process:

1. **OSM Matching**: Match places with OpenStreetMap POIs using local PBF extracts
2. **Wikidata Enrichment**: Resolve Wikidata IDs to Wikimedia Commons images
3. **Openverse Fallback**: Find CC-licensed images from Openverse bulk dataset
4. **Import & Upload**: Download, validate, upload to Cloudflare Images, create database records
5. **Admin Moderation**: Review and approve photos through admin UI
6. **Frontend Display**: Render photos with proper attribution

## Prerequisites

### Required Tools

- **Node.js 18+** and **npm**
- **osmium-tool** for PBF processing: `brew install osmium-tool` (macOS) or `apt-get install osmium-tool` (Linux)
- **ImageMagick** for image probing: `brew install imagemagick` or `apt-get install imagemagick`
- **PostgreSQL** database (Vercel Postgres recommended)

### Required Data Sources

1. **OSM PBF Extracts**
   - Download from: https://download.geofabrik.de/
   - Example: `berlin-latest.osm.pbf`, `barcelona-latest.osm.pbf`
   - Store in: `data/osm/`

2. **Wikidata P18 Dump** (optional, can use SPARQL instead)
   - Download from: https://query.wikidata.org/
   - SPARQL query:
     ```sparql
     SELECT ?qid ?image WHERE {
       ?item wdt:P18 ?image.
       BIND(REPLACE(STR(?item), ".*Q", "Q") AS ?qid)
     }
     ```
   - Export as TSV format: `qid<TAB>commons_file`
   - Store in: `data/wikidata/wikidata_p18.tsv`

3. **Openverse Bulk Dataset**
   - Download from: https://openverse.org/data-sources
   - CSV or Parquet format with columns: `identifier, title, creator, url, thumbnail_url, license, license_version`
   - Store in: `data/openverse/`

### Environment Variables

Create or update `.env`:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dogatlas"

# Cloudflare Images
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_API_TOKEN="your-api-token"
CLOUDFLARE_DELIVERY_URL="https://imagedelivery.net/your-hash"

# App URL (for server-side fetching)
NEXT_PUBLIC_APP_URL="https://www.dog-atlas.com"
```

## Installation

### 1. Install Dependencies

```bash
npm install
npm install csv-parse csv-stringify form-data
npm install --save-dev @types/node
```

### 2. Apply Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Apply migration (if DATABASE_URL is configured)
npx prisma migrate deploy

# Or apply SQL manually
psql $DATABASE_URL < prisma/migrations/add_place_photo_enrichment.sql
```

### 3. Prepare Data

Create directory structure:

```bash
mkdir -p data/osm data/wikidata data/openverse temp/photo-import
```

Download required datasets (see Prerequisites above).

## Usage

### Step 1: Export Places

Export your places to CSV:

```bash
psql $DATABASE_URL -c "
  COPY (
    SELECT slug, name, lat, lng as lon, 
           c.name as city, p.country
    FROM \"Place\" p
    JOIN \"City\" c ON p.\"cityId\" = c.id
    ORDER BY p.\"createdAt\"
  ) TO STDOUT WITH CSV HEADER
" > data/places.csv
```

### Step 2: OSM Matching

Match places with OSM POIs:

```bash
# Berlin example
npm run osm-match -- \
  --pbf data/osm/berlin-latest.osm.pbf \
  --places data/places.csv \
  --output data/osm_matches_berlin.csv

# Repeat for other cities
npm run osm-match -- \
  --pbf data/osm/barcelona-latest.osm.pbf \
  --places data/places.csv \
  --output data/osm_matches_barcelona.csv

# Combine all matches
cat data/osm_matches_*.csv | sort -u > data/osm_matches.csv
```

### Step 3: Wikidata Enrichment

Resolve Wikidata IDs to Commons images:

```bash
# Using local TSV dump
npm run wikidata-enrich -- \
  --matches data/osm_matches.csv \
  --wikidata data/wikidata/wikidata_p18.tsv \
  --output data/wikimedia_candidates.csv

# Or using online SPARQL (requires internet)
npm run wikidata-enrich -- \
  --matches data/osm_matches.csv \
  --sparql \
  --output data/wikimedia_candidates.csv
```

### Step 4: Openverse Candidates

Find fallback images from Openverse:

```bash
npm run openverse-candidates -- \
  --places data/places.csv \
  --openverse data/openverse/openverse_images.csv \
  --matches data/osm_matches.csv \
  --top 3 \
  --output data/openverse_candidates.csv
```

### Step 5: Import Photos

Download, validate, and import photos:

```bash
# Dry run first
npm run photo-import -- \
  --wikimedia data/wikimedia_candidates.csv \
  --openverse data/openverse_candidates.csv \
  --dry-run

# Actual import
npm run photo-import -- \
  --wikimedia data/wikimedia_candidates.csv \
  --openverse data/openverse_candidates.csv
```

This will:
- Download images to `temp/photo-import/`
- Validate dimensions (minimum 1200×600px)
- Check license compliance
- Upload to Cloudflare Images
- Create `PlacePhoto` records with status=PENDING

### Step 6: Admin Moderation

1. Navigate to: `https://your-domain.com/admin/photos/review`
2. Review each photo:
   - Check image quality and relevance
   - Verify attribution is correct
   - Approve or reject with optional notes
3. Approved photos automatically become primary photos for places without one

## Scripts Reference

### `osm_match.ts`

Matches DogAtlas places with OSM POIs.

**Options:**
- `--pbf <file>` - Path to OSM PBF extract (required)
- `--places <csv>` - Path to places CSV (required)
- `--output <csv>` - Output file path (default: `osm_matches.csv`)

**Output Columns:**
- `slug` - Place slug
- `osm_id` - OSM element ID
- `osm_type` - node/way/relation
- `name` - OSM name tag
- `image_url` - OSM image tag (if present)
- `wikidata` - Wikidata Q-ID (if present)

### `wikidata_enrich.ts`

Resolves Wikidata IDs to Wikimedia Commons images.

**Options:**
- `--matches <csv>` - OSM matches CSV (required)
- `--wikidata <tsv>` - Wikidata P18 TSV dump
- `--sparql` - Use online SPARQL instead of local dump
- `--output <csv>` - Output file path (default: `wikimedia_candidates.csv`)

**Output Columns:**
- `slug` - Place slug
- `commons_file` - Wikimedia Commons filename
- `author` - Photo author
- `license` - License type
- `source_url` - Commons page URL

### `openverse_candidates.ts`

Finds CC-licensed images from Openverse bulk dataset.

**Options:**
- `--places <csv>` - Places CSV (required)
- `--openverse <csv>` - Openverse bulk export (required)
- `--matches <csv>` - Existing matches to skip (optional)
- `--top <n>` - Number of candidates per place (default: 3)
- `--output <csv>` - Output file path (default: `openverse_candidates.csv`)

**Output Columns:**
- `slug` - Place slug
- `openverse_id` - Openverse identifier
- `title` - Image title
- `url` - Full resolution URL
- `thumbnail_url` - Thumbnail URL
- `author` - Creator name
- `license` - License type
- `source_url` - Original source page
- `score` - Relevance score

### `photo_import.ts`

Downloads and imports photos to database.

**Options:**
- `--wikimedia <csv>` - Wikimedia candidates CSV
- `--openverse <csv>` - Openverse candidates CSV
- `--dry-run` - Preview without making changes

**Environment Required:**
- `DATABASE_URL`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

## API Routes

### Admin Endpoints

#### `GET /api/admin/photos`
List photos for review.

**Query Parameters:**
- `status` - PENDING/APPROVED/REJECTED (required)
- `city` - Filter by city name
- `country` - Filter by country
- `license` - Filter by license type

#### `POST /api/admin/photos/[id]/review`
Approve or reject a photo.

**Body:**
```json
{
  "approved": true,
  "notes": "Optional review notes"
}
```

### Public Endpoints

#### `GET /api/places/[slug]/photo`
Get primary photo for a place.

**Response:**
```json
{
  "photo": {
    "cdnUrl": "https://...",
    "width": 2000,
    "height": 1333,
    "author": "Photographer Name",
    "license": "CC-BY-4.0",
    "sourceUrl": "https://..."
  }
}
```

## Frontend Components

### `<PlaceHeroPhoto />`

Display place photo with attribution.

```tsx
import { PlaceHeroPhoto } from '@/components/PlaceHeroPhoto';

<PlaceHeroPhoto
  slug="tiergarten-berlin"
  photo={photo}
  placeName="Tiergarten"
  fallbackImage="/images/places/default.jpg"
/>
```

## License Compliance

### Allowed Licenses

- CC0 / Public Domain
- CC-BY (all versions)
- CC-BY-SA (all versions)

### Attribution Requirements

All photos MUST include:
1. **Author credit** - Stored in `PlacePhoto.author`
2. **License type** - Stored in `PlacePhoto.license`
3. **Source URL** - Stored in `PlacePhoto.sourceUrl`

Attribution is automatically displayed in:
- Photo overlays on place pages
- Admin review interface
- Image metadata

## Troubleshooting

### osmium-tool not found

Install via package manager:
- macOS: `brew install osmium-tool`
- Ubuntu/Debian: `apt-get install osmium-tool`
- Build from source: https://osmcode.org/osmium-tool/

### ImageMagick identify not found

Install ImageMagick:
- macOS: `brew install imagemagick`
- Ubuntu/Debian: `apt-get install imagemagick`

### Cloudflare upload fails

1. Verify environment variables are set correctly
2. Check API token has "Cloudflare Images" permissions
3. Ensure account has sufficient storage quota

### No OSM matches found

1. Verify PBF file covers the correct geographic area
2. Check places.csv has valid lat/lon coordinates
3. Try increasing match radius (edit `maxDistance` in `osm_match.ts`)

### Database connection fails

1. Check `DATABASE_URL` is correctly formatted
2. Ensure SSL is configured if required: `?sslmode=require`
3. Verify network access to database

## Development

### Add Custom License

Edit `lib/photo-enrichment/image-utils.ts`:

```typescript
export const ALLOWED_LICENSES = [
  // ... existing licenses
  'YOUR-LICENSE-HERE'
] as const;
```

### Adjust Image Requirements

Edit validation in `lib/photo-enrichment/image-utils.ts`:

```typescript
export async function validateImage(
  filePath: string,
  minWidth = 1200,  // Adjust minimum width
  minHeight = 600   // Adjust minimum height
): Promise<ValidationResult> {
  // ...
}
```

### Test Scripts

```bash
# Test with sample data
npm run osm-match -- --pbf test-sample.osm.pbf --places test-places.csv
npm run photo-import -- --wikimedia test-candidates.csv --dry-run
```

## Support

For issues or questions:
1. Check this README
2. Review script output for error messages
3. Open an issue on GitHub with:
   - Script name and command
   - Error message
   - Sample data (if possible)

## License

This pipeline is part of DogAtlas and follows the same license terms.
