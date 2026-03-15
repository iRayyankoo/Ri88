
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('Successfully connected to the database.')

    console.log('Checking User count...')
    const userCount = await prisma.user.count()
    console.log(`User count: ${userCount}`)

    console.log('Checking Workspace count...')
    const workspaceCount = await prisma.workspace.count()
    console.log(`Workspace count: ${workspaceCount}`)

    process.exit(0)
  } catch (error: any) {
    console.error('Database connection failed!')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    if (error.code) console.error('Error code:', error.code)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
