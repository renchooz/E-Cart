import React from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/Products.jsx';
import CartPage from './pages/Cart.jsx';

export default function App() {
  return (
    <div className="max-w-6xl mx-auto p-4 h-screen flex flex-col">
      <header className="flex items-center justify-between py-4">
        <Link to="/" className="text-2xl font-bold">E-Commerce Web</Link>
        <nav className="flex items-center gap-3 text-sm">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-indigo-600 font-medium' : 'text-gray-700'}>Products</NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'text-indigo-600 font-medium' : 'text-gray-700'}>Cart</NavLink>
        </nav>
      </header>

      <div className="flex-1 overflow-hidden min-h-0">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </div>
  );
}


