#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Curated images for specific place types and cities
const imageUpdates = [
  // Berlin
  { name: 'Hundesalon Berlin', imageUrl: 'https://images.unsplash.com/photo-1596797882460-8da8d73b64c4?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hundezone Prenzlauer Berg', imageUrl: 'https://images.unsplash.com/photo-1589928383133-1a84f7543787?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tierarztpraxis Mitte', imageUrl: 'https://images.unsplash.com/photo-1583224964983-286a4744b78c?auto=format&fit=crop&w=800&q=80' },
  
  // Barcelona  
  { name: 'Park Güell Dog Walk', imageUrl: 'https://images.unsplash.com/photo-1587009894883-0402c3a5e954?auto=format&fit=crop&w=800&q=80' },
  { name: 'Café Can Deu', imageUrl: 'https://images.unsplash.com/photo-1567423281822-66d4a8a8b132?auto=format&fit=crop&w=800&q=80' },
  
  // Paris
  { name: 'Trocadéro Gardens', imageUrl: 'https://images.unsplash.com/photo-1558509302-9ae1c4a45a30?auto=format&fit=crop&w=800&q=80' },
  { name: 'Père Lachaise Cemetery Walk', imageUrl: 'https://images.unsplash.com/photo-1601202829142-63556e398d89?auto=format&fit=crop&w=800&q=80' },
  { name: 'Café de Flore Dog Terrace', imageUrl: 'https://images.unsplash.com/photo-1541167760496-162885647544?auto=format&fit=crop&w=800&q=80' },
  
  // Rome
  { name: 'Villa Borghese Dog Park', imageUrl: 'https://images.unsplash.com/photo-1599863484223-99ffff999120?auto=format&fit=crop&w=800&q=80' },
  { name: 'Roman Countryside Trail', imageUrl: 'https://images.unsplash.com/photo-1533174340755-d1e9e7b27a3c?auto=format&fit=crop&w=800&q=80' },
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
    park_offleash_area: 'https://images.unsplash.com/photo-1589928383133-1a84f7543787?auto=format&fit=crop&w=800&q=80',
    park_onleash_area: 'https://images.unsplash.com/photo-1558818184-4d8d3a6c5f4d?auto=format&fit=crop&w=800&q=80',
    trail_hiking: 'https://images.unsplash.com/photo-1592659762303-90081d34b277?auto=format&fit=crop&w=800&q=80',
    trail_walking: 'https://images.unsplash.com/photo-1500462918414-b6314532b2f8?auto=format&fit=crop&w=800&q=80',
    beach_dog_friendly: 'https://images.unsplash.com/photo-1548574542-34a3b9138d27?auto=format&fit=crop&w=800&q=80',
    cafe_dog_friendly: 'https://images.unsplash.com/photo-1559925393-8be0ec4764c8?auto=format&fit=crop&w=800&q=80',
    restaurant_dog_friendly: 'https://images.unsplash.com/photo-1579871494447-a02a721cc45e?auto=format&fit=crop&w=800&q=80',
    vet_clinic: 'https://images.unsplash.com/photo-1583224964983-286a4744b78c?auto=format&fit=crop&w=800&q=80',
    grooming_salon: 'https://images.unsplash.com/photo-1596797882460-8da8d73b64c4?auto=format&fit=crop&w=800&q=80',
    pet_store: 'https://images.unsplash.com/photo-1585250003342-2b6883b17485?auto=format&fit=crop&w=800&q=80',
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