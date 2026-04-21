import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const prisma = new PrismaClient();

const CONDITIONS = ['LIKE_NEW', 'GOOD', 'FAIR'];
const CATEGORIES = {
  'C Programming': { query: 'C programming language', ug: true },
  'Java Programming': { query: 'Java programming', ug: true },
  'Data Structures': { query: 'data structures algorithms', ug: true },
  'Database Management': { query: 'DBMS database', ug: true },
  'Operating Systems': { query: 'operating system', ug: true },
  'Artificial Intelligence': { query: 'artificial intelligence machine learning', pg: true },
  'Machine Learning': { query: 'machine learning deep learning', pg: true },
  'Advanced Algorithms': { query: 'advanced algorithms', pg: true },
  'Web Development': { query: 'web development', prog: true },
  'Python Programming': { query: 'Python programming', prog: true },
  'JavaScript': { query: 'JavaScript programming', prog: true },
  'Accounting': { query: 'accounting finance', commerce: true },
  'Economics': { query: 'economics theory', commerce: true },
  'Business Management': { query: 'business management', commerce: true },
  'Mahabharata': { query: 'Mahabharata Indian epic', mythology: true },
  'Ramayana': { query: 'Ramayana Indian epic', mythology: true },
  'Bhagavad Gita': { query: 'Bhagavad Gita philosophy', mythology: true },
  'Bible': { query: 'Bible religious text', mythology: true },
  'Quran': { query: 'Quran Islamic', mythology: true },
  'Fiction': { query: 'fiction novel bestseller', fiction: true },
  'Romance': { query: 'romance fiction', fiction: true },
  'Mystery Thriller': { query: 'mystery thriller crime', fiction: true },
  'Science Fiction': { query: 'science fiction fantasy', fiction: true }
};

const ADMIN_USER_ID = process.env.ADMIN_USER_ID || 'admin-default-id';
const BASE_PRICE_INR = 299; // Base price in Indian Rupees
const PRICE_VARIATION = 0.8; // Price varies from 80% to 120% of base price

function randomPrice() {
  const min = Math.round(BASE_PRICE_INR * PRICE_VARIATION);
  const max = Math.round(BASE_PRICE_INR * (2 - PRICE_VARIATION));
  const price = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.round(price / 50) * 50; // Round to nearest 50 for nice prices
}

function randomCondition() {
  return CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
}

async function fetchBooksFromOpenLibrary(query, limit = 20) {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    const data = await response.json();

    return data.docs
      .filter(book => book.title && book.author_name)
      .map(book => ({
        title: book.title,
        author: book.author_name[0],
        isbn: book.isbn ? book.isbn[0] : null,
        description: book.first_sentence ? book.first_sentence[0] : 'A great book worth reading',
        imageUrl: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null,
        year: book.first_publish_year
      }))
      .slice(0, limit);
  } catch (error) {
    console.error(`Error fetching from OpenLibrary for "${query}":`, error.message);
    return [];
  }
}

async function fetchBooksFromGoogleBooks(query, limit = 20) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}&printType=books`
    );
    const data = await response.json();

    if (!data.items) return [];

    return data.items
      .filter(item => item.volumeInfo.title && item.volumeInfo.authors)
      .map(item => ({
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors[0],
        isbn: item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || null,
        description: item.volumeInfo.description || 'A great book worth reading',
        imageUrl: item.volumeInfo.imageLinks?.thumbnail || null
      }))
      .slice(0, limit);
  } catch (error) {
    console.error(`Error fetching from GoogleBooks for "${query}":`, error.message);
    return [];
  }
}

async function populateBooks() {
  try {
    console.log('🔄 Starting book population...\n');

    // Ensure admin user exists
    let adminUser = await prisma.user.findUnique({ where: { id: ADMIN_USER_ID } }).catch(() => null);
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          id: ADMIN_USER_ID,
          name: 'Admin Seller',
          email: `admin-${Date.now()}@dustyshelf.local`,
          passwordHash: 'hashed_admin_password',
          role: 'ADMIN'
        }
      });
      console.log('✅ Created admin user\n');
    }

    // Create categories
    const categories = [];
    for (const [categoryName] of Object.entries(CATEGORIES)) {
      const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
      const category = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: categoryName,
          slug,
          icon: '📚'
        }
      });
      categories.push(category);
    }
    console.log(`✅ Created/updated ${categories.length} categories\n`);

    let totalBooksAdded = 0;
    const booksPerCategory = 15; // ~330 books total

    for (const [categoryName, categoryConfig] of Object.entries(CATEGORIES)) {
      console.log(`📖 Fetching books for category: ${categoryName}...`);

      let books = [];

      // Try Open Library first
      const olBooks = await fetchBooksFromOpenLibrary(categoryConfig.query, booksPerCategory);
      books = [...books, ...olBooks];

      // If we need more, try Google Books
      if (books.length < booksPerCategory) {
        const gbBooks = await fetchBooksFromGoogleBooks(
          categoryConfig.query,
          booksPerCategory - books.length
        );
        books = [...books, ...gbBooks];
      }

      // Remove duplicates by ISBN
      const uniqueBooks = [];
      const seenISBNs = new Set();
      for (const book of books) {
        const isbn = book.isbn || `${book.title}-${book.author}`;
        if (!seenISBNs.has(isbn)) {
          seenISBNs.add(isbn);
          uniqueBooks.push(book);
        }
      }

      // Add books to database
      let categoryBooksAdded = 0;
      for (const book of uniqueBooks.slice(0, booksPerCategory)) {
        try {
          await prisma.book.upsert({
            where: { isbn: book.isbn || `temp-${Math.random()}` },
            update: {},
            create: {
              title: book.title.substring(0, 255),
              author: book.author.substring(0, 255),
              isbn: book.isbn,
              category: categoryName,
              description: book.description?.substring(0, 1000) || 'A great book worth reading',
              condition: randomCondition(),
              price: randomPrice(),
              stockQty: Math.floor(Math.random() * 10) + 1,
              imageUrl: book.imageUrl,
              status: 'ACTIVE',
              sellerId: adminUser.id
            }
          });
          categoryBooksAdded++;
        } catch (err) {
          console.warn(`  ⚠️ Could not add book "${book.title}": ${err.message.substring(0, 50)}`);
        }
      }

      console.log(`  ✅ Added ${categoryBooksAdded} books to "${categoryName}"\n`);
      totalBooksAdded += categoryBooksAdded;
    }

    console.log(`\n🎉 Population complete!`);
    console.log(`📊 Total books added: ${totalBooksAdded}`);
    console.log(`💰 Price range: ₹${Math.round(BASE_PRICE_INR * PRICE_VARIATION)} - ₹${Math.round(BASE_PRICE_INR * (2 - PRICE_VARIATION))}`);

    const bookCount = await prisma.book.count();
    console.log(`📚 Total books in database: ${bookCount}`);

  } catch (error) {
    console.error('❌ Population failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the population
populateBooks();
