
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true }
  });
  console.log('Total Users:', userCount);
  console.log('Users:', JSON.stringify(users, null, 2));
}

main();
