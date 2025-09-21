#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Curated images for specific place types and cities
const imageUpdates = [
  // Berlin
  { name: 'Hundesalon Berlin', imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hundezone Prenzlauer Berg', imageUrl: 'https://images.unsplash.com/photo-1544717684-7ad52a7bf8e1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tierarztpraxis Mitte', imageUrl: 'https://images.unsplash.com/photo-1629901925121-8a141c2a42f4?auto=format&fit=crop&w=800&q=80' },
  
  // Barcelona  
  { name: 'Park Güell Dog Walk', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Café Can Deu', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80' },
  
  // Paris
  { name: 'Trocadéro Gardens', imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&w=800&q=80' },
  { name: 'Père Lachaise Cemetery Walk', imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80' },
  { name: 'Café de Flore Dog Terrace', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80' },
  
  // Rome
  { name: 'Villa Borghese Dog Park', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Roman Countryside Trail', imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80' },
];

async function updateImages() {
  console.log('🖼️  Updating place images...\n');
  
  for (const { name, imageUrl } of imageUpdates) {
    try {
      const result = await prisma.place.updateMany({
        where: { name },
        data: { imageUrl }
      });
      
      if (result.count > 0) {
        console.log(`✅ Updated "${name}"`);
      } else {
        console.log(`⚠️  Place not found: "${name}"`);
      }
    } catch (error) {
      console.error(`❌ Error updating "${name}":`, error);
    }
  }
  
  // Update any remaining places without images based on their type
  const placesWithoutImages = await prisma.place.findMany({
    where: { imageUrl: null },
    select: { id: true, name: true, type: true }
  });
  
  console.log(`\n🔍 Found ${placesWithoutImages.length} places without images`);
  
  const typeImageMap: Record<string, string> = {
    park_offleash_area: 'https://images.unsplash.com/photo-1544717684-7ad52a7bf8e1?auto=format&fit=crop&w=800&q=80',
    park_onleash_area: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80',
    trail_hiking: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
    trail_walking: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    beach_dog_friendly: 'https://images.unsplash.com/photo-1517638851339-4aa32003c11a?auto=format&fit=crop&w=800&q=80',
    cafe_dog_friendly: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    restaurant_dog_friendly: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    vet_clinic: 'https://images.unsplash.com/photo-1629901925121-8a141c2a42f4?auto=format&fit=crop&w=800&q=80',
    grooming_salon: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    pet_store: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
  };
  
  for (const place of placesWithoutImages) {
    const imageUrl = typeImageMap[place.type] || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80';
    
    await prisma.place.update({
      where: { id: place.id },
      data: { imageUrl }
    });
    
    console.log(`🎨 Added type-based image for "${place.name}" (${place.type})`);
  }
  
  console.log('\n✨ Finished updating all place images!');
}

updateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());