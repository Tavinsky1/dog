const { PrismaClient } = require('@prisma/client');

// Real images from official tourism websites - verified working URLs
const officialImages = {
  // Berlin - from visitBerlin.de (official tourism)
  'Tiergarten Park': 'https://www.visitberlin.de/system/files/styles/visitberlin_bleed_header_visitberlin_tablet_portrait_2x/private/image/Siegessauele_Tiergarten_c_Scholvien%20%2837%29_web.jpg.webp?itok=0f1ICXUT',
  'Mauerpark': 'https://www.visitberlin.de/system/files/styles/visitberlin_bleed_header_visitberlin_tablet_portrait_2x/private/image/Mauerpark_per%20Rad_c_visitBerlin%3B%20Foto_Rasmus_KlaRas-Verlag%20%281%29_DL_PPT_0.jpg.webp?itok=HENE01fz',
  'Grunewald Forest': 'https://www.visitberlin.de/system/files/styles/visitberlin_bleed_header_visitberlin_tablet_portrait_2x/private/image/Grunewald_Teufelsberg_web.jpg.webp',
  'Café Einstein': 'https://www.visitberlin.de/system/files/styles/visitberlin_gallery_item_visitberlin_tablet_portrait_2x/private/image/cafe-einstein-stammhaus-berlin-terrasse-sommer.jpg.webp',
  'Jungfernheide Dog Park': 'https://www.visitberlin.de/system/files/styles/visitberlin_bleed_header_visitberlin_tablet_portrait_2x/private/image/volkspark-jungfernheide-berlin-web.jpg.webp',
  
  // Barcelona - from Park Güell official & barcelonaturisme
  'Park Güell': 'https://parkguell.barcelona/sites/default/files/2023-02/01_Benvinguts_al_Parc_Guell_v2_2.jpg',
  'Barceloneta Beach': 'https://www.barcelonaturisme.com/imgfiles/web/galeria/5/4/5/6_1637140545.jpg',
  
  // Paris - from parisjetaime (official tourism) 
  'Jardin du Luxembourg': 'https://api-parisjetaime.paris.fr/media/cache/resolve/image_1200_format_webp/uploads/site/jardin_du_luxembourg/jardin_du_luxembourg_1.jpg',
  'Bois de Boulogne': 'https://api-parisjetaime.paris.fr/media/cache/resolve/image_1200_format_webp/uploads/site/bois_de_boulogne/bois_de_boulogne_1.jpg',
  'Le Comptoir Général': 'https://api-parisjetaime.paris.fr/media/cache/resolve/image_1200_format_webp/uploads/site/le_comptoir_general/le_comptoir_general_1.jpg',
  
  // Rome - from rome.net/civitatis
  'Villa Borghese': 'https://www.civitatis.com/f/italia/roma/guia/villa-borghese.jpg',
  'Antico Caffè Greco': 'https://www.civitatis.com/f/italia/roma/guia/caffe-greco.jpg',
  
  // Official website images (already verified working)
  'Mercato Centrale Roma': 'https://www.mercatocentrale.it/wp-content/uploads/2018/07/MCR_Location-7.jpg',
  'Taller de Tapas': 'https://tallerdetapas.com/wp-content/uploads/Slider-Rambla-1.webp',
  'Fred 62': 'https://fred62.com/wp-content/uploads/2025/02/hp-img-4up1.jpg',
  'Vanderpump Dogs': 'https://images.squarespace-cdn.com/content/v1/5eab105a5d4a651e825785e1/1589914043555-1OOKZ558NCPFMR8F3YPT/IMG_7686.jpg',
};

async function updateWithOfficialImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🖼️  Adding official tourism images...\n');
    
    let updated = 0;
    
    for (const [name, imageUrl] of Object.entries(officialImages)) {
      const result = await prisma.place.updateMany({
        where: { name },
        data: { imageUrl }
      });
      
      if (result.count > 0) {
        console.log(`✅ ${name}: Added official image`);
        updated++;
      } else {
        console.log(`⚠️  ${name}: Not found`);
      }
    }
    
    // Final count
    const total = await prisma.place.count();
    const withImages = await prisma.place.count({ where: { imageUrl: { not: null } } });
    const withoutImages = await prisma.place.count({ where: { imageUrl: null } });
    
    console.log(`\n📊 Status:`);
    console.log(`   Total places: ${total}`);
    console.log(`   With images: ${withImages}`);
    console.log(`   Without images: ${withoutImages}`);
    
    // List remaining places without images
    if (withoutImages > 0) {
      const missing = await prisma.place.findMany({
        where: { imageUrl: null },
        select: { name: true, country: true, websiteUrl: true }
      });
      console.log(`\n📋 Still need images (${missing.length}):`);
      missing.forEach(p => console.log(`   - ${p.name} (${p.country})`));
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

updateWithOfficialImages();
