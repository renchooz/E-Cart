import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export const api = {
  async getProducts() {
    const { data } = await axios.get(`${BASE_URL}/api/products`);
    return data;
  },
  async getCart() {
    const { data } = await axios.get(`${BASE_URL}/api/cart`);
    return data;
  },
  async addToCart(productId, qty) {
    const { data } = await axios.post(`${BASE_URL}/api/cart`, { productId, qty });
    return data;
  },
  async updateCartItem(id, qty) {
    const { data } = await axios.patch(`${BASE_URL}/api/cart/${id}`, { qty });
    return data;
  },
  async removeCartItem(id) {
    await axios.delete(`${BASE_URL}/api/cart/${id}`);
  },
  async checkout(payload) {
    const { data } = await axios.post(`${BASE_URL}/api/checkout`, payload);
    return data;
  }
};


