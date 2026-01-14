const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@mapdress.com'
  const password = 'admin' // Simple password for demo
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      password: hashedPassword // Reset password to ensure access
    },
    create: {
      email,
      name: 'Admin Map Dress',
      password: hashedPassword,
      role: 'ADMIN',
      image: 'https://ui-avatars.com/api/?name=Admin+Map+Dress&background=random'
    }
  })

  console.log(`Admin user ready: ${email} / ${password}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
