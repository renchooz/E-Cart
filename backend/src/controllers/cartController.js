import mongoose from 'mongoose';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';

function getUserId(req) {
  return 'mock-user';
}

export async function getCart(req, res) {
  const userId = getUserId(req);
  const items = await CartItem.find({ userId }).lean();
  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const cartItems = items.map((i) => {
    const p = productMap.get(i.productId.toString());
    const price = p?.price || 0;
    return {
      id: i._id,
      productId: i.productId,
      name: p?.name,
      price,
      qty: i.qty,
      subtotal: price * i.qty
    };
  });

  const total = cartItems.reduce((sum, it) => sum + it.subtotal, 0);
  res.json({ items: cartItems, total });
}

export async function addToCart(req, res) {
  const userId = getUserId(req);
  const { productId, qty = 1 } = req.body || {};
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ error: 'Invalid productId' });
  }
  const product = await Product.findById(productId).lean();
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const updated = await CartItem.findOneAndUpdate(
    { userId, productId },
    { $inc: { qty: qty || 1 } },
    { upsert: true, new: true }
  ).lean();

  res.status(201).json({ id: updated._id, productId: updated.productId, qty: updated.qty });
}

export async function updateCartItem(req, res) {
  const userId = getUserId(req);
  const { id } = req.params;
  const { qty } = req.body || {};
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
  if (typeof qty !== 'number' || qty < 1) return res.status(400).json({ error: 'qty must be >= 1' });

  const updated = await CartItem.findOneAndUpdate({ _id: id, userId }, { $set: { qty } }, { new: true }).lean();
  if (!updated) return res.status(404).json({ error: 'Cart item not found' });
  res.json({ id: updated._id, qty: updated.qty });
}

export async function deleteCartItem(req, res) {
  const userId = getUserId(req);
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
  const result = await CartItem.findOneAndDelete({ _id: id, userId }).lean();
  if (!result) return res.status(404).json({ error: 'Cart item not found' });
  res.status(204).send();
}


