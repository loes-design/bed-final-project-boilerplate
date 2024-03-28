// seed.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Voeg voorbeeldgegevens in
  await prisma.user.create({
    data: {
      username: "example_user",
      password: "example_password",
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      pictureUrl: "https://example.com/avatar.jpg",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
