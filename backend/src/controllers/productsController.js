import { Product } from '../models/Product.js';

export async function listProducts(req, res) {
  const products = await Product.find().sort({ createdAt: 1 }).lean();
  res.json(
    products.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      description: p.description
    }))
  );
}


