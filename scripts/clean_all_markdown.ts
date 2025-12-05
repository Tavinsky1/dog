import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Get all places with markdown artifacts
    const places = await prisma.place.findMany({
      where: {
        fullDescription: { contains: '**' },
        city: { active: true }
      },
      include: { city: true }
    });

    console.log(`Found ${places.length} places with markdown artifacts`);

    let updated = 0;

    for (const place of places) {
      let description = place.fullDescription || '';

      // Remove markdown formatting
      if (description.includes('**')) {
        // Remove bold markdown **text**
        description = description.replace(/\*\*[^*]+\*\*/g, (match) => {
          return match.slice(2, -2); // Remove the ** markers
        });

        // Clean up extra whitespace and newlines
        description = description.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

        // Update database
        await prisma.place.update({
          where: { id: place.id },
          data: { fullDescription: description }
        });

        updated++;
      }
    }

    console.log(`Updated ${updated} places`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();