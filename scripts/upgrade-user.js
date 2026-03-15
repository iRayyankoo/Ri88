const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'rayyan.aldohian@gmail.com';
    
    try {
        const user = await prisma.user.update({
            where: { email },
            data: {
                role: 'ADMIN',
                isPro: true,
                credits: 999999
            }
        });
        
        console.log('User upgraded successfully:', user.email, 'Role:', user.role);
        
        // Also make sure they are OWNER of all their workspaces
        const workspaceMembers = await prisma.workspaceMember.updateMany({
            where: { userId: user.id },
            data: {
                role: 'OWNER'
            }
        });
        
        console.log('Updated', workspaceMembers.count, 'workspace memberships to OWNER');
        
    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
