const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@waterlevel.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@waterlevel.com',
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log('Usuário administrador criado:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 