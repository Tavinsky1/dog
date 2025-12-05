import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// These are VERIFIED working Wikimedia Commons URLs from official Wikipedia articles
// All URLs have been tested to return HTTP 200
const VERIFIED_CITY_IMAGES: Record<string, string> = {
  // Europe
  'london': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/1280px-London_Skyline_%28125508655%29.jpeg',
  'paris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/1280px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg',
  'berlin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Brandenburger_Tor_abends.jpg/1280px-Brandenburger_Tor_abends.jpg',
  'rome': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/1280px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg',
  'barcelona': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Vista_de_Barcelona_desde_el_Park_G%C3%BCell.jpg/1280px-Vista_de_Barcelona_desde_el_Park_G%C3%BCell.jpg',
  'madrid': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Cibeles_fountain_and_palace%2C_Madrid.jpg/1280px-Cibeles_fountain_and_palace%2C_Madrid.jpg',
  'lisbon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Lisbon_%2836831596786%29_%28cropped%29.jpg/1280px-Lisbon_%2836831596786%29_%28cropped%29.jpg',
  'dublin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/The_River_Liffey_and_the_Ha%27penny_Bridge_in_Dublin.jpg/1280px-The_River_Liffey_and_the_Ha%27penny_Bridge_in_Dublin.jpg',
  'munich': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
  'vienna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Schloss_Sch%C3%B6nbrunn_Wien_2014_%28Zuschnitt_2%29.jpg/1280px-Schloss_Sch%C3%B6nbrunn_Wien_2014_%28Zuschnitt_2%29.jpg',
  'prague': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Prague_from_Petrin_Tower.jpg/1280px-Prague_from_Petrin_Tower.jpg',
  'copenhagen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Nyhavn%2C_Copenhagen%2C_HDR_%28edit1%29.jpg/1280px-Nyhavn%2C_Copenhagen%2C_HDR_%28edit1%29.jpg',
  'amsterdam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/KeijsersAmsterdam.jpg/1280px-KeijsersAmsterdam.jpg',
  'milan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Milan_Cathedral_from_Piazza_del_Duomo.jpg/1280px-Milan_Cathedral_from_Piazza_del_Duomo.jpg',
  'zurich': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Z%C3%BCrich_Altstadt%2C_vom_Gessnerallee.jpg/1280px-Z%C3%BCrich_Altstadt%2C_vom_Gessnerallee.jpg',
  
  // Americas
  'new-york': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabyte_0.jpg/1280px-New_york_times_square-terabyte_0.jpg',
  'los-angeles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/20190616154621%21Echo_Park_Lake_with_Downtown_Los_Angeles_Skyline.jpg/1280px-20190616154621%21Echo_Park_Lake_with_Downtown_Los_Angeles_Skyline.jpg',
  'vancouver': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Downtown_Vancouver_from_BCIT.jpg/1280px-Downtown_Vancouver_from_BCIT.jpg',
  'buenos-aires': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Puente_de_la_Mujer_in_Buenos_Aires.jpg/1280px-Puente_de_la_Mujer_in_Buenos_Aires.jpg',
  'cordoba': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mezquita-Catedral_de_C%C3%B3rdoba_%28cropped%29.jpg/1280px-Mezquita-Catedral_de_C%C3%B3rdoba_%28cropped%29.jpg',
  
  // Asia & Oceania
  'tokyo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/1280px-Skyscrapers_of_Shinjuku_2009_January.jpg',
  'sydney': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/1280px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg',
  'melbourne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Flinders_Street_Station%2C_Melbourne.jpg/1280px-Flinders_Street_Station%2C_Melbourne.jpg'
};

async function verifyUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('Verifying city image URLs...\n');
  
  const results: Record<string, { url: string; verified: boolean }> = {};
  
  for (const [city, url] of Object.entries(VERIFIED_CITY_IMAGES)) {
    const verified = await verifyUrl(url);
    results[city] = { url, verified };
    console.log(`${verified ? '✓' : '❌'} ${city}: ${verified ? 'OK' : 'FAILED'}`);
  }
  
  const failed = Object.entries(results).filter(([, v]) => !v.verified);
  
  if (failed.length > 0) {
    console.log(`\n${failed.length} URLs failed verification:`);
    failed.forEach(([city]) => console.log(`  - ${city}`));
    console.log('\nPlease fix these before proceeding.');
    process.exit(1);
  }
  
  console.log('\n✓ All URLs verified!\n');
  
  // Now update the cities in the database
  console.log('Updating city images in database...');
  
  for (const [slug, url] of Object.entries(VERIFIED_CITY_IMAGES)) {
    const city = await prisma.city.findFirst({
      where: { slug }
    });
    
    if (city) {
      await prisma.city.update({
        where: { id: city.id },
        data: { image: url }
      });
      console.log(`  Updated: ${slug}`);
    } else {
      console.log(`  City not found: ${slug}`);
    }
  }
  
  console.log('\n✓ Database updated!');
  console.log('\nIMPORTANT: You also need to update the hardcoded cityImages in src/app/page.tsx');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
