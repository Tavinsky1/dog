#!/usr/bin/env node

/**
 * Add Country/City Helper Script
 * 
 * Makes it easy to add new countries and cities to countries.json
 * 
 * Usage:
 *   node scripts/add-location.js country <name> <iso>
 *   node scripts/add-location.js city <country-slug> <city-name>
 * 
 * Examples:
 *   node scripts/add-location.js country "United Kingdom" GB
 *   node scripts/add-location.js city united-kingdom London
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const COUNTRY_FLAGS = {
  'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'NZ': '🇳🇿',
  'DE': '🇩🇪', 'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹', 'PT': '🇵🇹',
  'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪',
  'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'PL': '🇵🇱',
  'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳', 'TH': '🇹🇭', 'SG': '🇸🇬',
  'MX': '🇲🇽', 'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴',
  'ZA': '🇿🇦', 'EG': '🇪🇬', 'IL': '🇮🇱', 'AE': '🇦🇪', 'IN': '🇮🇳'
};

const CONTINENTS = {
  'US': 'North America', 'CA': 'North America', 'MX': 'North America',
  'GB': 'Europe', 'DE': 'Europe', 'FR': 'Europe', 'ES': 'Europe', 'IT': 'Europe',
  'PT': 'Europe', 'NL': 'Europe', 'BE': 'Europe', 'CH': 'Europe', 'AT': 'Europe',
  'SE': 'Europe', 'NO': 'Europe', 'DK': 'Europe', 'FI': 'Europe', 'IE': 'Europe',
  'PL': 'Europe', 'GR': 'Europe', 'CZ': 'Europe', 'HU': 'Europe',
  'AU': 'Oceania', 'NZ': 'Oceania',
  'JP': 'Asia', 'KR': 'Asia', 'CN': 'Asia', 'TH': 'Asia', 'SG': 'Asia',
  'IN': 'Asia', 'IL': 'Asia', 'AE': 'Asia',
  'BR': 'South America', 'AR': 'South America', 'CL': 'South America', 'CO': 'South America',
  'ZA': 'Africa', 'EG': 'Africa'
};

const CURRENCIES = {
  'US': 'USD', 'CA': 'CAD', 'MX': 'MXN',
  'GB': 'GBP', 'CH': 'CHF', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK', 'PL': 'PLN',
  'DE': 'EUR', 'FR': 'EUR', 'ES': 'EUR', 'IT': 'EUR', 'PT': 'EUR',
  'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'FI': 'EUR', 'IE': 'EUR', 'GR': 'EUR',
  'AU': 'AUD', 'NZ': 'NZD',
  'JP': 'JPY', 'KR': 'KRW', 'CN': 'CNY', 'TH': 'THB', 'SG': 'SGD',
  'IN': 'INR', 'IL': 'ILS', 'AE': 'AED',
  'BR': 'BRL', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP',
  'ZA': 'ZAR', 'EG': 'EGP'
};

async function addCountry(name, iso) {
  const countriesPath = path.join(__dirname, '..', 'data', 'countries.json');
  const data = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));

  const slug = slugify(name);
  const flag = COUNTRY_FLAGS[iso] || '🏳️';
  const continent = CONTINENTS[iso] || await ask('Continent (e.g., Europe, Asia): ');
  const currency = CURRENCIES[iso] || await ask('Currency (e.g., USD, EUR): ');
  const language = await ask('Primary language: ');
  const lat = parseFloat(await ask('Latitude (e.g., 40.7128): '));
  const lng = parseFloat(await ask('Longitude (e.g., -74.0060): '));
  const timezone = await ask('Timezone (e.g., America/New_York): ');

  // Check if country already exists
  if (data.countries.find(c => c.iso === iso || c.slug === slug)) {
    console.error(`❌ Country with ISO ${iso} or slug ${slug} already exists!`);
    process.exit(1);
  }

  const newCountry = {
    iso,
    name,
    slug,
    flag,
    continent,
    coordinates: [lat, lng],
    timezone,
    currency,
    language,
    cities: []
  };

  data.countries.push(newCountry);
  data.metadata.totalCountries = data.countries.length;
  data.metadata.lastUpdated = new Date().toISOString();
  data.metadata.version = incrementVersion(data.metadata.version);

  fs.writeFileSync(countriesPath, JSON.stringify(data, null, 2));
  
  console.log(`\n✅ Added country: ${name} (${iso})`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Flag: ${flag}`);
  console.log(`   Continent: ${continent}`);
  console.log(`\n💡 Next: Add cities with:`);
  console.log(`   node scripts/add-location.js city ${slug} "City Name"\n`);
}

async function addCity(countrySlug, cityName) {
  const countriesPath = path.join(__dirname, '..', 'data', 'countries.json');
  const data = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));

  const country = data.countries.find(c => c.slug === countrySlug);
  if (!country) {
    console.error(`❌ Country with slug "${countrySlug}" not found!`);
    console.log('\nAvailable countries:');
    data.countries.forEach(c => console.log(`  - ${c.slug} (${c.name})`));
    process.exit(1);
  }

  const slug = slugify(cityName);
  
  // Check if city already exists in this country
  if (country.cities.find(c => c.slug === slug)) {
    console.error(`❌ City ${cityName} already exists in ${country.name}!`);
    process.exit(1);
  }

  const lat = parseFloat(await ask('Latitude: '));
  const lng = parseFloat(await ask('Longitude: '));
  const population = parseInt(await ask('Population (optional, press Enter to skip): ') || '0');
  const timezone = await ask(`Timezone (default: ${country.timezone}): `) || country.timezone;
  const description = await ask('Short description (optional): ') || `Discover dog-friendly places in ${cityName}`;

  const newCity = {
    id: slug,
    name: cityName,
    slug,
    coordinates: [lat, lng],
    timezone,
    population: population || undefined,
    description,
    placeCount: 0,
    categories: {
      cafes_restaurants: 0,
      parks: 0,
      trails: 0,
      hotels: 0,
      vets: 0,
      shops: 0,
      groomers: 0,
      trainers: 0,
      beaches: 0
    }
  };

  // Remove undefined fields
  if (!newCity.population) delete newCity.population;

  country.cities.push(newCity);
  data.metadata.totalCities = data.countries.reduce((sum, c) => sum + c.cities.length, 0);
  data.metadata.lastUpdated = new Date().toISOString();
  data.metadata.version = incrementVersion(data.metadata.version);

  fs.writeFileSync(countriesPath, JSON.stringify(data, null, 2));
  
  console.log(`\n✅ Added city: ${cityName} to ${country.name}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   URL: /${countrySlug}/${slug}`);
  console.log(`\n💡 Places will appear once added to database and scraped.\n`);
}

function incrementVersion(version) {
  const parts = version.split('.');
  parts[2] = parseInt(parts[2]) + 1;
  return parts.join('.');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📍 Add Location Helper\n');
    console.log('Usage:');
    console.log('  node scripts/add-location.js country <name> <iso>');
    console.log('  node scripts/add-location.js city <country-slug> <city-name>');
    console.log('\nExamples:');
    console.log('  node scripts/add-location.js country "United Kingdom" GB');
    console.log('  node scripts/add-location.js city united-kingdom London');
    console.log('  node scripts/add-location.js city japan Osaka');
    rl.close();
    return;
  }

  const command = args[0];

  if (command === 'country') {
    if (args.length < 3) {
      console.error('❌ Usage: node scripts/add-location.js country <name> <iso>');
      console.error('Example: node scripts/add-location.js country "United Kingdom" GB');
      process.exit(1);
    }
    await addCountry(args[1], args[2].toUpperCase());
  } else if (command === 'city') {
    if (args.length < 3) {
      console.error('❌ Usage: node scripts/add-location.js city <country-slug> <city-name>');
      console.error('Example: node scripts/add-location.js city united-kingdom London');
      process.exit(1);
    }
    await addCity(args[1], args.slice(2).join(' '));
  } else {
    console.error(`❌ Unknown command: ${command}`);
    console.error('Valid commands: country, city');
    process.exit(1);
  }

  rl.close();
}

main().catch(error => {
  console.error('❌ Error:', error);
  rl.close();
  process.exit(1);
});
