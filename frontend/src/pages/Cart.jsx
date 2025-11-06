import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { ReceiptModal } from '../components/ReceiptModal.jsx';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });

  function formatINR(value) {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value || 0));
    } catch {
      return `₹${Number(value || 0).toFixed(2)}`;
    }
  }

  async function refresh() {
    setLoading(true);
    try {
      const c = await api.getCart();
      setCart(c);
      setError('');
    } catch (e) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const cartCount = useMemo(() => cart.items.reduce((s, i) => s + i.qty, 0), [cart]);

  async function updateQty(itemId, qty) {
    await api.updateCartItem(itemId, qty);
    await refresh();
  }

  async function removeItem(itemId) {
    await api.removeCartItem(itemId);
    await refresh();
  }

  async function submitCheckout(e) {
    e.preventDefault();
    const cartItems = cart.items.map((i) => ({ productId: i.productId, price: i.price, qty: i.qty }));
    const res = await api.checkout({ cartItems, name: form.name, email: form.email });
    setReceipt(res.receipt);
    await refresh();
  }

  return (
    <div className="flex-1 overflow-hidden min-h-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Cart ({cartCount})</h2>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 h-full overflow-hidden">
          <section className="md:col-span-2 bg-white rounded border divide-y overflow-y-auto">
            {cart.items.length === 0 && <div className="p-3 text-gray-500">Your cart is empty.</div>}
            {cart.items.map((i) => (
              <div key={i.id} className="p-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-gray-600">{formatINR(i.price)}</div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) => updateQty(i.id, Number(e.target.value))}
                  className="w-16 border rounded p-1"
                />
                <div className="w-24 text-right text-sm">{formatINR(i.price * i.qty)}</div>
                <button className="text-red-600 text-sm" onClick={() => removeItem(i.id)}>Remove</button>
              </div>
            ))}
            <div className="p-3 flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{formatINR(cart.total)}</span>
            </div>
          </section>
          <aside className="bg-white rounded border p-4 overflow-y-auto">
            <form className="space-y-3" onSubmit={submitCheckout}>
              <div className="text-lg font-semibold">Checkout</div>
              <input className="w-full border rounded p-2" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <input className="w-full border rounded p-2" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              <button type="submit" className="w-full px-3 py-2 bg-indigo-600 text-white rounded" disabled={cart.items.length === 0}>Place Order</button>
            </form>
          </aside>
        </div>
      )}

      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
    </div>
  );
}


