#!/usr/bin/env npx tsx

/**
 * Add realistic sample reviews to top 50 places
 * This creates diverse, authentic-sounding reviews with varied ratings and dog-specific feedback
 * Usage: npx tsx scripts/add_sample_reviews.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Reviewer personas for variety
const reviewers = [
  { name: 'Sarah M.', persona: 'local-regular' },
  { name: 'James P.', persona: 'tourist' },
  { name: 'Maria G.', persona: 'professional-trainer' },
  { name: 'Robert K.', persona: 'elderly-owner' },
  { name: 'Emily and Tom', persona: 'family-with-kids' },
  { name: 'Alex W.', persona: 'active-athlete' },
  { name: 'Linda H.', persona: 'first-time-visitor' },
  { name: 'David L.', persona: 'experienced-owner' },
  { name: 'Sophie B.', persona: 'young-professional' },
  { name: 'Michael T.', persona: 'retired-couple' },
];

// Review templates by persona and rating
const reviewTemplates = {
  'local-regular': {
    5: [
      "We visit here almost daily with our {breed}. The atmosphere is perfect, and the staff always remembers {dogName}'s name! The {feature} is exactly what active dogs need.",
      "My {breed} absolutely adores this place. Been coming here for {years} years and it never disappoints. The {feature} keeps {dogName} entertained for hours.",
    ],
    4: [
      "Great spot for dogs! We come here regularly with our {breed}. The {feature} is excellent, though it can get crowded on weekends.",
      "Solid choice for dog owners. {dogName} enjoys the {feature} and we've met wonderful people here. Just wish the {improvement} were better.",
    ],
    3: [
      "It's okay for a quick visit. Our {breed} likes the {feature}, but we've found better spots in the area. The {issue} can be problematic.",
    ],
  },
  'tourist': {
    5: [
      "Visiting from {hometown} and this was a highlight of our trip! Our {breed} had such a wonderful time. The {feature} exceeded expectations.",
      "Amazing find during our vacation! {dogName} loved every minute. Highly recommend if you're visiting the area with your pup.",
    ],
    4: [
      "Really enjoyed bringing our {breed} here during our visit. The {feature} was great, though we wish we'd known about the {tip}.",
      "Nice spot we discovered while exploring the city. {dogName} had fun, and the {feature} made it worth the visit.",
    ],
  },
  'professional-trainer': {
    5: [
      "As a professional trainer, I bring clients here regularly. The {feature} provides excellent socialization opportunities, and the space layout is ideal for training.",
      "Outstanding facility for dogs of all temperaments. I've used this location for training sessions with great success. The {feature} is particularly well-designed.",
    ],
    4: [
      "Good training environment overall. The {feature} works well for most dogs, though reactive dogs might struggle during peak hours.",
    ],
  },
  'elderly-owner': {
    5: [
      "Perfect for senior dogs and their owners! My {age}-year-old {breed} loves the gentle {feature}. Plenty of benches for rest breaks too.",
      "{dogName} and I have been coming here for years. At our age, we appreciate the {feature} and the peaceful atmosphere.",
    ],
    4: [
      "Nice and relaxing for older dogs. {dogName} enjoys the {feature} without getting overwhelmed. The {amenity} could be more accessible though.",
    ],
  },
  'family-with-kids': {
    5: [
      "Perfect for families! Our {breed} plays wonderfully with the kids here. The {feature} keeps both children and dogs entertained safely.",
      "We bring our two kids and {dogName} here every weekend. The {feature} is fantastic, and there's plenty of space for everyone to enjoy.",
    ],
    4: [
      "Good family spot. {dogName} gets along well with our children here. The {feature} is nice, though supervision is needed during busy times.",
    ],
  },
  'active-athlete': {
    5: [
      "Excellent for high-energy dogs! I run with my {breed} here regularly and the {feature} provides perfect training opportunities. {dogName} comes home perfectly tired!",
      "Best spot for athletic dogs in the area. The {feature} challenges {dogName} just right. We do agility training here three times a week.",
    ],
    4: [
      "Great workout spot for energetic breeds. {dogName} loves the {feature}. Gets a bit muddy after rain, so bring towels.",
    ],
  },
};

// Dog-specific details for personalization
const dogBreeds = [
  'Golden Retriever', 'Labrador', 'German Shepherd', 'Border Collie', 'Poodle', 
  'French Bulldog', 'Beagle', 'Australian Shepherd', 'Corgi', 'Husky',
  'Dachshund', 'Boxer', 'Shiba Inu', 'Cocker Spaniel', 'Jack Russell'
];

const dogNames = [
  'Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Lucy', 'Buddy', 'Daisy',
  'Rocky', 'Molly', 'Duke', 'Sadie', 'Bear', 'Maggie', 'Zeus'
];

// Place-type specific features and issues
const placeFeatures = {
  parks: {
    features: ['off-leash area', 'open space', 'walking paths', 'shaded areas', 'dog water stations', 'fenced zone'],
    improvements: ['parking', 'lighting', 'waste stations', 'seating areas'],
    issues: ['mud', 'crowding', 'lack of shade', 'aggressive dogs'],
    amenities: ['benches', 'water fountains', 'parking lot', 'restrooms'],
  },
  cafes_restaurants: {
    features: ['outdoor seating', 'water bowls', 'dog treats', 'shaded patio', 'dog-friendly staff', 'separate dog area'],
    improvements: ['menu variety', 'wait times', 'noise levels', 'space between tables'],
    issues: ['limited seating', 'no dog menu', 'indoor access', 'busy atmosphere'],
    amenities: ['water bowls', 'tie-up posts', 'outdoor heaters', 'dog biscuits'],
  },
  walks_trails: {
    features: ['scenic views', 'varied terrain', 'quiet paths', 'natural water access', 'well-marked trail', 'wildlife viewing'],
    improvements: ['trail markers', 'rest stops', 'emergency access', 'parking'],
    issues: ['steep sections', 'loose dogs', 'wildlife encounters', 'poor maintenance'],
    amenities: ['parking areas', 'water stations', 'benches', 'waste bags'],
  },
  accommodation: {
    features: ['pet amenities', 'spacious rooms', 'nearby parks', 'dog sitting service', 'welcome treats', 'dog beds provided'],
    improvements: ['pet fee', 'room cleaning', 'outdoor space', 'check-in process'],
    issues: ['size restrictions', 'additional fees', 'limited rooms', 'noise concerns'],
    amenities: ['dog beds', 'bowls', 'treats', 'walking services'],
  },
  shops_services: {
    features: ['expert staff', 'product selection', 'grooming area', 'appointment flexibility', 'calm environment', 'quality products'],
    improvements: ['pricing', 'wait times', 'parking', 'hours of operation'],
    issues: ['busy atmosphere', 'limited services', 'high prices', 'booking availability'],
    amenities: ['waiting area', 'parking', 'online booking', 'product samples'],
  },
  tips_local_info: {
    features: ['local atmosphere', 'authentic experience', 'helpful staff', 'central location', 'easy access', 'unique character'],
    improvements: ['information', 'signage', 'accessibility', 'facilities'],
    issues: ['tourist crowds', 'language barriers', 'unclear rules', 'limited information'],
    amenities: ['information boards', 'maps', 'rest areas', 'facilities'],
  },
};

// Tag assignments by place type
const tagsByType = {
  parks: ['off_leash_allowed', 'water_bowls', 'good_for_puppies', 'large_dogs_welcome', 'quiet_spot'],
  cafes_restaurants: ['dog_friendly_staff', 'water_bowls', 'treats_available', 'outdoor_seating', 'busy_area'],
  walks_trails: ['good_for_puppies', 'large_dogs_welcome', 'quiet_spot', 'outdoor_seating'],
  accommodation: ['dog_friendly_staff', 'treats_available', 'quiet_spot', 'small_dogs_only'],
  shops_services: ['dog_friendly_staff', 'treats_available', 'water_bowls', 'busy_area'],
  tips_local_info: ['outdoor_seating', 'busy_area'],
};

/**
 * Generate a personalized review based on place type and persona
 */
function generateReview(place: any, rating: number): any {
  // Select random reviewer and persona
  const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
  const persona = reviewer.persona;
  
  // Get appropriate templates for this persona and rating
  const personaTemplates = reviewTemplates[persona as keyof typeof reviewTemplates] || reviewTemplates['local-regular'];
  const ratingTemplates = personaTemplates[rating as keyof typeof personaTemplates] || personaTemplates[4];
  
  if (!ratingTemplates || ratingTemplates.length === 0) {
    return null;
  }
  
  // Select random template
  const template = ratingTemplates[Math.floor(Math.random() * ratingTemplates.length)];
  
  // Get place-type specific details
  const placeType = place.type.replace('cafes_restaurants', 'cafes_restaurants')
                              .replace('walks_trails', 'walks_trails')
                              .replace('shops_services', 'shops_services')
                              .replace('tips_local_info', 'tips_local_info');
  
  const typeFeatures = placeFeatures[placeType as keyof typeof placeFeatures] || placeFeatures.parks;
  
  // Fill in template variables
  const breed = dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
  const dogName = dogNames[Math.floor(Math.random() * dogNames.length)];
  const feature = typeFeatures.features[Math.floor(Math.random() * typeFeatures.features.length)];
  const improvement = typeFeatures.improvements[Math.floor(Math.random() * typeFeatures.improvements.length)];
  const issue = typeFeatures.issues[Math.floor(Math.random() * typeFeatures.issues.length)];
  const amenity = typeFeatures.amenities[Math.floor(Math.random() * typeFeatures.amenities.length)];
  const years = Math.floor(Math.random() * 5) + 1;
  const age = Math.floor(Math.random() * 8) + 8; // 8-15 years old
  const hometown = ['Seattle', 'Toronto', 'London', 'Chicago', 'Vancouver', 'Dublin'][Math.floor(Math.random() * 6)];
  const tip = ['busy hours', 'parking situation', 'entrance location', 'best times to visit'][Math.floor(Math.random() * 4)];
  
  let comment = template
    .replace('{breed}', breed)
    .replace('{breed}', breed) // Replace multiple occurrences
    .replace('{dogName}', dogName)
    .replace('{dogName}', dogName)
    .replace('{feature}', feature)
    .replace('{feature}', feature)
    .replace('{improvement}', improvement)
    .replace('{issue}', issue)
    .replace('{amenity}', amenity)
    .replace('{years}', years.toString())
    .replace('{age}', age.toString())
    .replace('{hometown}', hometown)
    .replace('{tip}', tip);
  
  // Select 2-3 relevant tags for this place type
  const availableTags = tagsByType[placeType as keyof typeof tagsByType] || tagsByType.parks;
  const numTags = Math.floor(Math.random() * 2) + 2; // 2-3 tags
  const selectedTags = [];
  const tagsCopy = [...availableTags];
  
  for (let i = 0; i < numTags && tagsCopy.length > 0; i++) {
    const tagIndex = Math.floor(Math.random() * tagsCopy.length);
    selectedTags.push(tagsCopy[tagIndex]);
    tagsCopy.splice(tagIndex, 1);
  }
  
  // Generate date between 1-180 days ago
  const daysAgo = Math.floor(Math.random() * 180) + 1;
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - daysAgo);
  
  return {
    placeId: place.id,
    rating,
    body: comment,
    tags: selectedTags,
    userId: null, // Anonymous reviews for now
    createdAt,
    reviewer: reviewer.name,
  };
}

/**
 * Generate rating based on realistic distribution
 * 30% 5-star, 60% 4-star, 10% 3-star
 */
function generateRating(): number {
  const rand = Math.random();
  if (rand < 0.3) return 5;
  if (rand < 0.9) return 4;
  return 3;
}

async function main() {
  console.log('⭐ Adding sample reviews to top places...\n');
  
  // Get top 50 places (prioritize parks and cafes in major cities)
  const topPlaces = await prisma.place.findMany({
    where: {
      OR: [
        { type: 'parks' },
        { type: 'cafes_restaurants' },
      ],
      city: {
        name: {
          in: ['Berlin', 'Paris', 'Amsterdam', 'Barcelona', 'Rome', 'New York', 'Tokyo', 'Vienna']
        }
      }
    },
    include: {
      city: {
        select: {
          name: true,
        }
      }
    },
    take: 50,
  });
  
  console.log(`Found ${topPlaces.length} top places for reviews\n`);
  
  let totalReviews = 0;
  let placesWithReviews = 0;
  
  for (const place of topPlaces) {
    // Generate 3-5 reviews per place
    const numReviews = Math.floor(Math.random() * 3) + 3; // 3-5 reviews
    
    console.log(`📍 ${place.city.name}: ${place.name} (${place.type})`);
    
    const reviews = [];
    for (let i = 0; i < numReviews; i++) {
      const rating = generateRating();
      const review = generateReview(place, rating);
      
      if (review) {
        reviews.push(review);
        console.log(`   ⭐️ ${'★'.repeat(rating)}${'☆'.repeat(5-rating)} - ${review.reviewer}: ${review.body.substring(0, 60)}...`);
      }
    }
    
    // Insert reviews into database
    if (reviews.length > 0) {
      for (const review of reviews) {
        await prisma.review.create({
          data: {
            placeId: review.placeId,
            rating: review.rating,
            body: review.body,
            tags: review.tags,
            userId: review.userId,
            createdAt: review.createdAt,
          }
        });
      }
      
      totalReviews += reviews.length;
      placesWithReviews++;
      
      console.log(`   ✅ Added ${reviews.length} reviews\n`);
    }
    
    // Progress update every 10 places
    if (placesWithReviews % 10 === 0) {
      console.log(`   Progress: ${placesWithReviews}/${topPlaces.length} places reviewed\n`);
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n============================================================');
  console.log('✨ Review generation complete!');
  console.log(`   Places with reviews: ${placesWithReviews}`);
  console.log(`   Total reviews added: ${totalReviews}`);
  console.log(`   Average reviews per place: ${(totalReviews / placesWithReviews).toFixed(1)}`);
  console.log('============================================================\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
