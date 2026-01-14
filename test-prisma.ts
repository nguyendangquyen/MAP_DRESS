import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  console.log('Checking prisma.review property...')
  if (prisma.review) {
    console.log('SUCCESS: prisma.review is defined')
  } else {
    console.log('FAILURE: prisma.review is undefined')
    console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')))
  }
}
main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
