import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES_MAP = {
  "C Programming": "UG",
  "Java (Computer program language)": "UG",
  "Data structures": "UG",
  "Computer algorithms": "UG",
  "Operating systems": "UG",
  "Database": "UG",
  "Computer networks": "UG",
  "Artificial intelligence": "PG",
  "Machine learning": "PG",
  "Deep learning": "PG",
  "Reinforcement learning": "PG",
  "Web development": "Programming",
  "JavaScript": "Programming",
  "Python": "Programming",
  "React": "Programming",
  "Node.js": "Programming",
  "Accounting": "Commerce",
  "Finance": "Commerce",
  "Economics": "Commerce",
  "Business": "Commerce",
  "Marketing": "Commerce",
  "Fiction": "Fiction",
  "Self-help": "Lifestyle",
  "Psychology": "Lifestyle",
};

const DEFAULT_PRICES = {
  "UG": { min: 400, max: 900 },
  "PG": { min: 900, max: 1500 },
  "Programming": { min: 500, max: 1000 },
  "Commerce": { min: 600, max: 1000 },
  "Mythology": { min: 400, max: 900 },
  "Fiction": { min: 300, max: 800 },
  "Lifestyle": { min: 400, max: 900 },
};

const CONDITIONS = ["Like New", "Good", "Acceptable"];

const SEARCH_QUERIES = [
  "C programming",
  "Python programming",
  "Java programming",
  "Data structures",
  "Web development",
  "Machine learning",
  "Database design",
  "Operating systems",
  "Business management",
  "Finance",
];

function mapCategory(googleCategory) {
  if (!googleCategory) return "General";

  for (const [key, value] of Object.entries(CATEGORIES_MAP)) {
    if (googleCategory.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Fuzzy matching
  if (googleCategory.includes("Computer")) return "UG";
  if (googleCategory.includes("Artificial")) return "PG";
  if (googleCategory.includes("Programming")) return "Programming";
  if (googleCategory.includes("Fiction")) return "Fiction";
  if (googleCategory.includes("Business") || googleCategory.includes("Finance")) return "Commerce";

  return "General";
}

function generatePrice(category) {
  const range = DEFAULT_PRICES[category] || DEFAULT_PRICES["General"];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function generateRating() {
  return parseFloat((Math.random() * 0.4 + 4.5).toFixed(1));
}

function generateReviews() {
  return Math.floor(Math.random() * 4000) + 500;
}

async function fetchBooks() {
  let books = [];
  let bookId = 1;

  try {
    for (const query of SEARCH_QUERIES) {
      console.log(`Fetching books for: ${query}...`);

      try {
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`,
          { timeout: 5000 }
        );

        if (!res.data.items) {
          console.log(`No items found for ${query}`);
          continue;
        }

        res.data.items.forEach(item => {
          if (!item.volumeInfo || !item.volumeInfo.title) return;

          const info = item.volumeInfo;
          const googleCategory = info.categories?.[0];
          const mappedCategory = mapCategory(googleCategory);

          books.push({
            id: bookId++,
            title: info.title.substring(0, 100),
            author: (info.authors?.[0] || "Unknown Author").substring(0, 100),
            price: generatePrice(mappedCategory),
            category: mappedCategory,
            description: (info.description || "A great read about " + query).substring(0, 200),
            rating: generateRating(),
            reviews: generateReviews(),
            isbn: info.industryIdentifiers?.find(x => x.type === "ISBN_13")?.identifier ||
              info.industryIdentifiers?.[0]?.identifier ||
              "",
            publishedDate: info.publishedDate || "Unknown",
            pageCount: info.pageCount || 0,
            condition: CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)],
            stock: Math.floor(Math.random() * 8) + 2,
          });

          if (books.length >= 100) return; // Limit to 100 books
        });

      } catch (err) {
        console.error(`Error fetching ${query}:`, err.message);
      }

      if (books.length >= 100) break;
    }

    // Ensure unique books and limit to 81
    const uniqueBooks = Array.from(
      new Map(books.map(b => [b.title + b.author, b])).values()
    ).slice(0, 81);

    // Renumber IDs
    uniqueBooks.forEach((book, idx) => {
      book.id = idx + 1;
    });

    // Save to file
    const outputPath = path.join(__dirname, "../src/data/books.json");
    fs.writeFileSync(outputPath, JSON.stringify(uniqueBooks, null, 2));

    console.log(`\n✅ Successfully fetched ${uniqueBooks.length} books!`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`\nSample book:`);
    console.log(JSON.stringify(uniqueBooks[0], null, 2));

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

fetchBooks();
