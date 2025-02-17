import mongoose, { Schema, Document } from "mongoose";


interface INishuProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  colors: string[];
  stock: number;
  quantity: number;
  rating: number;
}

const NishuProductSchema = new Schema<INishuProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    images: { type: [String], required: true },
    colors: { type: [String], required: true },
    stock: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 1 },
    rating: { type: Number, required: true, min: 0, max: 5 },
  },
  { timestamps: true }
);

const NishuProduct = mongoose.models.NishuProduct || mongoose.model<INishuProduct>("NishuProduct", NishuProductSchema);

export default NishuProduct;

