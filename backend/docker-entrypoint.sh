#!/bin/sh
set -e

echo "Waiting for MongoDB to be ready..."
# Wait for MongoDB connection with retries
max_attempts=30
attempt=0
until node -e "import('mongoose').then(async (m) => { const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe_commerce'; await m.default.connect(uri, {serverSelectionTimeoutMS: 5000}); console.log('MongoDB connected'); await m.default.connection.close(); process.exit(0); }).catch(() => process.exit(1));" 2>/dev/null; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "MongoDB connection timeout"
    exit 1
  fi
  echo "Waiting for MongoDB... (attempt $attempt/$max_attempts)"
  sleep 2
done

echo "MongoDB is ready! Checking if database needs seeding..."

# Check if products exist, if not, seed the database
node -e "
import('./src/lib/db.js').then(async ({ connectToDatabase }) => {
  try {
    await connectToDatabase();
    const { Product } = await import('./src/models/Product.js');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('No products found. Seeding database with Fake Store API...');
      const { default: fetch } = await import('node-fetch');
      const url = process.env.FAKE_STORE_URL || 'https://fakestoreapi.com/products';
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`Failed to fetch: \${res.status}\`);
      const items = await res.json();
      const docs = items.map((it) => ({
        name: it.title,
        price: Number(it.price) || 0,
        imageUrl: it.image,
        description: it.description
      }));
      const result = await Product.insertMany(docs);
      console.log(\`✓ Seeded \${result.length} products successfully\`);
    } else {
      console.log(\`✓ Database has \${count} products. Skipping seed.\`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err.message);
    process.exit(0); // Don't fail startup if seeding fails
  }
});
"

echo "Starting backend server..."
exec npm start
