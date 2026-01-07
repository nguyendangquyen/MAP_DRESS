import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const product = await prisma.product.create({
    data: {
      name: 'MAP Dress 001',
      slug: 'map-dress-001',
      dailyPrice: 200000,
      category: {
        create: {
          name: 'Dress',
          slug: 'dress',
        },
      },
      sizes: {
        create: [
          { value: 'S' },
          { value: 'M' },
          { value: 'L' },
        ],
      },
      images: {
        create: [
          { url: '/dress-1.jpg' },
        ],
      },
    },
  })

  const dates = ['2025-01-10', '2025-01-11', '2025-01-12']

  for (const d of dates) {
    await prisma.availability.create({
      data: {
        productId: product.id,
        date: new Date(d),
      },
    })
  }

  console.log('Seed completed')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
