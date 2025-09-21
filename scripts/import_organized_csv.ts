import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function mapPlaceType(csvType: string): string {
  const typeMapping: { [key: string]: string } = {
    // Vet services
    'vet / emergency 24h': 'vet_emergency',
    'vet (general & surgery)': 'vet_clinic',
    'vet (general practice)': 'vet_clinic',
    'vet_emergency': 'vet_emergency',
    'vet_clinic': 'vet_clinic',
    
    // Hotels
    'hotel': 'hotel_pet_friendly',
    'hotel_pet_friendly': 'hotel_pet_friendly',
    
    // Parks and trails
    'park / airfield': 'park_offleash_area',
    'urban park': 'park_onleash_area',
    'forest / lake loop': 'trail_hiking',
    'lake / trail': 'trail_hiking',
    'trail_hike': 'trail_hiking',
    'park_offleash_area': 'park_offleash_area',
    'park_onleash_area': 'park_onleash_area',
    'trail_hiking': 'trail_hiking',
    'trail_walking': 'trail_walking',
    
    // Water activities
    'lake_swim': 'lake_dog_friendly',
    'beach_dog_friendly': 'beach_dog_friendly',
    'lake_dog_friendly': 'lake_dog_friendly',
    
    // Food and drink
    'cafe_restaurant_bar': 'cafe_dog_friendly',
    'cafe_dog_friendly': 'cafe_dog_friendly',
    'restaurant_dog_friendly': 'restaurant_dog_friendly',
    'brewery_dog_friendly': 'brewery_dog_friendly',
    
    // Other services
    'dog_hotel_boarding': 'doggy_daycare',
    'doggy_daycare': 'doggy_daycare',
    'grooming_salon': 'grooming_salon',
    'pet_store': 'pet_store',
    'dog_training': 'dog_training',
    
    // Default fallback
    'other': 'park_onleash_area'
  };
  
  return typeMapping[csvType] || typeMapping['other'];
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function safeJsonParse(jsonString: string) {
  if (!jsonString || jsonString.trim() === '') return null;
  
  try {
    // Handle the CSV format with escaped quotes: "[""item1"", ""item2""]"
    if (jsonString.startsWith('"[') && jsonString.endsWith(']"')) {
      // Convert to proper JSON: ["item1", "item2"]
      const cleaned = jsonString
        .slice(2, -2) // Remove outer quotes and brackets
        .split('", "') // Split on ", "
        .map(item => item.replace(/^"/, '').replace(/"$/, '')); // Remove remaining quotes
      return cleaned;
    }
    
    // Try to parse as regular JSON
    return JSON.parse(jsonString);
  } catch (error) {
    // If JSON parsing fails, treat as comma-separated values or single value
    const trimmed = jsonString.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      // Remove quotes and split by comma if it's a quoted string
      const content = trimmed.slice(1, -1);
      if (content.includes(',')) {
        return content.split(',').map(item => item.trim());
      } else {
        return [content];
      }
    } else if (trimmed.includes(',')) {
      // Split by comma
      return trimmed.split(',').map(item => item.trim());
    } else {
      // Single value
      return [trimmed];
    }
  }
}

async function importCSV(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header and one data row');
  }
  
  const headers = lines[0].split(',').map(h => h.trim());
  const places: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing that handles quoted fields with nested quotes
    const row: any = {};
    let currentField = '';
    let inQuotes = false;
    let fieldIndex = 0;
    let j = 0;
    
    while (j < line.length) {
      const char = line[j];
      
      if (char === '"') {
        if (inQuotes) {
          // Check if this is an escaped quote or end of field
          if (j + 1 < line.length && line[j + 1] === '"') {
            // Escaped quote - add single quote
            currentField += '"';
            j += 2; // Skip both quotes
            continue;
          } else {
            // End of quoted field
            inQuotes = false;
            j++;
            continue;
          }
        } else {
          // Start of quoted field
          inQuotes = true;
          j++;
          continue;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        row[headers[fieldIndex]] = currentField.trim();
        currentField = '';
        fieldIndex++;
        j++;
      } else {
        currentField += char;
        j++;
      }
    }
    
    // Add the last field
    if (fieldIndex < headers.length) {
      row[headers[fieldIndex]] = currentField.trim();
    }
    
    places.push(row);
  }
  
  console.log(`Found ${places.length} places in ${filePath}`);
  
  for (const place of places) {
    try {
      const slug = generateSlug(place.name);

      // Find the city by name to get cityId
      const city = await prisma.city.findFirst({
        where: { name: place.city }
      });

      if (!city) {
        console.warn(`City "${place.city}" not found for place "${place.name}", skipping...`);
        continue;
      }

      await prisma.place.upsert({
        where: { slug: slug },
        update: {
          name: place.name,
          type: mapPlaceType(place.type) as any,
          cityId: city.id,
          region: place.region,
          country: place.country || 'Germany',
          lat: parseFloat(place.lat) || 0,
          lng: parseFloat(place.lng) || 0,
          shortDescription: place.shortDescription || place.fullDescription || `${place.name} - ${place.type}`.substring(0, 200),
          fullDescription: place.fullDescription,
          imageUrl: place.imageUrl,
          gallery: place.gallery ? safeJsonParse(place.gallery) : null,
          dogFriendlyLevel: parseInt(place.dogFriendlyLevel) || null,
          amenities: place.amenities ? safeJsonParse(place.amenities) : null,
          rules: place.rules,
          websiteUrl: place.websiteUrl,
          phone: place.phone,
          email: place.email,
          priceRange: place.priceRange,
          openingHours: place.openingHours,
          rating: parseFloat(place.rating) || null,
          tags: place.tags ? safeJsonParse(place.tags) : null,
          source: place.source || 'csv_import'
        },
        create: {
          slug: slug,
          name: place.name,
          type: mapPlaceType(place.type) as any,
          cityId: city.id,
          region: place.region,
          country: place.country || 'Germany',
          lat: parseFloat(place.lat) || 0,
          lng: parseFloat(place.lng) || 0,
          shortDescription: place.shortDescription || place.fullDescription || `${place.name} - ${place.type}`.substring(0, 200),
          fullDescription: place.fullDescription,
          imageUrl: place.imageUrl,
          gallery: place.gallery ? safeJsonParse(place.gallery) : null,
          dogFriendlyLevel: parseInt(place.dogFriendlyLevel) || null,
          amenities: place.amenities ? safeJsonParse(place.amenities) : null,
          rules: place.rules,
          websiteUrl: place.websiteUrl,
          phone: place.phone,
          email: place.email,
          priceRange: place.priceRange,
          openingHours: place.openingHours,
          rating: parseFloat(place.rating) || null,
          tags: place.tags ? safeJsonParse(place.tags) : null,
          source: place.source || 'csv_import'
        }
      });
    } catch (error) {
      console.error(`Error importing place ${place.name}:`, error);
    }
  }

  console.log(`Imported ${places.length} places from ${path.basename(filePath)}`);
  return places.length;
}

async function main() {
  try {
    // Check for organized CSV files first (with Prisma field names)
    const organizedCsvFiles = [
      'data csv/dog_atlas_berlin_ordered.csv',
      'data csv/dog_atlas_paris_ordered.csv',
      'data csv/dog_atlas_barcelona_ordered.csv',
      'data csv/dog_atlas_rome_ordered.csv',
      'data csv/dog_atlas_amsterdam_ordered.csv',
      'data csv/dog_atlas_vienna_ordered.csv'
    ];

    // Fallback to original CSV files (with old field names)
    const originalCsvFiles = [
      'data/dog_atlas_berlin_v0_7.csv',
      'data/dog_atlas_paris_v0_7.csv',
      'data/dog_atlas_barcelona_v0_7.csv',
      'data/dog_atlas_rome_v0_7.csv'
    ];

    let totalImported = 0;
    let filesProcessed = 0;

    // Try organized files first
    for (const file of organizedCsvFiles) {
      if (fs.existsSync(file)) {
        console.log(`Importing organized file: ${file}...`);
        const count = await importCSV(file);
        totalImported += count as number;
        filesProcessed++;
      }
    }

    // If no organized files found, try original files
    if (filesProcessed === 0) {
      console.log('No organized CSV files found, trying original format...');
      for (const file of originalCsvFiles) {
        if (fs.existsSync(file)) {
          console.log(`Importing original file: ${file}...`);
          const count = await importCSV(file);
          totalImported += count as number;
          filesProcessed++;
        } else {
          console.log(`File ${file} not found, skipping...`);
        }
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`📊 Total files processed: ${filesProcessed}`);
    console.log(`📍 Total places imported: ${totalImported}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();