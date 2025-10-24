import { PrismaClient } from '@prisma/client';

const DATABASE_URL = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ No database URL provided');
  console.log('Usage: PROD_DATABASE_URL="postgres://..." npx tsx scripts/check-prod-users.ts');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function checkUsers() {
  try {
    console.log('🔍 Checking production database for users...\n');
    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (users.length === 0) {
      console.log('❌ No users found in the database');
    } else {
      console.log(`✅ Found ${users.length} users:\n`);
      users.forEach((user, i) => {
        console.log(`${i + 1}. ${user.email || 'No email'}`);
        console.log(`   Name: ${user.name || 'N/A'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log(`   ID: ${user.id}`);
        console.log('');
      });
    }

    // Also check total count
    const totalCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${totalCount}`);
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
