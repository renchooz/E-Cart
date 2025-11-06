import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1, default: 1 }
  },
  { timestamps: true }
);

CartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', CartItemSchema);


