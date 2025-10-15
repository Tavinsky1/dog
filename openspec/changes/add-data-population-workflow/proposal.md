# Data Population Workflow Proposal

## Problem Statement

DogAtlas has expanded from 6 European cities to 13 cities across 5 continents. Each new city needs to be populated with dog-friendly places (parks, cafés, trails, services). This requires a standardized, repeatable workflow for:

1. Creating high-quality CSV templates with proper data structure
2. Importing place data into the system (seed files initially, then database)
3. Scraping and adding place photos from licensed sources  
4. Adding city metadata (images, dog rules/regulations)
5. Testing and validating the data across all UI components

## Current State

- ✅ **Global navigation** implemented with `/countries/[country]/[city]` structure
- ✅ **Search system** ready to index new places with fuzzy matching
- ✅ **CSV importer** (`scripts/csv-to-seed.js`) with validation and append mode
- ✅ **Image scraper** (`scripts/imageScraperV2.ts`) for Wikimedia Commons photos
- ❌ **No standardized workflow** for adding new cities
- ❌ **No documentation** on CSV format, required fields, or data quality standards
- ❌ **No validation** of imported data before deployment

## Proposed Solution

### Phase 1: CSV Template Creation
**Tool**: Manual creation or automated template generator

**Process**:
1. Create `seed/[city].csv` with standardized columns
2. Include 10-20 sample places per city covering all categories
3. Use Unsplash URLs for placeholder photos (properly attributed)
4. Mark places as `verified=true` if data is confirmed accurate

**Required Columns**:
```csv
country,city,name,category,lat,lon,description,address,website,phone,photo_url,verified
```

**Data Quality Standards**:
- **Name**: Official name of place (no emojis, proper capitalization)
- **Category**: Must match allowed categories (parks, cafes_restaurants, trails, shops_services)
- **Coordinates**: Accurate lat/lon (6 decimal places)
- **Description**: 80-150 characters, concise and informative
- **Address**: Full street address with city, state/province, postal code
- **Website**: Valid HTTPS URL (optional)
- **Phone**: International format with country code (optional)
- **Photo URL**: Uns plash/Wikimedia URL with proper attribution
- **Verified**: `true` for confirmed places, `false` for user-submitted

### Phase 2: City Metadata Addition
**Tool**: `scripts/add-city-metadata.cjs`

**Process**:
1. Define city image (emblematic landmark from Unsplash)
2. Research and document local dog regulations
3. Run script to update `data/countries.json`

**Dog Rules Format** (7-10 rules per city):
```javascript
dogRules: [
  '🟢 Allowed: Description of permitted activities',
  '🔴 Prohibited: Description of restrictions',
  '📝 Registration: Requirements and process',
  '💰 Fees: Annual costs and payment details',
  '🧹 Waste: Cleanup requirements and fines',
  '🚇 Transport: Public transit rules',
  '⏰ Hours: Time restrictions and schedules'
]
```

**City Image**: High-quality Unsplash photo (1600x900+, landscape) of iconic landmark

### Phase 3: CSV Import to Seed Files
**Tool**: `scripts/csv-to-seed.js`

**Process**:
```bash
# Import each city CSV (appends to places.seed.json)
node scripts/csv-to-seed.js seed/new-york.csv --append
node scripts/csv-to-seed.js seed/los-angeles.csv --append
node scripts/csv-to-seed.js seed/sydney.csv --append
# ... repeat for all cities
```

**Validation**:
- Column name verification
- Coordinate range check (-90 to 90 lat, -180 to 180 lon)
- Category validation against allowed list
- URL format validation (website, photo_url)
- Duplicate ID detection
- Country/city slug matching

**Output**: Updated `data/places.seed.json` with new places

### Phase 4: Photo Enhancement (Optional)
**Tool**: `scripts/imageScraperV2.ts`

**Process**:
```bash
# Scrape high-quality photos from Wikimedia Commons
npx tsx scripts/imageScraperV2.ts [CityName]
```

**Features**:
- Searches Wikimedia Commons for licensed photos
- Downloads and uploads to CDN (if configured)
- Updates place records with photo URLs
- Respects CC-BY-SA and public domain licenses

**Note**: Can be skipped initially if CSV already has Unsplash URLs

### Phase 5: Testing & Validation
**Checklist**:
- [ ] Homepage loads and shows all countries
- [ ] Country page shows all cities with images
- [ ] City page shows all imported places
- [ ] Search finds places by name, city, category
- [ ] Place detail pages load correctly
- [ ] Dog rules display on city pages
- [ ] Mobile responsive on all pages
- [ ] No console errors or warnings

**Testing Commands**:
```bash
# Start dev server
npm run dev

# Visit test URLs
open http://localhost:3000
open http://localhost:3000/countries/united-states/new-york
open http://localhost:3000/search?q=park
```

### Phase 6: Database Migration (Future)
**Prerequisites**:
- Add `country` field to `Place` model in Prisma schema
- Run migration: `npx prisma migrate dev --name add_country_to_place`
- Update sync scripts to handle country field

**Process**:
1. Switch `NEXT_PUBLIC_USE_DATABASE=true` in `.env`
2. Import seed data to PostgreSQL
3. Update existing places with country values
4. Test all features with database mode
5. Deploy to production

## File Structure

```
dog-atlas/
├── data/
│   ├── countries.json (v1.2.0+ with images and dogRules)
│   └── places.seed.json (temporary seed data)
├── seed/
│   ├── new-york.csv
│   ├── los-angeles.csv
│   ├── sydney.csv
│   ├── melbourne.csv
│   ├── buenos-aires.csv
│   ├── cordoba.csv
│   └── tokyo.csv
├── scripts/
│   ├── csv-to-seed.js (CSV importer with validation)
│   ├── add-city-metadata.cjs (adds images and dog rules)
│   └── imageScraperV2.ts (optional photo scraper)
└── openspec/
    └── changes/add-data-population-workflow/
        ├── proposal.md (this file)
        ├── tasks.md (implementation checklist)
        └── specs/
            └── data-standards/spec.md (CSV format spec)
```

## Benefits

1. **Standardization**: Consistent data quality across all cities
2. **Scalability**: Easy to add 100+ cities using same workflow
3. **Validation**: Catch errors before data enters production
4. **Documentation**: Clear process for team members and contributors
5. **Reversibility**: Seed files allow easy rollback if needed
6. **SEO**: Rich metadata (dog rules, images) improves search ranking

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Poor CSV data quality | Low user trust | Strict validation, manual review |
| Copyright issues with photos | Legal problems | Use only CC-BY-SA/public domain |
| Outdated dog regulations | Misleading users | Add "last updated" dates, crowdsource updates |
| Performance with large seed files | Slow page loads | Migrate to database after 500+ places |

## Timeline

- **Week 1**: Create all CSV templates (7 cities × 15 places = 105 places)
- **Week 2**: Import CSVs, add city metadata, initial testing
- **Week 3**: Optional photo scraping, quality review
- **Week 4**: Production deployment, monitoring

## Success Metrics

- ✅ All 13 cities have 10+ places each
- ✅ Search returns relevant results for new cities
- ✅ Zero console errors on new city pages
- ✅ Dog rules display correctly on all cities
- ✅ Page load time < 2 seconds
- ✅ Mobile usability score > 90

## Next Steps

1. Review and approve this proposal
2. Create implementation tasks in `tasks.md`
3. Execute Phase 1-5 sequentially
4. Document lessons learned for future city additions
