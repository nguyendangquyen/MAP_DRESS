const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function check() {
  console.log('Connecting to database...')
  const users = await prisma.user.findMany()
  console.log('Users in DB count:', users.length)
  console.log('Users in DB detail:', JSON.stringify(users, null, 2))
  
  if (users.length === 0) {
    console.log('Creating test user...')
    const hashedPassword = await bcrypt.hash('password123', 10)
    const newUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        phone: '0123456789',
        address: '123 Test St',
        role: 'USER'
      }
    })
    console.log('Created user:', newUser)
  } else {
    console.log('Users exist, skipping creation.')
  }
}

console.log('Starting check script...')

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
