const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })
  
  if (admin) {
    console.log('Admin found:', admin.email)
  } else {
    console.log('No admin found.')
    const users = await prisma.user.findMany({ take: 5 })
    console.log('Recent users:', users.map(u => ({ email: u.email, role: u.role })))
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
