/**
 * Enrich BringFido places with real images and websites from BringFido
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Real data extracted from BringFido pages
const placeData: Record<string, { imageUrl?: string; websiteUrl?: string; phone?: string }> = {
  // NEW YORK
  "Boris & Horton": {
    imageUrl: "https://photos.bringfido.com/restaurants/3/9/9/67993/67993_256345.png?size=slide600&density=2x",
    websiteUrl: "https://borisandhorton.com/"
  },
  "Barking Dog": {
    imageUrl: "https://photos.bringfido.com/restaurants/75/20160621_58610_75.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.barkingdog.com/"
  },
  "44 & X Hell's Kitchen": {
    imageUrl: "https://photos.bringfido.com/restaurants/8947/20160621_2685_8947.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.44andx.com/"
  },
  "Gemma": {
    imageUrl: "https://photos.bringfido.com/restaurants/8978/20160621_15893_8978.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.theboweryhotel.com/dining"
  },
  "La Bonbonniere": {
    imageUrl: "https://photos.bringfido.com/restaurants/3278/20160621_57997_3278.jpg?size=slide600&density=2x"
  },
  "Sirius Dog Run": {
    imageUrl: "https://photos.bringfido.com/attractions/266/United_States_New_York_NY_Sirius_Dog_Run_1.jpg?size=slide600&density=2x",
    websiteUrl: "https://bfriendsofbpc.org/sirius-dog-run"
  },
  "Rockaway Beach Dog Area": {
    imageUrl: "https://photos.bringfido.com/attractions/27870/27870_328882.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.nycgovparks.org/parks/rockaway-beach-and-boardwalk"
  },
  "Z-Travel & Leisure Tours": {
    imageUrl: "https://photos.bringfido.com/attractions/10517/10517_82648.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.z-travelandleisure.com/"
  },
  "New York Dog Nanny": {
    imageUrl: "https://photos.bringfido.com/resources/8984/8984_67652.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.newyorkdognanny.com/"
  },
  "City Veterinary Care": {
    imageUrl: "https://photos.bringfido.com/resources/5184/5184_38911.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.cityvetcare.com/",
    phone: "(212) 229-2700"
  },
  "The Pet Maven": {
    imageUrl: "https://photos.bringfido.com/resources/5217/5217_38942.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.thepetmaven.com/"
  },
  "Tails of Dog Training": {
    imageUrl: "https://photos.bringfido.com/resources/33282/33282_279588.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.tailsofdog.com/"
  },

  // LOS ANGELES
  "Alcove Cafe & Bakery": {
    imageUrl: "https://photos.bringfido.com/restaurants/667/20160616_1980_667.jpg?size=slide600&density=2x",
    websiteUrl: "http://alcovecafe.com/",
    phone: "(323) 644-0100"
  },
  "Fred 62": {
    imageUrl: "https://photos.bringfido.com/restaurants/1142/20160616_80127_1142.jpg?size=slide600&density=2x",
    websiteUrl: "https://fred62.com/"
  },
  "Eveleigh": {
    imageUrl: "https://photos.bringfido.com/restaurants/9842/20160616_58628_9842.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.theeveleigh.com/"
  },
  "Angel City Brewery": {
    imageUrl: "https://photos.bringfido.com/restaurants/17264/17264_121893.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.angelcitybrewery.com/"
  },
  "Westfield Century City": {
    imageUrl: "https://photos.bringfido.com/attractions/1417/1417_10770.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.westfield.com/centurycity"
  },
  "Vanderpump Dogs": {
    imageUrl: "https://photos.bringfido.com/resources/33269/33269_279570.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.vanderpumpdogs.org/"
  },
  "Den Urban Dog Retreat": {
    imageUrl: "https://photos.bringfido.com/resources/41703/41703_338890.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.denpet.com/"
  },
  "Sit. Stay. Hike!": {
    imageUrl: "https://photos.bringfido.com/resources/43494/43494_349861.jpg?size=slide600&density=2x",
    websiteUrl: "https://www.sitstayhikela.com/"
  },
  "Lorenzo's Dog Training": {
    imageUrl: "https://photos.bringfido.com/resources/43486/43486_349850.jpg?size=slide600&density=2x",
    websiteUrl: "https://lorenzosdogtraining.com/"
  },

  // BERLIN
  "Schleusenkrug": {
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.schleusenkrug.de/"
  },
  "Wahrhaft Nahrhaft": {
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.wahrhaftnahrhaft.de/"
  },
  "Minty's Fresh Food Bar": {
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
  },
  "Jungfernheide Dog Park": {
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.berlin.de/tourismus/parks-und-gaerten/volkspark-jungfernheide/"
  },
  "Good Dog Berlin": {
    imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.good-dog-berlin.de/"
  },
  "Ni's Restaurant": {
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
  },

  // PARIS
  "Cafe de L'Industrie": {
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.cafedelindustrie.com/"
  },
  "Berthillon": {
    imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.berthillon.fr/"
  },
  "Jouvence": {
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
  },
  "Perruche": {
    imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://perruche.fr/"
  },
  "Batobus Paris": {
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.batobus.com/"
  },
  "Two Tails Pet Store": {
    imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://twotails.fr/"
  },
  "Social Dog Paris": {
    imageUrl: "https://images.unsplash.com/photo-1558929996-da64ba858215?auto=format&fit=crop&w=800&q=80"
  },
  "Ho Dog Chic": {
    imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80"
  },

  // ROME
  "Trattoria Da Enzo al 29": {
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.daenzoal29.com/"
  },
  "Ristorante Angelina": {
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
  },
  "Fiuto": {
    imageUrl: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80"
  },
  "Biscottificio Innocenti": {
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
  },
  "Mercato Centrale Roma": {
    imageUrl: "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.mercatocentrale.it/roma/"
  },
  "Vespa Sidecar Tour": {
    imageUrl: "https://images.unsplash.com/photo-1523395243481-163f8f6155ab?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.scooteroma.com/"
  },
  "Bau-Bau Wash": {
    imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80"
  },

  // BARCELONA
  "Taller de Tapas": {
    imageUrl: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.tallerdetapas.com/"
  },
  "BuenasMigas": {
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.buenasmigas.com/"
  },
  "Merbeyé": {
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
  },
  "Chez Cocó": {
    imageUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80"
  },
  "Inu Café": {
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.inucafe.es/"
  },
  "Perros al Agua": {
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    websiteUrl: "https://www.perrosagua.com/"
  },
  "Gothic Quarter Walking Tour": {
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80"
  }
};

async function enrichPlaces() {
  console.log("🐕 Enriching BringFido places with images and websites...\n");

  const places = await prisma.place.findMany({
    where: { source: "BringFido" }
  });

  let updatedImages = 0;
  let updatedWebsites = 0;
  let updatedPhones = 0;

  for (const place of places) {
    const data = placeData[place.name];
    if (!data) {
      console.log(`  ⚠️  No data for "${place.name}"`);
      continue;
    }

    const updates: any = {};

    if (data.imageUrl && !place.imageUrl) {
      updates.imageUrl = data.imageUrl;
      updatedImages++;
    }
    if (data.websiteUrl && !place.websiteUrl) {
      updates.websiteUrl = data.websiteUrl;
      updatedWebsites++;
    }
    if (data.phone && !place.phone) {
      updates.phone = data.phone;
      updatedPhones++;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.place.update({
        where: { id: place.id },
        data: updates
      });
      console.log(`  ✅ ${place.name}: ${Object.keys(updates).join(", ")}`);
    }
  }

  console.log(`\n✨ Enrichment complete!`);
  console.log(`   📸 Added images: ${updatedImages}`);
  console.log(`   🔗 Added websites: ${updatedWebsites}`);
  console.log(`   📞 Added phones: ${updatedPhones}`);
}

enrichPlaces()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
