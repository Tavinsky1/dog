import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create cities
  const cities = [
    { name: 'Barcelona', slug: 'barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
    { name: 'Berlin', slug: 'berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
    { name: 'Paris', slug: 'paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { name: 'Rome', slug: 'rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
    { name: 'Amsterdam', slug: 'amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
    { name: 'Vienna', slug: 'vienna', country: 'Austria', lat: 48.2082, lng: 16.3738 },
  ]

  for (const cityData of cities) {
    await prisma.city.upsert({
      where: { slug: cityData.slug },
      update: cityData,
      create: cityData,
    })
  }

  // Create sample places
  const barcelona = await prisma.city.findUnique({ where: { slug: 'barcelona' } })
  if (barcelona) {
    await prisma.place.upsert({
      where: { slug: 'barceloneta-dog-beach' },
      update: {
        name: 'Barceloneta Dog Beach',
        type: 'beach_dog_friendly',
        shortDescription: 'Beautiful beach area for dogs in Barceloneta district',
        lat: 41.3756,
        lng: 2.1995,
        dogFriendlyLevel: 4,
        imageUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80',
      },
      create: {
        slug: 'barceloneta-dog-beach',
        name: 'Barceloneta Dog Beach',
        type: 'beach_dog_friendly',
        shortDescription: 'Beautiful beach area for dogs in Barceloneta district',
        cityId: barcelona.id,
        country: 'Spain',
        lat: 41.3756,
        lng: 2.1995,
        dogFriendlyLevel: 4,
        imageUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80',
      },
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })