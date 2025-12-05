
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeTips() {
  console.log('Checking for tips_local_info entries...');
  
  const count = await prisma.place.count({
    where: {
      type: 'tips_local_info'
    }
  });

  console.log(`Found ${count} entries to remove.`);

  if (count > 0) {
    const result = await prisma.place.deleteMany({
      where: {
        type: 'tips_local_info'
      }
    });
    console.log(`Deleted ${result.count} entries.`);
  } else {
    console.log('No entries found.');
  }
}

removeTips()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
