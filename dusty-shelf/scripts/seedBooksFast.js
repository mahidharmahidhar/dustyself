import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES_MAP = {
  "C Programming": "UG", "Java": "UG", "Data structures": "UG", "Computer algorithms": "UG",
  "Operating systems": "UG", "Database": "UG", "Computer networks": "UG",
  "Artificial intelligence": "PG", "Machine learning": "PG", "Deep learning": "PG",
  "Web development": "Programming", "JavaScript": "Programming", "Python": "Programming", "React": "Programming",
  "Accounting": "Commerce", "Finance": "Commerce", "Economics": "Commerce", "Business": "Commerce",
  "Fiction": "Fiction", "Self-help": "Lifestyle", "Psychology": "Lifestyle",
};

const DEFAULT_PRICES = {
  "UG": { min: 400, max: 900 }, "PG": { min: 900, max: 1500 }, "Programming": { min: 500, max: 1000 },
  "Commerce": { min: 600, max: 1000 }, "Mythology": { min: 400, max: 900 }, "Fiction": { min: 300, max: 800 },
  "Lifestyle": { min: 400, max: 900 },
};

const CONDITIONS = ["Like New", "Good", "Acceptable"];
const SEARCH_QUERIES = [
  "programming", "python", "java", "javascript", "web", "machine learning", "database",
  "operating systems", "algorithms", "fiction", "business", "finance", "accounting", "economics",
];

function mapCategory(googleCategory) {
  if (!googleCategory) return "General";
  for (const [key, value] of Object.entries(CATEGORIES_MAP)) {
    if (googleCategory.toLowerCase().includes(key.toLowerCase())) return value;
  }
  if (googleCategory.includes("Computer")) return "UG";
  if (googleCategory.includes("Artificial") || googleCategory.includes("Machine")) return "PG";
  if (googleCategory.includes("Programming")) return "Programming";
  if (googleCategory.includes("Fiction")) return "Fiction";
  if (googleCategory.includes("Business") || googleCategory.includes("Finance")) return "Commerce";
  return "General";
}

function generatePrice(category) {
  const range = DEFAULT_PRICES[category] || DEFAULT_PRICES["UG"];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function generateRating() {
  return parseFloat((Math.random() * 0.4 + 4.5).toFixed(1));
}

function generateReviews() {
  return Math.floor(Math.random() * 4000) + 500;
}

async function fetchAllBooksParallel() {
  console.log("🚀 FAST MODE: Fetching books in parallel from Google API...\n");

  try {
    // Fetch all queries in parallel
    const promises = SEARCH_QUERIES.map((query, idx) =>
      axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`,
        { timeout: 8000 }
      ).then(res => {
        console.log(`✅ Query ${idx + 1}/${SEARCH_QUERIES.length}: "${query}" → ${res.data.items?.length || 0} books`);
        return res.data.items || [];
      }).catch(err => {
        console.log(`⚠️  Query ${idx + 1}/${SEARCH_QUERIES.length}: "${query}" → Failed (${err.response?.status || err.message})`);
        return [];
      })
    );

    const allResults = await Promise.all(promises);
    console.log(`\n📦 Processing ${allResults.flat().length} total items...\n`);

    // Process all books
    const books = [];
    const seen = new Set();
    let bookId = 1;

    for (const items of allResults) {
      for (const item of items) {
        if (!item.volumeInfo?.title) continue;

        const info = item.volumeInfo;
        const key = `${info.title}|${info.authors?.[0] || ""}`;

        // Skip duplicates
        if (seen.has(key)) continue;
        seen.add(key);

        const googleCategory = info.categories?.[0];
        const mappedCategory = mapCategory(googleCategory);

        books.push({
          id: bookId++,
          title: info.title.substring(0, 100),
          author: (info.authors?.[0] || "Unknown Author").substring(0, 100),
          price: generatePrice(mappedCategory),
          category: mappedCategory,
          description: (info.description || `A great read about ${mappedCategory}`).substring(0, 200),
          rating: generateRating(),
          reviews: generateReviews(),
          isbn: info.industryIdentifiers?.find(x => x.type === "ISBN_13")?.identifier || "",
          publishedDate: info.publishedDate || "Unknown",
          pageCount: info.pageCount || 0,
          condition: CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)],
          stock: Math.floor(Math.random() * 8) + 2,
        });

        if (books.length >= 100) break;
      }
      if (books.length >= 100) break;
    }

    // Save to file
    const outputPath = path.join(__dirname, "../src/data/books.json");
    fs.writeFileSync(outputPath, JSON.stringify(books, null, 2));

    console.log(`\n✅ SUCCESS! Fetched ${books.length} unique books`);
    console.log(`📁 Saved to: src/data/books.json`);
    console.log(`\n📊 Stats:`);
    const stats = {};
    books.forEach(b => stats[b.category] = (stats[b.category] || 0) + 1);
    Object.entries(stats).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} books`);
    });

  } catch (err) {
    console.error("❌ Fatal error:", err.message);
    process.exit(1);
  }
}

console.time("⏱️  Total Time");
await fetchAllBooksParallel();
console.timeEnd("⏱️  Total Time");
