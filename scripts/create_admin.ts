import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const id = "admin-" + Math.random().toString(36).slice(2, 10);
  const email = "admin@dogatlas.app";
  const name = "Admin";
  const role = "ADMIN";
  const now = new Date();
  await prisma.user.upsert({
    where: { email },
    update: { role, name },
    create: { id, email, name, role, createdAt: now },
  });
  console.log("Admin user ensured:", email);
}

main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
