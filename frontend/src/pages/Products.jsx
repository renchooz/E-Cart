import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState(null);

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
      const [p, c] = await Promise.all([api.getProducts(), api.getCart()]);
      setProducts(p);
      setCart(c);
      setError('');
    } catch (e) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const cartItemByProductId = useMemo(() => {
    const map = new Map();
    for (const it of cart.items) map.set(String(it.productId), it);
    return map;
  }, [cart]);

  async function increment(productId) {
    setAddingId(productId);
    try {
      await api.addToCart(productId, 1);
      const c = await api.getCart();
      setCart(c);
    } finally {
      setTimeout(() => setAddingId((id) => (id === productId ? null : id)), 200);
    }
  }

  async function decrement(productId) {
    const item = cartItemByProductId.get(String(productId));
    if (!item) return; // nothing to decrement
    setAddingId(productId);
    try {
      if (item.qty > 1) {
        await api.updateCartItem(item.id, item.qty - 1);
      } else {
        await api.removeCartItem(item.id);
      }
      const c = await api.getCart();
      setCart(c);
    } finally {
      setTimeout(() => setAddingId((id) => (id === productId ? null : id)), 200);
    }
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <section className="flex-1 overflow-y-auto pr-2">
          <h2 className="font-semibold mb-3">Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded border p-3 flex flex-col h-full min-h-[360px] relative">
                <img src={p.imageUrl} alt={p.name} className="w-full h-40 object-cover rounded" />
                <div className="mt-3 font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">{formatINR(p.price)}</div>
                {(() => {
                  const currentQty = cartItemByProductId.get(String(p.id))?.qty || 0;
                  return (
                    <div className="mt-auto">
                      {currentQty === 0 ? (
                        <button
                          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium w-full
                            bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                            shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-pink-500/30
                            transition-all duration-200 ease-out hover:translate-y-[-1px] active:translate-y-0
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                            ${addingId === p.id ? 'opacity-90' : ''}`}
                          onClick={() => increment(p.id)}
                          disabled={addingId === p.id}
                        >
                          {addingId === p.id ? (
                            <>
                              <span className="inline-block h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                <path d="M2.25 3a.75.75 0 000 1.5h1.386c.3 0 .563.2.643.488l2.442 8.79A2.25 2.25 0 008.89 15h7.17a2.25 2.25 0 002.169-1.59l1.494-4.98A.75.75 0 0019.999 7.5H7.218l-.5-1.8A2.25 2.25 0 003.636 3H2.25z" />
                                <path d="M8.25 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.75 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                              </svg>
                              Add to Cart
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-2 border rounded-md p-1">
                          <button
                            className="h-8 w-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                            onClick={() => decrement(p.id)}
                            disabled={addingId === p.id}
                            title="Decrease"
                          >
                            −
                          </button>
                          <div className="min-w-[2rem] text-center text-sm">
                            {currentQty}
                          </div>
                          <button
                            className="h-8 w-8 flex items-center justify-center rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70"
                            onClick={() => increment(p.id)}
                            disabled={addingId === p.id}
                            title="Increase"
                          >
                            +
                          </button>
                        </div>
                      )}
                      {currentQty > 0 && (
                        <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          In cart: {currentQty}
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


