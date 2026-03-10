import { PrismaClient } from '@prisma/client';
import { tools } from '../data/tools';

const prisma = new PrismaClient();

async function main() {
    console.log(`Submitting ${tools.length} tools to Database...`);
    for (const tool of tools) {
        await prisma.tool.upsert({
            where: { id: tool.id },
            update: {
                name: tool.title,
                description: tool.desc,
                category: tool.cat,
                icon: tool.icon,
                url: `/tools/${tool.id}`,
                isPremium: tool.status === 'new' || tool.status === 'added',
            },
            create: {
                id: tool.id,
                name: tool.title,
                description: tool.desc,
                category: tool.cat,
                icon: tool.icon,
                url: `/tools/${tool.id}`,
                isPremium: tool.status === 'new' || tool.status === 'added',
            }
        });
    }
    console.log('✅ Tools seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
