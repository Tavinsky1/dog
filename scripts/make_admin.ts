/**
 * Script to promote a user to ADMIN role
 * Usage: npx tsx scripts/make_admin.ts <email>
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    console.log(`\n🔍 Looking for user: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      console.log("\n💡 Available users:");
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true },
      });
      allUsers.forEach((u) => {
        console.log(`   - ${u.email} (${u.name}) [${u.role}]`);
      });
      process.exit(1);
    }

    if (user.role === "ADMIN") {
      console.log(`✅ User is already an ADMIN: ${user.email}`);
      process.exit(0);
    }

    console.log(`\n📝 Current role: ${user.role}`);
    console.log(`👑 Promoting to ADMIN...`);

    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`\n✅ SUCCESS! ${user.email} is now an ADMIN\n`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error("❌ Error: Email address required");
  console.log("\nUsage: npx tsx scripts/make_admin.ts <email>");
  console.log("Example: npx tsx scripts/make_admin.ts john@example.com\n");
  process.exit(1);
}

makeAdmin(email);
