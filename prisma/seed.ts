import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/crypto";

async function main() {
  const email = process.env.ADMIN_EMAIL!;
  const username = process.env.ADMIN_USERNAME!;
  const password = process.env.ADMIN_PASSWORD!;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const hashed = await hashPassword(password);

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
