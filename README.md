# Mock E-Com Cart 

This is a basic full-stack shopping cart app implementing the required e-commerce flows.

- Frontend: React + Vite + Tailwind CSS
- Backend: Node + Express (ESM) + MongoDB (Mongoose)
- REST APIs for products, cart, and checkout

## Repository Structure

```
/backend   # Express server, MongoDB models, REST routes
/frontend  # Vite React app with Tailwind UI
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or provide a connection string)

## Backend Setup

```
cd backend
npm install
# (optional) set env vars:
#  MONGODB_URI=mongodb://127.0.0.1:27017/vibe_commerce
#  PORT=4000
#  CLIENT_ORIGIN=http://localhost:5173
npm run seed
npm run dev
```

APIs:
- GET `/api/products`
- GET `/api/cart`
- POST `/api/cart` { productId, qty }
- PATCH `/api/cart/:id` { qty }
- DELETE `/api/cart/:id`
- POST `/api/checkout` { cartItems, name, email }

### Import products from Fake Store API

```
cd backend
# optional flags (defaults shown):
#   CLEAR_PRODUCTS_FIRST=true
#   FAKE_STORE_URL=https://fakestoreapi.com/products
npm run seed:fakestore
```

This fetches products from Fake Store API and inserts them into MongoDB (clearing existing products first unless `CLEAR_PRODUCTS_FIRST=false`).

## Frontend Setup

```
cd frontend
npm install
# optional: create .env and set VITE_API_BASE=http://localhost:4000
npm run dev
```

The app should be available at http://localhost:5173

## Notes
- Uses a mock user for cart persistence (`mock-user`).
- Seed script populates 5-6 mock products with images.
- Responsive grid layout using Tailwind.

## Deliverables

  - Demo: https://drive.google.com/file/d/1v9GAC0Iry2qt9MgU5Q-5nnzBs5EJNg2i/view?usp=sharing

## Screenshots
- 
<img width="1920" height="878" alt="Screenshot 2025-11-06 at 17-03-39 E-Commerce" src="https://github.com/user-attachments/assets/d3b2732c-ce9e-4148-98a1-573ece496c79" />
<img width="1920" height="878" alt="Screenshot 2025-11-06 at 17-03-15 E-Commerce" src="https://github.com/user-attachments/assets/8cdc874a-372b-4174-9393-ec57b7a41a47" />

