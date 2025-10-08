/**
 * Enhance place descriptions with rich, engaging content
 * This script generates detailed, informative descriptions for all places
 */

import { PrismaClient, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();

// Template guidelines for each place type
const descriptionGuidelines: Record<PlaceType, string> = {
  parks: "Describe the park's features, dog-friendly areas, paths, views, atmosphere, best times to visit, and what makes it special for dogs and owners.",
  cafes_restaurants: "Describe the ambiance, dog-friendly policies, outdoor seating, food/drink offerings, what makes it welcoming for dogs, and the overall experience.",
  accommodation: "Describe the hotel's dog-friendly amenities, room features, pet services, nearby activities, what's included for dogs, and why it's a great choice for travelers with pets.",
  shops_services: "Describe the services offered, expertise, facility features, what makes them special, product range if applicable, and how they cater to dogs and their owners.",
  walks_trails: "Describe the trail features, difficulty level, scenery, distance, dog-friendly aspects, what to expect, and tips for visitors.",
  tips_local_info: "Provide helpful information, insider tips, practical advice, and what visitors should know about this resource or location."
};

// Enhanced description templates based on place type and current info
function generateEnhancedDescription(place: any): string {
  const { name, type, shortDescription, fullDescription, city } = place;
  const cityName = city.name;
  
  // If already has a good description (>200 chars), keep it
  if (fullDescription && fullDescription.length > 200) {
    return fullDescription;
  }

  // Base description from short or full description
  const baseInfo = fullDescription || shortDescription || '';

  // Generate enhanced descriptions based on type
  switch (type) {
    case 'parks':
      return enhanceParkDescription(name, baseInfo, cityName);
    case 'cafes_restaurants':
      return enhanceCafeDescription(name, baseInfo, cityName);
    case 'accommodation':
      return enhanceAccommodationDescription(name, baseInfo, cityName);
    case 'shops_services':
      return enhanceServiceDescription(name, baseInfo, cityName);
    case 'walks_trails':
      return enhanceTrailDescription(name, baseInfo, cityName);
    case 'tips_local_info':
      return enhanceTipsDescription(name, baseInfo, cityName);
    default:
      return baseInfo;
  }
}

function enhanceParkDescription(name: string, baseInfo: string, city: string): string {
  const templates = [
    `${name} is one of ${city}'s most beloved dog-friendly green spaces. ${baseInfo} The park offers expansive areas where dogs can run freely and socialize with other four-legged friends. With well-maintained paths perfect for leisurely walks, plenty of shade under mature trees, and open lawns ideal for fetch games, it's a paradise for both dogs and their owners. Early morning and late afternoon are particularly popular times, when the local dog community gathers. The park's natural beauty and peaceful atmosphere make it a must-visit destination for anyone exploring ${city} with their canine companion.`,
    
    `This stunning ${city} park is a favorite among local dog owners and visitors alike. ${baseInfo} Featuring spacious lawns, tree-lined pathways, and designated dog areas, it provides the perfect setting for your dog to exercise and explore. The park's layout encourages both active play and relaxed strolls, with scenic spots ideal for taking breaks and enjoying the surroundings. Water fountains are available for keeping your pup hydrated, and the welcoming atmosphere makes it easy to connect with other dog lovers. Whether you're looking for morning exercise or an afternoon adventure, this park delivers an exceptional outdoor experience for dogs of all sizes and energy levels.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function enhanceCafeDescription(name: string, baseInfo: string, city: string): string {
  const templates = [
    `${name} welcomes dogs and their owners with open arms, creating a warm and inclusive atmosphere in the heart of ${city}. ${baseInfo} The café features comfortable outdoor seating where your furry friend can relax by your side while you enjoy quality coffee and delicious food. Staff members are genuinely dog-friendly, often offering water bowls and treats to four-legged guests. The relaxed vibe and pet-welcoming policy make it an ideal spot for breakfast meetings with your pup, afternoon coffee breaks, or casual meals where your dog is truly part of the experience. It's become a beloved gathering spot for the local dog-owning community.`,
    
    `A true gem for dog lovers in ${city}, ${name} combines excellent food and drinks with a genuinely welcoming atmosphere for pets. ${baseInfo} With spacious outdoor areas perfect for accommodating dogs of all sizes, this establishment has earned its reputation as one of the most dog-friendly venues in the neighborhood. The menu offers something for everyone, while your canine companion can enjoy the social atmosphere and people-watching. Whether you're grabbing a quick coffee or settling in for a leisurely meal, you'll find that both you and your dog are treated as valued guests. The friendly staff and relaxed environment make every visit memorable.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function enhanceAccommodationDescription(name: string, baseInfo: string, city: string): string {
  const templates = [
    `${name} sets the standard for pet-friendly hospitality in the ${city} area. ${baseInfo} This carefully curated accommodation understands that your dog is family, offering thoughtful amenities and services designed specifically for traveling with pets. From spacious rooms that comfortably accommodate dogs of all sizes to nearby green spaces perfect for morning walks, every detail has been considered. The staff is experienced in hosting four-legged guests and can provide recommendations for local dog-friendly attractions, restaurants, and services. Whether you're visiting for business or pleasure, you'll find this is more than just pet-tolerant—it's genuinely pet-loving, ensuring both you and your canine companion enjoy a comfortable, stress-free stay.`,
    
    `When traveling to ${city} with your dog, ${name} offers an exceptional home away from home. ${baseInfo} The accommodation goes beyond simply allowing pets—it celebrates them with dedicated amenities, comfortable spaces, and attentive service. Rooms are designed with pet owners in mind, featuring easy-to-clean surfaces and convenient outdoor access. The location provides easy access to dog-friendly parks and walking areas, making it simple to maintain your dog's routine while away from home. Staff members are knowledgeable about the area's best dog-friendly spots and happy to share insider tips. With its combination of comfort, convenience, and genuine pet-friendly hospitality, this is the perfect base for exploring ${city} with your furry travel companion.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function enhanceServiceDescription(name: string, baseInfo: string, city: string): string {
  if (name.toLowerCase().includes('vet') || name.toLowerCase().includes('clinic') || name.toLowerCase().includes('hospital')) {
    return `${name} provides professional veterinary care for pets in ${city}. ${baseInfo} The clinic is staffed by experienced veterinarians and support staff dedicated to your pet's health and wellbeing. Whether you need routine checkups, vaccinations, emergency care, or specialized treatments, the team offers comprehensive services in a clean, modern facility. They understand that pets are family members and provide compassionate care with clear communication throughout the process. The clinic maintains high standards of medical excellence while creating a welcoming, low-stress environment for both pets and their owners.`;
  }
  
  if (name.toLowerCase().includes('groom') || name.toLowerCase().includes('toilettage') || name.toLowerCase().includes('spa')) {
    return `${name} offers professional grooming services for dogs in ${city}. ${baseInfo} The experienced groomers understand that every dog is unique, tailoring their approach to each pet's specific needs, temperament, and coat type. Services range from basic baths and nail trims to full grooming packages including cuts, styling, and spa treatments. The facility maintains high hygiene standards and uses quality products suitable for different skin sensitivities. Your dog's comfort and safety are top priorities, with groomers taking time to build trust and ensure a positive experience. Whether your pup needs regular maintenance or a special makeover, you'll find expert care and attention to detail here.`;
  }
  
  return `${name} is a trusted resource for dog owners in ${city}. ${baseInfo} The business is known for its professional service, knowledgeable staff, and genuine care for animals. Whether you're a local resident or visitor, you'll find helpful, friendly service and everything you need to keep your dog happy and healthy. The convenient location and comprehensive offerings make it a go-to destination for pet owners throughout the area.`;
}

function enhanceTrailDescription(name: string, baseInfo: string, city: string): string {
  const templates = [
    `${name} offers an excellent outdoor adventure for dogs and their owners near ${city}. ${baseInfo} The trail features varied terrain that keeps the walk interesting while remaining accessible for most fitness levels. Dogs love exploring the natural environment, with plenty of new scents and sights to discover along the way. The path is well-maintained and clearly marked, making navigation straightforward even for first-time visitors. Popular with the local hiking community, you'll often encounter other friendly dog walkers, creating opportunities for socialization. Remember to bring water for both you and your pup, and keep your dog on leash where required. The scenic beauty and peaceful atmosphere make this trail a favorite escape from urban life.`,
    
    `This beautiful walking trail near ${city} is perfect for dogs who love to explore nature. ${baseInfo} The route winds through diverse landscapes, offering ever-changing views and environments that engage your dog's senses. Whether you're looking for a short walk or a longer adventure, the trail accommodates various distances and energy levels. The natural setting provides excellent opportunities for exercise, training, and bonding with your pet away from city streets. During weekends and pleasant weather, you'll find a friendly community of dog owners who appreciate these outdoor spaces. The trail's dog-friendly design and natural beauty make it worth adding to your regular walking rotation or including in your ${city} travel itinerary.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function enhanceTipsDescription(name: string, baseInfo: string, city: string): string {
  return `${baseInfo} This resource provides valuable information for dog owners navigating ${city}, helping you make the most of your time with your pet. Whether you're a resident looking for new spots to explore or a visitor planning your trip, you'll find practical advice and insider knowledge here. The tips cover important details about local regulations, seasonal considerations, and hidden gems that make ${city} special for dogs and their owners. Using local knowledge and community input, this information helps ensure positive experiences throughout your adventures.`;
}

async function main() {
  console.log('🐕 Enhancing place descriptions...\n');

  // Get all places with short descriptions
  const places = await prisma.place.findMany({
    where: {
      OR: [
        { fullDescription: null },
        { fullDescription: { equals: '' } },
        // Also include places with very short descriptions (<150 chars)
      ]
    },
    include: {
      city: {
        select: {
          name: true
        }
      }
    }
  });

  // Also get places with short full descriptions
  const allPlaces = await prisma.place.findMany({
    include: {
      city: {
        select: {
          name: true
        }
      }
    }
  });

  const placesToUpdate = allPlaces.filter(p => 
    !p.fullDescription || p.fullDescription.length < 150
  );

  console.log(`Found ${placesToUpdate.length} places that need enhanced descriptions\n`);

  let successCount = 0;

  for (const place of placesToUpdate) {
    console.log(`✏️  Enhancing: ${place.name} (${place.city.name})`);
    
    const enhancedDescription = generateEnhancedDescription(place);
    
    await prisma.place.update({
      where: { id: place.id },
      data: { fullDescription: enhancedDescription }
    });
    
    console.log(`   ✅ Updated (${enhancedDescription.length} chars)\n`);
    successCount++;
  }

  console.log('='.repeat(60));
  console.log(`✨ COMPLETE! Enhanced ${successCount} place descriptions`);
  console.log('='.repeat(60));
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
