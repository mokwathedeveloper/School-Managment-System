
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const prisma = new PrismaClient();

async function main() {
  const password = 'password123';
  const hashedPassword = await argon2.hash(password);
  
  const user = await prisma.user.create({
    data: {
      email: 'admin@school.com',
      password: hashedPassword,
      first_name: 'Super',
      last_name: 'Admin',
      role: 'SUPER_ADMIN',
    }
  });
  
  console.log('User created:', user.email);
  console.log('Password:', password);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
