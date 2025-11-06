import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);


