import 'dotenv/config';
import { connectToDatabase } from '../lib/db.js';
import { Product } from '../models/Product.js';

const FAKE_STORE_URL = process.env.FAKE_STORE_URL || 'https://fakestoreapi.com/products';
const CLEAR_FIRST = (process.env.CLEAR_PRODUCTS_FIRST || 'true').toLowerCase() === 'true';

async function fetchFakeStoreProducts() {
  const res = await fetch(FAKE_STORE_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch Fake Store API: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected response format from Fake Store API');
  }
  return data;
}

function mapToProductDocs(items) {
  return items.map((it) => ({
    name: it.title,
    price: Number(it.price) || 0,
    imageUrl: it.image,
    description: it.description
  }));
}

async function run() {
  await connectToDatabase();
  if (CLEAR_FIRST) {
    const del = await Product.deleteMany({});
    // eslint-disable-next-line no-console
    console.log(`Cleared products: ${del.deletedCount}`);
  }
  const items = await fetchFakeStoreProducts();
  const docs = mapToProductDocs(items);
  if (docs.length === 0) {
    // eslint-disable-next-line no-console
    console.log('No products to insert.');
    process.exit(0);
  }
  const result = await Product.insertMany(docs);
  // eslint-disable-next-line no-console
  console.log(`Inserted products from Fake Store: ${result.length}`);
  process.exit(0);
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


