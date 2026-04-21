import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBooks() {
  const total = await prisma.book.count();
  const categories = await prisma.category.findMany();

  console.log('📊 Total Books:', total);
  console.log('\n📚 Books by Category:');

  for (const cat of categories) {
    const count = await prisma.book.count({
      where: { categoryId: cat.id }
    });
    console.log(`   ${cat.name}: ${count} books`);
  }

  const sample = await prisma.book.findFirst({
    select: { title: true, author: true, isbn: true, category: true }
  });
  console.log('\n📖 Sample Book:');
  console.log(`   Title: ${sample.title}`);
  console.log(`   Author: ${sample.author}`);
  console.log(`   ISBN: ${sample.isbn}`);
  console.log(`   Category: ${sample.category}`);

  await prisma.$disconnect();
}

checkBooks().catch(console.error);
