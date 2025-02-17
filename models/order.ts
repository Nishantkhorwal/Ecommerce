import mongoose, { Schema, Document } from "mongoose";



// Define the Order Item interface
interface OrderItem {
  product: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId; price: number };
  quantity: number;
  color: string;
}

// Define the Order interface
export interface OrderDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  address: string;
  addressType: "Home" | "Office" | "Other"; // ✅ More precise type
  paymentId: string;
  createdAt: Date;
}

// Define the Order Schema
const orderSchema = new Schema<OrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "EcomUser", required: true }, // ✅ FIXED!
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "NishuProduct", required: true }, // ✅ FIXED!
        quantity: { type: Number, required: true },
        color: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    addressType: { type: String, enum: ["Home", "Office", "Other"], required: true },
    paymentId: { type: String, required: true },
  },
  { timestamps: true } // ✅ Adds `createdAt` & `updatedAt` automatically
);

// Define the Mongoose Model
const Order = mongoose.models.Order || mongoose.model<OrderDocument>("Order", orderSchema);

export default Order;


