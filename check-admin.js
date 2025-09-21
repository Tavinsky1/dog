const { PrismaClient } = require('@prisma/client');

async function checkAdmin() {
  const prisma = new PrismaClient();
  
  try {
    const users = await prisma.user.findMany();
    console.log('All users in database:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@dogatlas.com' }
    });
    
    if (admin) {
      console.log('\n✅ Admin user found:', admin);
    } else {
      console.log('\n❌ Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
