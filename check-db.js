const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Fetching table list...');
    // MySQL specific query to list tables
    const tables = await prisma.$queryRaw`SHOW TABLES`;
    console.log('Tables in database:', JSON.stringify(tables, null, 2));
    
    // Check if 'reviews' exists in any of the results
    const tableNames = tables.map(t => Object.values(t)[0]);
    if (tableNames.includes('reviews')) {
      console.log('SUCCESS: Table "reviews" found.');
    } else {
      console.log('FAILURE: Table "reviews" NOT found.');
    }
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
