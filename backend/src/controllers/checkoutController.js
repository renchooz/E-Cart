import { CartItem } from '../models/CartItem.js';

function getUserId(req) {
  return 'mock-user';
}

export async function createCheckout(req, res) {
  const { cartItems = [], name, email } = req.body || {};
  if (!Array.isArray(cartItems)) return res.status(400).json({ error: 'cartItems must be an array' });
  if (!name || !email) return res.status(400).json({ error: 'name and email are required' });

  const total = cartItems.reduce((sum, it) => sum + (Number(it.price) * Number(it.qty || 0)), 0);
  const receipt = {
    id: `rcpt_${Date.now()}`,
    name,
    email,
    total,
    timestamp: new Date().toISOString()
  };

  // Clear the user's cart after a successful "checkout"
  const userId = getUserId(req);
  await CartItem.deleteMany({ userId });

  res.status(201).json({ receipt });
}


