import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PlaceData {
  id: string;
  name: string;
  type: string;
  shortDescription: string | null;
  cityName: string;
  country: string;
}

// Generate rich description based on place type and context
function generateRichDescription(place: PlaceData): { short: string; full: string } {
  const { name, type, cityName, shortDescription } = place;
  
  // Use existing short description as base or create one
  const baseShort = shortDescription || `Dog-friendly ${type.replace(/_/g, ' ')} in ${cityName}`;
  
  let short = baseShort;
  let full = '';

  switch (type) {
    case 'parks':
      short = baseShort.length > 120 ? baseShort : `${baseShort}. A perfect green space for dogs to explore, play, and socialize.`;
      full = generateParkDescription(place);
      break;
    
    case 'cafes_restaurants':
      short = baseShort.length > 120 ? baseShort : `${baseShort}. Welcome your furry friend with outdoor seating and water bowls.`;
      full = generateCafeDescription(place);
      break;
    
    case 'walks_trails':
      short = baseShort.length > 120 ? baseShort : `${baseShort}. Scenic walking route ideal for daily dog exercise and exploration.`;
      full = generateTrailDescription(place);
      break;
    
    case 'accommodation':
      short = baseShort.length > 120 ? baseShort : `${baseShort}. Pet-friendly lodging with special amenities for traveling dogs.`;
      full = generateAccommodationDescription(place);
      break;
    
    case 'shops_services':
      short = baseShort.length > 120 ? baseShort : `${baseShort}. Professional pet care services and supplies for your dog.`;
      full = generateShopDescription(place);
      break;
    
    case 'tips_local_info':
      short = baseShort.length > 120 ? baseShort : `${baseShort}. Essential local information for dog owners visiting the area.`;
      full = generateTipsDescription(place);
      break;
    
    default:
      short = baseShort;
      full = generateGenericDescription(place);
  }

  return { short, full };
}

function generateParkDescription(place: PlaceData): string {
  return `${place.name} is a beloved green space for dog owners in ${place.cityName}, offering a perfect environment for canine exercise, socialization, and outdoor enjoyment.

**Park Features for Dogs:**
This park provides ample space for dogs to explore and play, with well-maintained paths suitable for walks of all lengths. The green areas allow dogs to enjoy natural surroundings while getting their daily exercise. Many local dog owners choose this park for its welcoming atmosphere and dog-friendly facilities.

**What to Expect:**
The park features a mix of open spaces and shaded areas, making it comfortable to visit year-round. You'll often find other dog owners here, creating opportunities for your pup to socialize with friendly canines. The paths are well-suited for dogs of all sizes and energy levels, from gentle strolls with senior dogs to energetic runs with active breeds.

**Facilities & Amenities:**
- Dog waste stations (please bring backup bags)
- Accessible paths for easy navigation
- Benches and rest areas for owners
- Water access points nearby
- Generally well-lit for evening walks
- Regular maintenance ensures clean, safe conditions

**Best Times to Visit:**
Early mornings and late afternoons tend to be the most popular times for dog walkers, offering cooler temperatures and a friendly community atmosphere. Weekday visits can be quieter if your dog prefers less crowded environments. Each season brings its own charm, from spring blossoms to autumn foliage.

**Local Dog Etiquette:**
Please follow local leash regulations, which vary by area and time of day. Always clean up after your dog and keep them under control around other park users. Respect wildlife and natural habitats. If your dog is off-leash in permitted areas, ensure they have reliable recall.

**Practical Tips:**
Check weather conditions before visiting, as some areas may be muddy after rain. Bring plenty of water, especially during warmer months. If your dog is reactive or nervous, early morning visits when the park is quieter might be more enjoyable. The local dog owner community is usually friendly and happy to share their favorite routes and tips.`;
}

function generateCafeDescription(place: PlaceData): string {
  return `${place.name} welcomes four-legged visitors, making it a perfect spot to enjoy quality time with your dog in ${place.cityName}. This dog-friendly establishment understands that dogs are part of the family.

**Dog-Friendly Atmosphere:**
The cafe provides a warm welcome to well-behaved dogs, typically offering outdoor seating where your pup can relax by your side. The staff is generally accommodating and understands the needs of pet owners. Many regular customers bring their dogs, creating a pet-friendly community atmosphere.

**What Dogs Can Expect:**
Water bowls are usually available upon request, ensuring your furry friend stays hydrated during your visit. The outdoor seating area is designed to comfortably accommodate dogs of various sizes. The ambiance is relaxed enough that even dogs new to cafe culture can feel at ease.

**Menu & Offerings:**
While the focus is on human dining, many dog-friendly cafes keep a few treats on hand for their canine customers. The menu typically features quality beverages and food options that let you linger comfortably. Service is often attentive to both you and your pet's needs.

**Best Times to Visit:**
Weekday mornings and mid-afternoons tend to be quieter, perfect if your dog is still getting used to busy environments. Weekend brunch hours can be livelier with more families and dogs—great for socialization. Evening hours might have table service that works better with calmer dogs.

**Important Guidelines:**
Dogs should remain on-leash and stay close to your table. Please ensure your dog is comfortable around people and other pets before visiting. Clean up any accidents immediately. If your dog is anxious or reactive, consider takeaway options or quieter visiting times.

**Location & Access:**
Conveniently located in ${place.cityName}, with reasonable access for dog owners. Check if there's nearby parking or public transport options that allow pets. The area usually has good walking options before or after your visit.

**Pro Tips:**
Call ahead during peak times to confirm dog-friendly seating availability. Bring your dog's favorite mat or blanket for them to lie on. A tired dog is a happy cafe dog—consider a quick walk beforehand. Reward good behavior with the treats they provide or bring your own.`;
}

function generateTrailDescription(place: PlaceData): string {
  return `${place.name} offers an excellent walking route for dogs and their owners in ${place.cityName}, providing exercise, exploration, and scenic enjoyment for canine companions.

**Trail Overview:**
This walking route provides a dedicated path for dog owners seeking quality outdoor time with their pets. The trail is designed for various fitness levels, accommodating everything from casual strolls to more energetic hikes. Regular visitors appreciate the natural beauty and dog-friendly atmosphere.

**Terrain & Difficulty:**
The path features a manageable surface suitable for most dogs, from small breeds to large athletic dogs. Trail conditions are generally well-maintained, though seasonal variations may affect certain sections. The route offers a good balance of exercise and exploration without being overly challenging for average fitness levels.

**What Makes It Special:**
Dogs enjoy the varied scenery and interesting smells along the route. The trail often provides enough width for dogs to walk comfortably alongside their owners. Natural features along the way create engagement and interest for curious canines. The environment typically offers a good mix of sun and shade.

**Distance & Duration:**
The trail can be adapted to your schedule and your dog's energy level. Shorter sections work perfectly for quick exercise breaks, while the full route provides a substantial workout for energetic dogs. Most dog owners complete the route at a comfortable pace that allows for sniffing stops and rest breaks.

**Safety Considerations:**
Check local leash requirements before your visit, as regulations may vary by section or season. Watch for wildlife that might distract or excite your dog. Uneven terrain in some areas requires attention to prevent paw injuries. Weather conditions can significantly affect trail conditions—plan accordingly.

**Facilities Along the Route:**
- Access points at multiple locations for flexible walk lengths
- Dog waste disposal stations (bring backup bags)
- Water sources at key points (bring a collapsible bowl)
- Rest areas for both dogs and humans
- Generally good visibility for supervision
- Signage for navigation and safety

**Best Seasons & Times:**
Spring and autumn often provide ideal walking conditions with comfortable temperatures. Early mornings offer cooler temperatures and fewer crowds in summer. Winter visits can be beautiful but check for weather-related closures. Avoid midday heat during summer months.

**Dog Community:**
You'll likely encounter other dog owners, creating socialization opportunities for friendly dogs. The trail attracts a mix of breeds and ages. Most visitors are experienced dog owners who understand proper trail etiquette. Exchange of local tips and recommendations is common.

**Preparation Tips:**
Bring more water than you think you'll need, especially in warm weather. A basic first aid kit for minor paw injuries is wise. Check your dog's paws after the walk for cuts or debris. Tick prevention is recommended in appropriate seasons. Let someone know your planned route and expected return time for longer walks.`;
}

function generateAccommodationDescription(place: PlaceData): string {
  return `${place.name} offers pet-friendly accommodation in ${place.cityName}, understanding that your dog is an essential part of your travel plans and deserves comfortable lodging too.

**Pet Policy & Welcome:**
This establishment actively welcomes dogs as guests, recognizing that many travelers want to bring their furry companions. The pet policy is designed to make both you and your dog feel at home while maintaining comfort for all guests. Staff members are typically experienced with pet guests and can offer local recommendations.

**Dog-Friendly Amenities:**
Accommodations typically include features specifically for pet guests, which may include designated pet-friendly rooms or areas, easy outdoor access for potty breaks, and nearby walking routes. Some properties provide pet beds, bowls, or welcome treats. The layout usually considers the needs of traveling with dogs.

**Room Features:**
Pet-friendly rooms often have hard flooring or surfaces easy to clean, making accidents less stressful. Space is usually sufficient for your dog's bed, crate, or belongings. Ground floor or easy access rooms may be available upon request. Some properties offer enclosed outdoor areas where dogs can safely spend time.

**Location Benefits:**
Situated in ${place.cityName} with good access to dog-friendly areas, parks, or walking routes nearby. The location considers that dog owners need convenient outdoor spaces. Proximity to veterinary services and pet supply stores can be important for longer stays.

**House Rules & Requirements:**
Most pet-friendly accommodations have reasonable rules: dogs shouldn't be left alone in rooms, must be leashed in common areas, and owners are responsible for any damage. Some properties have size or breed restrictions—always verify before booking. Pet fees or deposits are common and help maintain pet-friendly standards.

**What to Bring:**
Your dog's regular food, medications, and comfort items from home. Cleaning supplies for quick accident cleanup. Your dog's vaccination records (some properties require them). A crate if your dog is crate-trained. Extra towels for post-walk paw cleaning.

**Nearby Dog Facilities:**
The area typically offers convenient access to dog parks, walking trails, or green spaces. Pet supply stores and veterinary clinics are usually within reasonable distance. Dog-friendly restaurants or cafes nearby make dining out possible. Transportation options that accommodate pets vary by location.

**Making the Most of Your Stay:**
Establish a routine quickly to help your dog adjust to new surroundings. Morning walks help expend energy and reduce anxiety. Communicate with staff about any concerns or special needs. Respect quiet hours and other guests by managing barking. Consider bringing your dog's regular bed or blanket for familiar scent comfort.

**Booking Tips:**
Reserve pet-friendly rooms well in advance, especially during peak seasons. Confirm pet policy details directly, as they can change. Ask about nearby dog facilities and recommendations. Inquire about any current construction or renovations that might stress noise-sensitive dogs. Check cancellation policies in case your plans change.`;
}

function generateShopDescription(place: PlaceData): string {
  return `${place.name} provides professional pet care services and quality supplies for dog owners in ${place.cityName}, supporting the health, happiness, and wellbeing of your canine companion.

**Services & Offerings:**
This establishment specializes in meeting the needs of dogs and their owners, whether through professional services, quality products, or expert advice. The team typically has experience with various breeds and understands different pet care requirements. Services are designed to make dog ownership easier and more enjoyable.

**What to Expect:**
Staff members are usually knowledgeable about pet care and can provide helpful recommendations based on your dog's specific needs. The environment is typically dog-friendly, with consideration for nervous or excitable pets. Service quality focuses on both the pet's comfort and the owner's peace of mind.

**Professional Expertise:**
The team generally includes trained professionals who understand canine behavior, health, and care requirements. Whether you need routine services or have specific concerns, the staff can typically provide informed guidance. Experience with various breeds and temperaments ensures appropriate care approaches.

**Products & Quality:**
If retail is part of the offering, products are usually selected for quality and effectiveness. Inventory often includes essentials as well as specialty items for specific needs. Staff can help you choose appropriate products for your dog's age, size, and health requirements.

**Appointment & Access:**
For service-based businesses, booking ahead is usually recommended to ensure availability. Drop-in visits may be possible for retail purchases or quick consultations. Operating hours are typically designed to accommodate working pet owners. Location in ${place.cityName} offers reasonable accessibility for local residents.

**Pricing & Value:**
Pricing generally reflects the quality of service or products provided. Many establishments offer package deals or loyalty programs for regular customers. Some services may have seasonal promotions. Clear pricing communication helps avoid surprises.

**Safety & Standards:**
Professional pet services maintain health and safety standards appropriate to their offerings. Cleaning protocols ensure hygienic conditions. Staff training emphasizes pet safety and comfort. If grooming or veterinary services are provided, proper equipment and techniques are used.

**For First-Time Visitors:**
Call ahead to understand what services or products are available for your dog's specific needs. Bring your dog's health records if required for certain services. Ask about what to bring or how to prepare your dog. Staff can usually answer questions about their approach and methods.

**Building a Relationship:**
Regular customers often develop relationships with staff who get to know their dogs' personalities and needs. Consistent service providers can track your dog's health and care history. Being a regular customer may provide scheduling benefits or personalized service.

**Local Community:**
These businesses often serve as hubs for local dog owner communities. You might learn about local events, dog-friendly locations, or connect with other pet owners. Staff often have insider knowledge about the best dog-friendly spots in ${place.cityName}.`;
}

function generateTipsDescription(place: PlaceData): string {
  return `${place.name} provides valuable local knowledge and practical information for dog owners in ${place.cityName}, helping you navigate the area with your canine companion more easily and enjoyably.

**Local Dog Ownership Insights:**
This resource offers essential information about being a dog owner in the area, including local regulations, cultural norms, and practical tips that make daily life with dogs easier. Understanding local context helps avoid problems and enhances your experience.

**What You'll Learn:**
The information typically covers important practical topics: where dogs are welcome, local leash laws, off-leash areas, emergency veterinary services, best dog-friendly neighborhoods, local dog owner customs, and seasonal considerations. This knowledge helps both residents and visitors.

**Regulatory Information:**
Local rules and regulations regarding dogs can vary significantly by neighborhood and time of year. This resource helps clarify what's required legally and what's considered good practice locally. Understanding expectations prevents fines and conflicts.

**Neighborhood Specifics:**
Different areas of ${place.cityName} may have different attitudes toward dogs and different facilities. Some neighborhoods are particularly dog-friendly with many amenities, while others have more restrictions. Knowing these differences helps you plan routes and activities.

**Seasonal Considerations:**
Dog ownership challenges and opportunities change with seasons. Summer might bring heat restrictions and water safety considerations. Winter could mean protective paw care and shorter walks. Spring and autumn have their own considerations. Local tips help you adapt appropriately.

**Emergency Resources:**
Knowing where to find emergency veterinary care, 24-hour pet services, or urgent supplies can be crucial. This information typically includes contact details, locations, and what services are available when. Being prepared reduces stress during emergencies.

**Cultural Context:**
Understanding local attitudes toward dogs helps you navigate social situations. Some areas have strong dog-friendly cultures, while others are more reserved. Knowing what's normal locally helps you fit in and avoid misunderstandings.

**Community Connections:**
Information often includes how to connect with other dog owners, local dog groups, training clubs, or social events. Building community enhances both your experience and your dog's socialization opportunities.

**Practical Daily Life:**
Tips typically cover everyday scenarios: navigating public transport with dogs, finding dog-friendly businesses, managing waste disposal, dealing with weather challenges, and solving common local problems that dog owners face.

**For Newcomers:**
If you're new to ${place.cityName}, this information helps you establish routines quickly. Understanding where other dog owners go, what times are best for different activities, and how to access services makes settling in much easier. Local knowledge that takes residents years to accumulate can be accessed immediately.

**Staying Updated:**
Local rules, facilities, and resources change over time. Staying informed about updates, new dog-friendly locations, or changed regulations helps you maintain compliance and take advantage of new opportunities. Community boards, local dog owner groups, and municipal websites often provide updates.`;
}

function generateGenericDescription(place: PlaceData): string {
  return `${place.name} is a dog-friendly location in ${place.cityName}, welcoming canine visitors and their owners.

**About This Location:**
This establishment has made efforts to accommodate dogs, recognizing that pets are important family members. The dog-friendly approach creates a welcoming environment where you can enjoy time with your furry companion.

**What to Expect:**
Staff and regular visitors typically understand and appreciate the presence of well-behaved dogs. The environment is designed or adapted to work well for pet owners. Reasonable accommodations help make the visit comfortable for both you and your dog.

**Visiting with Your Dog:**
Please ensure your dog is well-behaved and comfortable in the environment. Follow any posted rules or staff guidance regarding pets. Keep your dog under control and be mindful of other visitors who may or may not be comfortable around dogs.

**Location in ${place.cityName}:**
The location offers reasonable accessibility for dog owners. Consider nearby parking, walking routes, or public transport options that accommodate pets. The surrounding area may offer additional dog-friendly amenities.

**General Guidelines:**
Always clean up after your dog. Keep dogs on-leash unless explicitly told otherwise. Be respectful of other visitors and their space. If your dog shows stress or discomfort, it's okay to cut the visit short. Your dog's comfort and good behavior ensures the location remains welcoming to all pets.`;
}

async function enrichAllDescriptions() {
  console.log('🎨 Starting comprehensive description enrichment...\n');

  // Get all places with their city information
  const places = await prisma.place.findMany({
    include: {
      city: {
        select: {
          name: true,
          country: true,
        },
      },
    },
  });

  console.log(`Found ${places.length} places to enrich\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const place of places) {
    try {
      // Skip if already has rich full description (more than 500 characters)
      if (place.fullDescription && place.fullDescription.length > 500) {
        console.log(`⏭️  Skipping ${place.name} (already enriched)`);
        skipped++;
        continue;
      }

      const placeData: PlaceData = {
        id: place.id,
        name: place.name,
        type: place.type,
        shortDescription: place.shortDescription,
        cityName: place.city.name,
        country: place.city.country,
      };

      const enriched = generateRichDescription(placeData);

      await prisma.place.update({
        where: { id: place.id },
        data: {
          shortDescription: enriched.short,
          fullDescription: enriched.full,
        },
      });

      console.log(`✅ ${place.city.name}: ${place.name} (${place.type})`);
      updated++;

      // Add small delay to avoid overwhelming the system
      if (updated % 20 === 0) {
        console.log(`\n   Progress: ${updated}/${places.length - skipped} updated\n`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

    } catch (error) {
      console.error(`❌ Error updating ${place.name}:`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✨ Enrichment complete!`);
  console.log(`   Total places: ${places.length}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped (already rich): ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log('='.repeat(60));
}

enrichAllDescriptions()
  .catch((e) => {
    console.error('❌ Enrichment failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
