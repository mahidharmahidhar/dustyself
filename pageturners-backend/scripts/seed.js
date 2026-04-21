import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Comprehensive book database with ~80+ titles across all categories
const baseBooks = {
  'UG': [
    { title: 'The C Programming Language', author: 'Kernighan & Ritchie' },
    { title: 'C Primer Plus', author: 'Stephen Prata' },
    { title: 'Head First Java', author: 'Bates & Sierra' },
    { title: 'Java Complete Reference', author: 'Herbert Schildt' },
    { title: 'Introduction to Algorithms', author: 'Cormen et al' },
    { title: 'Data Structures Using C', author: 'Reema Thareja' },
    { title: 'Python Crash Course', author: 'Eric Matthes' },
    { title: 'Learn Python 3 the Hard Way', author: 'Zed Shaw' },
    { title: 'Database Design', author: 'Ramakrishnan & Gehrke' },
    { title: 'SQL in 10 Minutes', author: 'Ben Forta' },
    { title: 'Web Development Basics', author: 'Jon Duckett' },
    { title: 'HTML & CSS Guide', author: 'Duckett & Others' },
    { title: 'JavaScript Essentials', author: 'Kyle Simpson' },
    { title: 'You Don\'t Know JS', author: 'Kyle Simpson' },
    { title: 'Operating Systems', author: 'Silberschatz et al' },
    { title: 'Computer Networks', author: 'Tanenbaum & Wetherall' },
    { title: 'Discrete Mathematics', author: 'Kenneth Rosen' },
    { title: 'Linear Algebra', author: 'David Lay' },
  ],
  'PG': [
    { title: 'Artificial Intelligence: A Modern Approach', author: 'Russell & Norvig' },
    { title: 'Deep Learning', author: 'Goodfellow et al' },
    { title: 'Machine Learning: A Probabilistic Perspective', author: 'Kevin Murphy' },
    { title: 'Pattern Recognition & Machine Learning', author: 'Christopher Bishop' },
    { title: 'Reinforcement Learning: An Introduction', author: 'Sutton & Barto' },
    { title: 'Computer Vision', author: 'Richard Szeliski' },
    { title: 'Natural Language Processing', author: 'Jurafsky & Martin' },
    { title: 'Neural Networks', author: 'Michael Nielsen' },
    { title: 'Optimization Algorithms', author: 'Boyd & Vandenberghe' },
    { title: 'Advanced Data Structures', author: 'Peter Brass' },
    { title: 'Computational Geometry', author: 'Mark de Berg' },
    { title: 'Graph Algorithms', author: 'Shimon Even' },
  ],
  'Programming': [
    { title: 'Clean Code', author: 'Robert Martin' },
    { title: 'Code Complete', author: 'Steve McConnell' },
    { title: 'Design Patterns', author: 'Gang of Four' },
    { title: 'Refactoring', author: 'Martin Fowler' },
    { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt' },
    { title: 'Software Architecture in Practice', author: 'Bass et al' },
    { title: 'Microservices Patterns', author: 'Chris Richardson' },
    { title: 'Building Microservices', author: 'Sam Newman' },
    { title: 'Domain-Driven Design', author: 'Eric Evans' },
    { title: 'Test Driven Development', author: 'Kent Beck' },
    { title: 'React in Action', author: 'Mark Thomas' },
    { title: 'Node.js in Action', author: 'Mike Cantelon' },
    { title: 'Express.js in Action', author: 'Evan Hahn' },
    { title: 'Full Stack JavaScript', author: 'Colin Ihrig' },
  ],
  'Commerce': [
    { title: 'Introduction to Accounting', author: 'G. Haryana' },
    { title: 'Financial Accounting', author: 'Subhash C. Sharma' },
    { title: 'Microeconomics', author: 'Paul Krugman' },
    { title: 'Macroeconomics', author: 'David C. Colander' },
    { title: 'Principles of Economics', author: 'N. Gregory Mankiw' },
    { title: 'Business Law', author: 'A.P. Sharma' },
    { title: 'Corporate Finance', author: 'Jonathan Berk & Peter DeMarzo' },
    { title: 'Investment Analysis', author: 'Frank K. Reilly' },
    { title: 'International Business', author: 'John Daniels' },
    { title: 'Marketing Management', author: 'Philip Kotler' },
    { title: 'Operations Management', author: 'Jay Heizer' },
    { title: 'Organizational Behavior', author: 'Stephen Robbins' },
  ],
  'Mythology': [
    { title: 'The Mahabharata', author: 'Vyasa' },
    { title: 'Ramayana', author: 'Valmiki' },
    { title: 'Bhagavad Gita', author: 'Lord Krishna' },
    { title: 'Vedas', author: 'Various Rishis' },
    { title: 'Puranas', author: 'Various' },
    { title: 'Greek Mythology', author: 'Edith Hamilton' },
    { title: 'Norse Mythology', author: 'Neil Gaiman' },
    { title: 'Egyptian Mythology', author: 'Richard Armour' },
    { title: 'Mythology: Timeless Tales', author: 'Stephen Fry' },
    { title: 'The Odyssey', author: 'Homer' },
    { title: 'The Iliad', author: 'Homer' },
    { title: 'Upanishads', author: 'Various' },
  ],
  'Fiction': [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { title: '1984', author: 'George Orwell' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { title: 'Pride and Prejudice', author: 'Jane Austen' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
    { title: 'Harry Potter', author: 'J.K. Rowling' },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
    { title: 'Jane Eyre', author: 'Charlotte Bronte' },
    { title: 'Wuthering Heights', author: 'Emily Bronte' },
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    { title: 'Dune', author: 'Frank Herbert' },
    { title: 'Foundation', author: 'Isaac Asimov' },
    { title: 'The Silmarillion', author: 'J.R.R. Tolkien' },
    { title: 'Neuromancer', author: 'William Gibson' },
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin' },
    { title: 'Beloved', author: 'Toni Morrison' },
    { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez' },
    { title: 'The Midnight Library', author: 'Matt Haig' },
    { title: 'Educated', author: 'Tara Westover' },
    { title: 'The Nightingale', author: 'Kristin Hannah' },
  ],
};

const conditions = ['LIKE_NEW', 'GOOD', 'ACCEPTABLE'];

async function seed() {
  try {
    console.log('🗑️  Clearing existing data...');

    // Clear all data in reverse dependency order
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('✅ Cleared all data\n');

    console.log('📚 Creating 6 categories...');
    const categories = {
      'UG': await prisma.category.create({ data: { name: 'UG', slug: 'ug', description: 'Undergraduate' } }),
      'PG': await prisma.category.create({ data: { name: 'PG', slug: 'pg', description: 'Postgraduate' } }),
      'Programming': await prisma.category.create({ data: { name: 'Programming', slug: 'programming', description: 'Programming' } }),
      'Commerce': await prisma.category.create({ data: { name: 'Commerce', slug: 'commerce', description: 'Commerce' } }),
      'Mythology': await prisma.category.create({ data: { name: 'Mythology', slug: 'mythology', description: 'Mythology' } }),
      'Fiction': await prisma.category.create({ data: { name: 'Fiction', slug: 'fiction', description: 'Fiction' } })
    };
    console.log('✅ Categories created\n');

    console.log('👤 Creating admin user...');
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@dustyshelf.com',
        passwordHash: '$2a$12$...',
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created\n');

    console.log('📖 Generating 500 books...');
    let bookCount = 0;
    let isbnCounter = 10000; // Start with unique ISBN counter

    // Generate books across all categories
    for (const [categoryKey, booksList] of Object.entries(baseBooks)) {
      console.log(`  📚 Creating books for category: ${categoryKey} (${booksList.length} base books)`);

      // Calculate copies per book to reach ~500 total
      // Adjusted to create exactly 500 books
      let copiesPerBook;
      if (categoryKey === 'Fiction') copiesPerBook = 7;
      else if (categoryKey === 'Programming') copiesPerBook = 6;
      else if (categoryKey === 'UG') copiesPerBook = 6;
      else copiesPerBook = 5;

      for (const book of booksList) {
        for (let copy = 1; copy <= copiesPerBook; copy++) {
          const isbn = `ISBN${isbnCounter++}`;
          const price = 150 + Math.floor(Math.random() * 450); // ₹150-600
          const condition = conditions[Math.floor(Math.random() * conditions.length)];
          const edition = copy > 1 ? ` (Edition ${copy})` : '';

          try {
            await prisma.book.create({
              data: {
                title: book.title + edition,
                author: book.author,
                isbn,
                category: categoryKey,
                categoryId: categories[categoryKey]?.id,
                condition,
                price,
                description: `${book.title} by ${book.author}. A comprehensive guide for ${categoryKey} studies.`,
                imageUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
                sellerId: admin.id,
                status: 'ACTIVE',
                stockQty: Math.floor(Math.random() * 8) + 1
              }
            });
            bookCount++;
          } catch (err) {
            console.error(`Error creating ${book.title}:`, err.message);
          }
        }
      }
    }

    console.log(`\n✅ Created ${bookCount} books\n`);

    console.log('🎉 Database seeded successfully!');
    console.log(`📊 Summary: 6 categories, 1 admin, ${bookCount} books`);
    console.log(`📍 Access at: http://localhost:3004\n`);

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
