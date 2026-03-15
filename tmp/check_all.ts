
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
  const workspaces = await prisma.workspace.findMany({ include: { members: true } });
  
  console.log('--- USERS ---');
  console.log(JSON.stringify(users, null, 2));
  console.log('--- WORKSPACES & MEMBERS ---');
  console.log(JSON.stringify(workspaces, null, 2));
}

main();
