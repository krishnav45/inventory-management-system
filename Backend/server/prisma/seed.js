const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@military.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@military.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log("✅ Admin created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });