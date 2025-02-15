import { NextResponse } from "next/server";
 import mongoose from "mongoose";
import { connectToDatabase } from "@/db/connection";
import Order from "@/models/order";
import NishuCart from "@/models/cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
interface PopulatedProduct {
    _id: mongoose.Types.ObjectId;
    price: number;
  }
  
  // Define an interface for populated cart items
  interface PopulatedCartItem {
    product: PopulatedProduct;
    quantity: number;
    color: string;
  }
  
  // Define the populated cart type
  interface PopulatedCart {
    items: PopulatedCartItem[];
    taxRate: number;
  }

export async function POST(request: Request) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  try {
    const { paymentId, address, addressType } = await request.json();

    if (!["Home", "Office", "Other"].includes(addressType)) {
      return NextResponse.json({ success: false, message: "Invalid address type" }, { status: 400 });
    }

// Fetch the cart and cast it to the correct type
    const cart = (await NishuCart.findOne({ user: userId })
    .populate("items.product", "price")
    .lean()) as PopulatedCart | null;


    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    // ✅ Manually calculate total amount
    const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const taxRate = cart.taxRate || 0; // Ensure tax rate exists
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount; // Final amount including tax

    // Create new order
    const newOrder = new Order({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        color: item.color
      })),
      totalAmount, // ✅ Now correctly calculated
      address,
      addressType, // ✅ Store address type
      paymentId,
    });

    await newOrder.save();

    // Clear the cart
    await NishuCart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    return NextResponse.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
