import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@dogatlas.app";
  const password = "admin123"; // Change this to a secure password
  
  const hashedPassword = await hash(password, 10);
  
  await prisma.user.update({
    where: { email },
    data: { passwordHash: hashedPassword },
  });
  
  console.log("✅ Admin password set successfully!");
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("\nYou can now login at https://dog-atlas.com/login");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
