import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const prisma = new PrismaClient();

async function checkBooks() {
  try {
    const bookCount = await prisma.book.count();
    const categoryCount = await prisma.category.count();
    const userCount = await prisma.user.count();

    console.log(`\n📊 Database Summary:`);
    console.log(`   📚 Books: ${bookCount}`);
    console.log(`   📂 Categories: ${categoryCount}`);
    console.log(`   👥 Users: ${userCount}`);

    if (bookCount > 0) {
      const sampleBooks = await prisma.book.findMany({
        take: 3,
        include: { seller: { select: { name: true } } }
      });

      console.log(`\n📖 Sample Books:`);
      sampleBooks.forEach(book => {
        console.log(`   • ${book.title} by ${book.author} - ₹${book.price} (${book.condition})`);
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkBooks();
