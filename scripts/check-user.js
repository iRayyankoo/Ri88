const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    const email = 'rayyan.aldohian@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            workspaceMembers: {
                include: {
                    workspace: true
                }
            }
        }
    });

    console.log('USER DATA:');
    console.log(JSON.stringify(user, null, 2));
}

checkUser()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
