const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.log('Vui lòng cung cấp email: node debug-auth.js <email>')
    return
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (!user) {
    console.log('Không tìm thấy user với email:', email)
    return
  }

  console.log('User found:', {
    id: user.id,
    email: user.email,
    passwordHash: user.password
  })

  // Test bcrypt verify manual
  // Note: We don't know the plain password, but we can test if a new hash matches
  // Or if the hash is valid
  try {
    const isValidHash = user.password.startsWith('$2')
    console.log('Is valid bcrypt hash format:', isValidHash)
  } catch (e) {
    console.error('Error checking hash:', e)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
