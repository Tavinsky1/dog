#!/usr/bin/env node

/**
 * CSV to Seed JSON Converter
 * 
 * Converts CSV files with place data into places.seed.json format
 * 
 * Usage:
 *   node scripts/csv-to-seed.js input.csv > data/places.seed.json
 *   node scripts/csv-to-seed.js input.csv --append
 * 
 * CSV Format (headers required):
 *   country,city,name,category,lat,lon,address,website,phone,description,photo_url,verified
 * 
 * Example:
 *   united-states,new-york,Central Park,parks,40.785,-73.968,,,,Great park,https://...,false
 */

const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateId(country, city, name) {
  const citySlug = slugify(city);
  const nameSlug = slugify(name);
  return `${citySlug}-${nameSlug}`;
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

function csvToJson(csvPath) {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    console.error('Error: CSV file is empty');
    process.exit(1);
  }

  // Parse header
  const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().trim());
  
  // Validate required columns
  const required = ['country', 'city', 'name', 'category', 'lat', 'lon'];
  const missing = required.filter(col => !headers.includes(col));
  
  if (missing.length > 0) {
    console.error(`Error: Missing required columns: ${missing.join(', ')}`);
    console.error('Required columns:', required.join(', '));
    console.error('Found columns:', headers.join(', '));
    process.exit(1);
  }

  // Parse data rows
  const places = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    
    if (values.length !== headers.length) {
      console.warn(`Warning: Skipping line ${i + 1} - column count mismatch`);
      continue;
    }

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    // Skip empty rows
    if (!row.name || !row.country || !row.city) {
      continue;
    }

    // Build place object
    const place = {
      id: row.id || generateId(row.country, row.city, row.name),
      country: slugify(row.country),
      city: slugify(row.city),
      name: row.name,
      category: row.category || 'parks',
      lat: parseFloat(row.lat),
      lon: parseFloat(row.lon),
    };

    // Add optional fields
    if (row.address && row.address.trim()) {
      place.address = row.address;
    }
    if (row.website && row.website.trim()) {
      place.website = row.website;
    }
    if (row.phone && row.phone.trim()) {
      place.phone = row.phone;
    }
    if (row.description && row.description.trim()) {
      place.description = row.description;
    }

    // Handle photos (can be comma-separated URLs)
    const photoUrl = row.photo_url || row.photo || row.image_url || '';
    if (photoUrl.trim()) {
      place.photos = photoUrl.split(';').map(url => url.trim()).filter(url => url);
    } else {
      place.photos = [];
    }

    // Verified status
    place.verified = row.verified === 'true' || row.verified === '1';

    // Optional rating
    if (row.rating && !isNaN(parseFloat(row.rating))) {
      place.rating = parseFloat(row.rating);
    }
    if (row.review_count && !isNaN(parseInt(row.review_count))) {
      place.reviewCount = parseInt(row.review_count);
    }

    places.push(place);
  }

  return places;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('CSV to Seed JSON Converter');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/csv-to-seed.js <input.csv> [--append]');
    console.log('');
    console.log('Options:');
    console.log('  --append    Append to existing places.seed.json instead of overwriting');
    console.log('');
    console.log('Required CSV columns: country, city, name, category, lat, lon');
    console.log('Optional columns: address, website, phone, description, photo_url, verified');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/csv-to-seed.js input.csv > data/places.seed.json');
    console.log('  node scripts/csv-to-seed.js input.csv --append');
    process.exit(0);
  }

  const csvPath = args[0];
  const appendMode = args.includes('--append');

  if (!fs.existsSync(csvPath)) {
    console.error(`Error: File not found: ${csvPath}`);
    process.exit(1);
  }

  const newPlaces = csvToJson(csvPath);

  if (appendMode) {
    const seedPath = path.join(__dirname, '..', 'data', 'places.seed.json');
    let existingPlaces = [];

    if (fs.existsSync(seedPath)) {
      existingPlaces = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
    }

    // Merge - avoid duplicates by ID
    const existingIds = new Set(existingPlaces.map(p => p.id));
    const uniqueNewPlaces = newPlaces.filter(p => !existingIds.has(p.id));

    const merged = [...existingPlaces, ...uniqueNewPlaces];
    
    fs.writeFileSync(seedPath, JSON.stringify(merged, null, 2));
    
    console.error(`✅ Appended ${uniqueNewPlaces.length} new places to ${seedPath}`);
    console.error(`   Total places: ${merged.length}`);
    console.error(`   Skipped ${newPlaces.length - uniqueNewPlaces.length} duplicates`);
  } else {
    // Output to stdout
    console.log(JSON.stringify(newPlaces, null, 2));
    console.error(`✅ Converted ${newPlaces.length} places from ${csvPath}`);
  }
}

main();
