/**
 * Script to add city images and dog rules to countries.json
 * Run with: node scripts/add-city-metadata.js
 */

const fs = require('fs');
const path = require('path');

const COUNTRIES_FILE = path.join(__dirname, '../data/countries.json');

// City metadata: images and dog rules
const cityMetadata = {
  'berlin': {
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80', // TV Tower
    dogRules: [
      '🟢 Dogs allowed off-leash in designated dog zones',
      '🔴 Must be on leash in public spaces and transport',
      '📝 Dog tax (Hundesteuer) required - register within 2 weeks',
      '💰 Annual fee: €120/year (first dog), €180 (additional dogs)',
      '🧹 Always carry waste bags - fines up to €35',
      '🚇 Dogs allowed on public transport with reduced ticket',
      '⏰ Quiet hours 22:00-06:00 in residential areas'
    ]
  },
  'barcelona': {
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80', // Sagrada Familia
    dogRules: [
      '🟢 Dogs allowed in most parks with leash',
      '🔴 Banned from beaches May-September (except designated zones)',
      '📝 Microchip and registration required',
      '🧹 Clean up waste immediately - fines up to €750',
      '🚇 Small dogs allowed on metro in carrier/bag',
      '🏖️ 4 official dog beaches open year-round',
      '⏰ Off-leash zones: 22:00-08:00 in some parks'
    ]
  },
  'paris': {
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80', // Eiffel Tower
    dogRules: [
      '🟢 Dogs welcome in cafés and restaurants (owner\'s discretion)',
      '🔴 Banned from children\'s play areas and most public gardens',
      '📝 Vaccination certificate and identification required',
      '🧹 Must clean up waste - fines up to €450',
      '🚇 Small dogs in carrier/bag on metro, large dogs muzzled off-peak',
      '🏞️ Bois de Vincennes & Bois de Boulogne allow off-leash',
      '⚠️ Dangerous dogs (category 1 & 2) must be muzzled'
    ]
  },
  'rome': {
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', // Colosseum
    dogRules: [
      '🟢 Dogs allowed in most restaurants with outdoor seating',
      '🔴 Banned from archaeological sites and monuments',
      '📝 Microchip and health certificate required',
      '🧹 Clean up waste - fines up to €500',
      '🚇 Dogs allowed on metro if muzzled or in carrier',
      '🏖️ Many beaches ban dogs June-September',
      '🏞️ Villa Borghese has designated off-leash areas'
    ]
  },
  'vienna': {
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80', // Schönbrunn Palace
    dogRules: [
      '🟢 Dogs welcome in most parks and cafés',
      '🔴 Must be on leash in city center and public transport',
      '📝 Dog tax (Hundeabgabe) required',
      '💰 Annual fee: €72/year',
      '🧹 Clean up waste - fines up to €36',
      '🚇 Dogs free on public transport if muzzled or in carrier',
      '🏞️ Prater and Donauinsel have off-leash zones'
    ]
  },
  'amsterdam': {
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80', // Canal houses
    dogRules: [
      '🟢 Very dog-friendly city - welcome almost everywhere',
      '🔴 Must be on leash in Vondelpark and city center',
      '📝 Microchip and registration required',
      '🧹 Clean up waste - fines up to €140',
      '🚇 Dogs allowed on public transport with dog ticket',
      '🏖️ Designated dog beaches at Blijburg and Zandvoort',
      '🚴 Dogs can ride in bike baskets if comfortable'
    ]
  },
  'new-york': {
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', // NYC Skyline
    dogRules: [
      '🟢 Dogs allowed in most outdoor restaurants',
      '🔴 Must be on leash (max 6 ft) except in dog runs',
      '📝 License required - renew annually ($8.50-$34)',
      '🧹 Scoop the poop law - fines up to $250',
      '🚇 Dogs allowed on subway if in carrier',
      '🏞️ 70+ off-leash dog parks throughout the 5 boroughs',
      '⏰ Morning off-leash hours: 9PM-9AM in some parks'
    ]
  },
  'los-angeles': {
    image: 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261?auto=format&fit=crop&w=800&q=80', // LA Skyline
    dogRules: [
      '🟢 Very pet-friendly - dogs welcome in most outdoor spaces',
      '🔴 Must be on leash except in designated dog parks',
      '📝 License required - $20/year (spayed/neutered), $60 (intact)',
      '🧹 Clean up waste or face fines up to $500',
      '🏖️ Leo Carrillo & Rosie\'s Dog Beach allow off-leash',
      '🚗 Never leave dog in parked car - up to $500 fine',
      '🏞️ 100+ dog parks including off-leash areas'
    ]
  },
  'sydney': {
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80', // Sydney Opera House
    dogRules: [
      '🟢 Dogs allowed in most parks during off-leash hours',
      '🔴 Must be on leash in public areas',
      '📝 Registration and microchip mandatory',
      '💰 Annual registration: $52-$267 depending on status',
      '🧹 Clean up waste - fines up to $880',
      '🏖️ Several beaches allow dogs outside peak hours',
      '⏰ Check local council for specific off-leash times'
    ]
  },
  'melbourne': {
    image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=800&q=80', // Melbourne skyline
    dogRules: [
      '🟢 One of Australia\'s most dog-friendly cities',
      '🔴 On-leash required except in off-leash parks',
      '📝 Registration and microchip required',
      '💰 Annual fee: $52-$267 based on desexed status',
      '🧹 Scoop waste or face fines up to $466',
      '🏖️ St Kilda Dog Beach open year-round',
      '🚇 Small dogs in carriers on public transport'
    ]
  },
  'buenos-aires': {
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80', // Buenos Aires Obelisk
    dogRules: [
      '🟢 Very dog-friendly culture - dogs everywhere',
      '🔴 Technically must be on leash, but loosely enforced',
      '📝 Registration recommended but not strictly enforced',
      '🧹 Clean up waste in public spaces',
      '🏞️ Palermo parks very popular with dog owners',
      '🍽️ Most outdoor cafés welcome dogs',
      '🚇 Dogs allowed on Subte (metro) outside peak hours'
    ]
  },
  'cordoba': {
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80', // Córdoba architecture
    dogRules: [
      '🟢 Relaxed attitude toward dogs in public spaces',
      '🔴 Leash required in city center',
      '📝 Registration through municipal system',
      '🧹 Clean up waste in parks and public areas',
      '🏞️ Parque Sarmiento has designated dog areas',
      '🍽️ Many cafés in Nueva Córdoba welcome dogs',
      '🏔️ Mountain trails around city are dog-friendly'
    ]
  },
  'tokyo': {
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80', // Tokyo cityscape
    dogRules: [
      '🟢 Growing pet-friendly culture, especially in cafés',
      '🔴 Must be on leash in all public spaces',
      '📝 Registration required within 30 days of ownership',
      '💰 Annual fee: ¥3,000 (~$20)',
      '🧹 Always clean up waste - carry bags',
      '🚇 Dogs allowed on trains in carriers/bags only',
      '🏞️ Designated dog runs in Yoyogi and other major parks'
    ]
  }
};

// Read current data
console.log('📖 Reading countries.json...');
const data = JSON.parse(fs.readFileSync(COUNTRIES_FILE, 'utf8'));

// Add metadata to each city
let updatedCount = 0;
for (const country of data.countries) {
  for (const city of country.cities) {
    const metadata = cityMetadata[city.slug];
    if (metadata) {
      city.image = metadata.image;
      city.dogRules = metadata.dogRules;
      updatedCount++;
      console.log(`✅ Updated ${city.name} with image and ${metadata.dogRules.length} rules`);
    } else {
      console.log(`⚠️  No metadata found for ${city.name} (${city.slug})`);
    }
  }
}

// Update metadata
data.metadata.lastUpdated = new Date().toISOString();
data.metadata.version = '1.2.0';

// Write back to file
console.log('\n💾 Writing updated data...');
fs.writeFileSync(COUNTRIES_FILE, JSON.stringify(data, null, 2), 'utf8');

console.log(`\n🎉 Success! Updated ${updatedCount} cities with images and dog rules`);
console.log(`📍 File: ${COUNTRIES_FILE}`);
