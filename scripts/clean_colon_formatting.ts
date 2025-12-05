import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Get places with colon-formatted sections
    const places = await prisma.place.findMany({
      where: {
        OR: [
          { fullDescription: { contains: 'Trails:' } },
          { fullDescription: { contains: 'Nature:' } },
          { fullDescription: { contains: 'Dogs:' } },
          { fullDescription: { contains: 'Facilities:' } },
          { fullDescription: { contains: 'Tips:' } }
        ],
        city: { active: true }
      },
      include: { city: true }
    });

    console.log(`Found ${places.length} places with colon-formatted sections`);

    let updated = 0;

    for (const place of places) {
      let description = place.fullDescription || '';

      // Remove colon-formatted sections and convert to flowing text
      description = description
        .replace(/Trails:\s*/g, '')
        .replace(/Nature:\s*/g, '')
        .replace(/Dogs:\s*/g, '')
        .replace(/Facilities:\s*/g, '')
        .replace(/Tips:\s*/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Update database
      await prisma.place.update({
        where: { id: place.id },
        data: { fullDescription: description }
      });

      updated++;
    }

    console.log(`Updated ${updated} places`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();