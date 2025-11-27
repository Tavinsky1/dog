import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Real Wikipedia/Wikimedia Commons images for each city
const cityImages = {
  'amsterdam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/KesseltekrachsteinAmsterdam.jpg/1280px-KeizersgrachtAmsterdam.jpg',
  'barcelona': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_%28cropped%29.jpg/1280px-Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_%28cropped%29.jpg',
  'berlin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Museumsinsel_Berlin_Juli_2021_1_%28cropped%29.jpg/1280px-Museumsinsel_Berlin_Juli_2021_1_%28cropped%29.jpg',
  'buenos-aires': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Buenos_Aires_-_Microcentro_-_Edificio_Kavanagh.jpg/800px-Buenos_Aires_-_Microcentro_-_Edificio_Kavanagh.jpg',
  'cordoba': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Mezquita_de_C%C3%B3rdoba_desde_el_aire_%28C%C3%B3rdoba%2C_Espa%C3%B1a%29.jpg/1280px-Mezquita_de_C%C3%B3rdoba_desde_el_aire_%28C%C3%B3rdoba%2C_Espa%C3%B1a%29.jpg',
  'los-angeles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/LA_Skyline_Mountains2.jpg/1280px-LA_Skyline_Mountains2.jpg',
  'melbourne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Melbourne_skyline_from_Southbank_-_Nov_2008.jpg/1280px-Melbourne_skyline_from_Southbank_-_Nov_2008.jpg',
  'new-york': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabyte.jpg/1280px-New_york_times_square-terabyte.jpg',
  'paris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/800px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg',
  'rome': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Rome_Skyline_%288012016319%29.jpg/1280px-Rome_Skyline_%288012016319%29.jpg',
  'sydney': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sydney_Opera_House_-_Dec_2008.jpg/1280px-Sydney_Opera_House_-_Dec_2008.jpg',
  'tokyo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/1280px-Skyscrapers_of_Shinjuku_2009_January.jpg',
  'vienna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Schloss_Schoenbrunn_August_2006_406.jpg/1280px-Schloss_Schoenbrunn_August_2006_406.jpg'
};

async function updateCityImages() {
  console.log('Updating city images...');
  
  for (const [slug, image] of Object.entries(cityImages)) {
    try {
      await prisma.city.update({
        where: { slug },
        data: { image }
      });
      console.log(`✓ ${slug}: Updated with real image`);
    } catch (e) {
      console.log(`✗ ${slug}: ${e.message}`);
    }
  }
  
  // Verify all cities have images
  const cities = await prisma.city.findMany({ orderBy: { name: 'asc' } });
  console.log('\n=== City Image Status ===');
  for (const city of cities) {
    const status = city.image ? '✓' : '✗ MISSING';
    console.log(`${status} ${city.name}`);
  }
  
  await prisma.$disconnect();
}

updateCityImages().catch(console.error);
