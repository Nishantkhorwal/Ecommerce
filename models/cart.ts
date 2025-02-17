import mongoose, { Document, Schema, Model, models } from "mongoose";

// Interface for each Cart Item
export interface ICartItem {
  product: mongoose.Types.ObjectId; // Reference to the product
  quantity: number;
  color: string; // Added color field
}

// Interface for the Cart Document (stored properties)
export interface ICart extends Document {
  user: mongoose.Types.ObjectId; // Assuming a user ID is associated with the cart
  items: ICartItem[];
  taxRate: number; // e.g., 0.07 for 7%
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema for a Cart Item
const cartItemSchema = new Schema<ICartItem>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "NishuProduct", required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  color: { type: String, required: true } // New color field is required
});

// Schema for the Cart
const cartSchema = new Schema<ICart>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "EcomUser", required: true },
    items: [cartItemSchema],
    taxRate: { type: Number, required: true, default: 0 }, // Use a tax rate (e.g., 0.07 for 7%)
  },
  { timestamps: true }
);

// Virtual field to calculate the total price (before tax)
cartSchema.virtual("totalPrice").get(function (this: ICart) {
  let total = 0;
  this.items.forEach((item) => {
    // Ensure product is populated so we can access its price
    const product: any = item.product;
    if (product && product.price) {
      total += product.price * item.quantity;
    }
  });
  return total;
});

// Virtual field to calculate the tax amount (in currency)
cartSchema.virtual("taxAmount").get(function (this: ICart) {
  // Calculate tax amount as: totalPrice * taxRate
  const total = this.get("totalPrice");
  return total * this.taxRate;
});

// Virtual field to calculate the total price including tax
cartSchema.virtual("totalPriceWithTax").get(function (this: ICart) {
  const total = this.get("totalPrice");
  const tax = this.get("taxAmount");
  return total + tax;
});

// Ensure virtual fields are serialized when converting to JSON or an object
cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

// Prevent model recompilation in environments like Next.js
const NishuCart: Model<ICart> =
  models.NishuCart || mongoose.model<ICart>("NishuCart", cartSchema);

export default NishuCart;

