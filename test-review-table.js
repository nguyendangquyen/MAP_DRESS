const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing review creation...');
    // Create a dummy review (assuming a product exists, or just try to query it)
    // Actually, just querying the count is enough to check if the table exists.
    const count = await prisma.review.count();
    console.log('SUCCESS: Table "reviews" exists. Row count:', count);
  } catch (error) {
    if (error.code === 'P2021') {
      console.error('FAILURE: Table "reviews" still does not exist.');
    } else {
      console.error('Database error:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
