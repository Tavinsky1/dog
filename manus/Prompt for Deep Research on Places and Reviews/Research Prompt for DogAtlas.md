# Research Prompt for DogAtlas

## Project Overview

**Project Name:** DogAtlas
**Technology Stack:** Next.js (App Router) + Prisma + Tailwind
**Goal:** Populate DogAtlas with real places and reviews across Berlin, structured into 9 fixed categories, in import-ready JSONL files for Visual Studio Code + Copilot.

## Categories (Must Match Exactly)

### Featured (Homepage)
1.  **cafe_restaurant_bar** → Paws & Patios
    *   


Description: Dog-friendly cafés, restaurants & bars with outdoor seating
2.  **park_offleash_area** → Parks & Play
    *   Description: Off-leash areas, dog parks & recreational spaces
3.  **lake_swim** → Splash & Swim
    *   Description: Lakes, beaches & swimming spots for water-loving dogs
4.  **trail_hike** → Trails & Treks
    *   Description: Hiking trails, forest paths & scenic walking routes

### City-specific (Berlin & other cities)
5.  **pet_store_boutique** → Pet Stores
    *   Description: Pet supplies and boutique shops
6.  **vet_clinic_hospital** → Veterinary Services
    *   Description: Clinics, hospitals and emergency care
7.  **dog_groomer** → Dog Groomers
    *   Description: Professional grooming and spa services
8.  **dog_hotel_boarding** → Dog Hotels
    *   Description: Boarding, daycare and accommodation
9.  **dog_walker_trainer** → Trainers & Walkers
    *   Description: Professional training and walking services

**Important:** No other categories should appear. Each place must belong to exactly one of these.

## Research Sources

*   **Primary:** Google Places API (legal usage only; no scraping).
    *   Collect: name, address, geo, website, phone, rating, ratingCount, opening hours, Google Place ID, a few public photos’ URLs (metadata only), and review aggregates.
    *   For reviews: store star rating + short excerpts (<= 280 chars) or LLM summarized paraphrases, with source URL. Do not scrape or store long verbatim text; comply with Google TOS.
*   **Secondary:** OpenStreetMap / Overpass (parks, trails, dog meadows, leash/off-leash tags, amenities).
*   **Local Data:** City/State Open Data (Berlin): official Hundewiesen/dog off-leash areas, lakes, forest trails, seasonal rules, algae advisories.
*   **Supplementary:** TripAdvisor, Yelp, Reddit (r/berlin, r/dogs, r/dogtraining), dog forums, Facebook public pages/groups (only public posts), blogs, venue websites.
*   **Licensing & TOS:** No scraping behind logins. Respect robots.txt. Use official APIs. Quote sparingly (<= 25 words) or paraphrase.

## Output Format

Deliver a folder `/data/berlin/` with:

*   `places.jsonl` (one JSON per line) - core place objects
*   `reviews.jsonl` (one JSON per line) - reviews linked by google_place_id or by name+address
*   `sources.md` - source list and notes (APIs used, rate limits)
*   `coverage.json` - counts per category + basic QA stats

### `places.jsonl` Schema (aligns with Prisma/seed)

```json
{
  "city": "Berlin",
  "name": "Café Hundeglück",
  "category": "cafe_restaurant_bar",
  "description": "Dog-friendly café with outdoor seating and water bowls.",
  "address": "Mainstr. 12, 10967 Berlin",
  "district": "Neukölln",
  "neighborhood": "Kreuzberg",
  "lat": 52.4901,
  "lng": 13.4123,
  "website": "https://cafehundeglueck.de",
  "phone": "+49 30 1234567",
  "priceLevel": 2,
  "status": "published",
  "features": {
    "dogs_allowed_indoors": "true",
    "off_leash_allowed": "No",
    "water_bowls": "true",
    "fenced": "false",
    "shade": "true",
    "poop_bags": "UNKNOWN"
  },
  "hours": [
    { "day": 1, "open": "08:00", "close": "20:00" } // optional, 0=Sun..6=Sat
  ],
  "activity": {
    "type": "lake" | "trail_hike",
    "attrs": { "entry": "beach", "shallow_entry": true, "algae_flag": "UNKNOWN" }
  } || null,
  "rating": 4.6,              // numeric agg if available
  "ratingCount": 87,         // total count
  "photos": [                 // optional; metadata only
    { "url": "https://...", "width": 1600, "height": 900, "source": "google_places" }
  ],
  "external_ids": {
    "google_place_id": "ChIJ123abc",
    "osm_id": null,
    "facebook_url": null,
    "instagram_url": null
  }
}
```

### `reviews.jsonl` Schema

```json
{
  "google_place_id": "ChIJ123abc",      // or fallback: composite key below
  "fallback_key": {
    "name": "Café Beispiel",
    "address": "Street 1, Berlin"
  },
  "source": "google|reddit|tripadvisor|official_site|forum",
  "url": "https://…",                 // direct link to review or listing
  "language": "de",
  "published_at": "2024-08-01T10:00:00Z",
  "rating": 5,
  "excerpt": "The staff gave our dog water and treats!", // <= 280 chars, or paraphrase
  "summary": "Very dog-friendly indoors, staff offers water bowls and snacks.",
  "tags": ["dogs_indoor", "water_bowls", "friendly_staff"],
  "author": "First L.",              // if public; else "Anonymous"
  "helpful_count": 2
}
```

**Important:** For Google reviews, prefer star rating + paraphrased summary + link to source. If quoting, keep <= 25 words.

## Data Quality & QA

*   **Deduping:** Same name (case/diacritics normalized) and within 50m → merge; keep best data quality.
*   **Category Mapping:** Ensure each place uses one of the exact category strings above.
*   **Features Normalization:** Strings only ("true"|"false"|"UNKNOWN" etc.).
*   **Language & Translation:** If a review is not English, include original language and provide an English summary.

## Deliverables

*   A zip with `/data/berlin/*.jsonl` and a `sources.md`.
*   `places.jsonl` and `reviews.jsonl` delivered with 1k+ total places across categories, normalized and deduped.
*   `coverage.json` shows counts per category and % with website, hours, features.
*   `sources.md` lists primary sources + any API quotas/keys needed.
*   Files paste cleanly into the repo and import with our existing `seed.ts`.

### Minimum Coverage Goal for Berlin

*   Cafés/Restaurants: 100+
*   Parks/Off-leash: 50+
*   Lakes/Swim spots: 20+
*   Trails/Hikes: 30+
*   Pet stores: 50+
*   Vets: 80+
*   Groomers: 40+
*   Hotels/Boarding: 40+
*   Walkers/Trainers: 50+

## Search Seeds (Examples to use in both English & German)

*   **Cafés:** "dog friendly café Berlin", Hunde willkommen Café Berlin, Hunde im Café erlaubt Berlin Bezirk <X>
*   **Parks/Off-leash:** Hundewiese Berlin off leash, Hundeauslaufgebiet Berlin Liste, Leinenpflicht Berlin Park
*   **Lakes:** Hundestrand Berlin, Hunde Badestelle Berlin, algenwarnung badesee berlin hunde
*   **Trails:** Waldweg Hund Berlin, Hunderunde Wanderweg Berlin
*   **Vets/Groomers/Stores/Hotels/Walkers/Trainers:** Tierarzt Berlin 24h hund, Hundesalon Berlin, Hundehotel Berlin, Gassi Service Berlin, Hundetrainer Berlin Bewertungen

## Non-negotiables (Legal & Ethics)

*   Use official APIs (e.g., Google Places API) and store only fields permitted by their TOS.
*   No automated scraping of Google UI.
*   Reviews: star + short excerpt or paraphrase + link. No full articles or long copy/paste.
*   Respect robots.txt and community guidelines for forums.

## Definition of Done

*   `/data/berlin/places.jsonl` and `/data/berlin/reviews.jsonl` delivered with 1k+ total places across categories, normalized and deduped.
*   `coverage.json` summary (counts per category).
*   All places have: name, address, geo, website, rating, category.
*   Reviews paraphrased + source URL.
*   Drop-in ready for VS Code → `pnpm seed data/berlin/places.jsonl`.

## Bonus Ideas (If time permits)

*   Export `google_place_id` for every place possible (improves dedupe and deep-linking).
*   Provide official website URLs wherever available (high priority).
*   Store photo URLs (metadata only) and license info if known.
*   Mark badges: puppy-friendly, fenced, shaded, busy-times, algae-warning.
*   Add nearest U/S-Bahn station.
*   Provide lists: “Top Off-Leash Parks”, “Best Dog Cafés in Neukölln”.
*   Flag seasonal leash rules at lakes/forests.

## Brainstorm: Extra Ideas to Delight Users

*   “Good for…” badges: chill dogs, reactive dogs (wide paths), shade in summer, quiet spots, fenced areas, puppy-safe, senior-friendly.
*   Seasonal flags: algae alerts at lakes; leash rules that change seasonally; holiday closures.
*   Amenities map layer: water fountains, poop-bag dispensers, bins, benches, public toilets.
*   Transit info: nearest U/S-Bahn, “dogs allowed” policy notes, busy times.
*   Safety signals: surface types for trails; night lighting; traffic proximity.
*   Lists and guides: “Best rainy-day cafés”, “Top off-leash meadows”, “First-time puppy checklist in Berlin”.
*   Venue onboarding: simple portal for owners to “claim” listings and update dog policies.
*   Contributor perks: monthly leaderboard; “Local Scout” badges; early access; swag/discounts with partner stores.
*   Events: dog meetups, training workshops, adoption days.

## Importer Script

I can also draft a reviews importer script (e.g., `scripts/import_reviews.ts`) so once Manus gives us the JSONL, you can run `pnpm ts-node scripts/import_reviews.ts` and load reviews straight into Prisma. This would close the loop for review ingestion.



## Research Methodology

To achieve the goal of populating DogAtlas with real places and reviews, Manus will follow a systematic research methodology, prioritizing official APIs and adhering strictly to legal and ethical guidelines. The process will involve several key steps:

### 1. Data Acquisition from Primary Sources

*   **Google Places API:** This will be the primary source for place details, ratings, website information, opening hours, photo metadata, and aggregated reviews. Manus will make API calls to retrieve data for locations within Berlin, focusing on the specified categories. Data extraction will strictly comply with Google's Terms of Service, avoiding any automated scraping of the Google UI. For reviews, only star ratings, short excerpts (<= 280 characters), or LLM-summarized paraphrases will be stored, along with the source URL. Long verbatim texts will not be stored.
*   **OpenStreetMap (OSM) / Overpass API:** For geographical data related to parks, dog meadows, trails, and off-leash areas, OSM will be utilized. The Overpass API will be used to query specific features and amenities relevant to the DogAtlas categories.
*   **City/State Open Data (Berlin):** Official datasets from the City of Berlin will be accessed to gather information on designated Hundewiesen (dog off-leash areas), specific leash rules, seasonal regulations, and any advisories (e.g., algae alerts for lakes).

### 2. Data Acquisition from Supplementary Sources

*   **Web Search (TripAdvisor, Yelp, Reddit, Forums, Blogs, Venue Websites):** Manus will perform targeted web searches using the provided search seeds (in both English and German) to identify relevant places and gather supplementary reviews. This will involve navigating to reputable websites, forums (e.g., r/berlin, r/dogs, r/dogtraining on Reddit), and public Facebook pages/groups. All data collection from these sources will respect `robots.txt` files and community guidelines. Reviews from these sources will also be limited to star ratings, short excerpts or paraphrases, and source URLs.
*   **Direct Venue Websites:** Where available, direct visits to venue websites will be made to gather accurate and up-to-date information, including official descriptions, operating hours, and specific dog policies.

### 3. Data Normalization and Enrichment

*   **Category Mapping:** All collected places will be strictly mapped to one of the 9 predefined categories. No new categories will be created, and any place that does not fit these categories will be excluded.
*   **Feature Enrichment:** Boolean and enum features (e.g., `dogs_allowed_indoors`, `off_leash_allowed`, `water_bowls`) will be extracted and normalized into the specified string values ("true" | "false" | "UNKNOWN" | "Always" | "Zoned" | "Seasonal" | "No").
*   **Activity Data:** For lakes and trails, specific activity attributes (e.g., `entry`, `shallow_entry`, `algae_flag` for lakes; `distance_km`, `loop`, `surface` for trails) will be extracted and structured as defined in the `places.jsonl` schema.

### 4. Data Quality Assurance and Deduplication

*   **Deduplication:** A robust deduplication process will be implemented. Places with the same name (normalized for case and diacritics) and within a 50-meter radius will be merged, prioritizing the data with the highest quality.
*   **Language and Translation:** For reviews not in English, the original language will be noted, and an English summary will be provided.
*   **Completeness Check:** Manus will ensure that all required fields for each place (name, address, geo, website, rating, category) are present.

### 5. Output Generation

*   **JSONL Files:** The collected and processed data will be outputted into two JSONL files: `places.jsonl` and `reviews.jsonl`, adhering strictly to the provided schemas. Each file will contain one JSON object per line, ensuring strict UTF-8 encoding and no trailing commas.
*   **`sources.md`:** A detailed Markdown file will be generated, listing all primary and supplementary sources used, along with any relevant API quotas or keys.
*   **`coverage.json`:** A JSON file will be created to summarize the data coverage, including counts per category and the percentage of places with website, hours, and features.
*   **`data/README.md`:** A small README file will be included in the `/data/berlin/` directory, providing instructions on how to run the importer (`pnpm seed data/berlin/places.jsonl`) and noting any known gaps or next research targets.

### 6. Legal and Ethical Compliance

Throughout the research process, Manus will strictly adhere to the following non-negotiables:

*   Only official APIs (e.g., Google Places API) will be used, and only fields permitted by their Terms of Service will be stored.
*   No automated scraping of Google UI or any website behind logins will be performed.
*   Reviews will be limited to star ratings, short excerpts, or paraphrases, always with a direct link to the source. Full articles or long copy-pasted content will be avoided.
*   `robots.txt` files and community guidelines for forums and social media platforms will be respected.

This comprehensive methodology ensures that the data collected is accurate, legally compliant, and directly usable for the DogAtlas project, facilitating seamless integration with the existing technology stack.



## Brainstorm: Additional Features and Implementation Ideas

Beyond the core data collection and display, several features could significantly enhance DogAtlas's utility and user engagement. These ideas are categorized for clarity and potential implementation phases:

### User Experience Enhancements

*   **"Good for…" Badges:** Implement a system of dynamic badges that highlight specific characteristics of a place, such as "Good for Chill Dogs," "Reactive Dog Friendly (Wide Paths)," "Shade in Summer," "Quiet Spots," "Fenced Areas," "Puppy-Safe," or "Senior-Friendly." These badges could be generated based on review sentiment analysis, explicit feature flags, or user contributions. This provides quick, at-a-glance information tailored to specific dog needs.
*   **Seasonal Flags and Alerts:** Integrate real-time or seasonal information. For instance, "Algae Alerts" for lakes (critical for dog safety), dynamic updates on leash rules that change seasonally in certain parks or forests, and holiday closures for businesses. This requires either API integrations with local authorities or a community-driven reporting system.
*   **Amenities Map Layer:** Develop an interactive map layer that allows users to toggle on and off various amenities relevant to dog owners, such as water fountains, poop-bag dispensers, waste bins, benches, and public toilets. This would greatly improve the practicality of planning outings.
*   **Transit Information Integration:** Display the nearest public transport stations (U-Bahn, S-Bahn, tram, bus) and include notes on dog-friendly public transport policies (e.g., 


"dogs allowed during off-peak hours," "muzzle required"). This would be invaluable for users relying on public transit.
*   **Safety Signals:** Incorporate information about safety aspects, such as surface types for trails (e.g., paved, gravel, dirt), night lighting availability, and proximity to busy roads or traffic. This helps users make informed decisions about their dog's safety.

### Content and Community Features

*   **Curated Lists and Guides:** Beyond individual place listings, create curated content such as "Best Rainy-Day Cafés," "Top Off-Leash Meadows in Berlin," or a "First-Time Puppy Checklist in Berlin" that integrates relevant places from the database. This adds editorial value and helps users discover places based on specific needs or interests.
*   **Venue Onboarding/Claiming Portal:** Develop a simple portal for business owners or venue managers to "claim" their listings. This would allow them to directly update information (hours, features, photos), respond to reviews, and communicate their dog policies, ensuring data accuracy and fostering engagement with local businesses.
*   **Contributor Perks and Gamification:** Encourage user contributions (reviews, photos, updates) through a gamified system. This could include monthly leaderboards, "Local Scout" badges, early access to new features, or even swag/discounts with partner pet stores. This incentivizes community participation and data enrichment.
*   **Events Calendar:** Integrate a community-driven or curated events calendar for dog-related activities, such as dog meetups, training workshops, adoption days, or local pet expos. This transforms DogAtlas into a community hub, not just a directory.

### Technical and Data Enhancements

*   **Advanced Deduplication with `google_place_id`:** Prioritize and consistently store `google_place_id` for every place. This is a robust identifier that significantly improves deduplication accuracy and facilitates deep-linking to Google Maps for additional context.
*   **Official Website URLs:** Ensure the collection of official website URLs for all places is a high priority. This provides users with the most authoritative source of information and allows for direct navigation.
*   **Photo URLs and Licensing:** Store photo URLs (metadata only) and, if available, licensing information. This allows for richer visual content within the application while respecting intellectual property rights.
*   **Reviews Importer Script:** As discussed, drafting a dedicated `scripts/import_reviews.ts` script would streamline the ingestion of `reviews.jsonl` into the Prisma database, completing the data pipeline for reviews. This script would handle API calls to the `/api/reviews` endpoint, respecting rate limits.

These ideas aim to transform DogAtlas from a simple directory into a comprehensive, interactive, and community-driven platform that truly delights dog owners and simplifies their lives in the city.

