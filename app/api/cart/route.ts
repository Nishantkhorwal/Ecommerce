// app/api/cart/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase }from '@/db/connection'; // Adjust the path as needed
import NishuCart from '@/models/cart'; // Adjust the path as needed
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";

export async function POST(request: Request) {
  // Connect to your database
  await connectToDatabase();

  // Get the authenticated user's session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  // Assume the user ID is stored in session.user.id (adjust according to your session shape)
  const userId = session.user.id;

  try {
    // Parse the JSON body from the request
    const { productId, color, quantity } = await request.json();

    // Validate required fields; now color is required since it's stored in the schema
    if (!productId || !color || !quantity) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the cart for the user; if it doesn't exist, create a new one.
    let cart = await NishuCart.findOne({ user: userId });
    if (!cart) {
      cart = new NishuCart({ user: userId, items: [] });
    }

    // Check if an item with the same product and color already exists in the cart.
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (existingItemIndex !== -1) {
      // If the item exists, increment the quantity.
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Otherwise, add a new item with the provided product, color, and quantity.
      cart.items.push({ product: productId, quantity, color });
    }

    // Save the updated cart
    await cart.save();

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function GET() {
    // Connect to your database
    await connectToDatabase();
  
    // Get the authenticated user's session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
  
    // Assume the user ID is stored in session.user.id
    const userId = session.user.id;
  
    try {
      // Find the cart for the user and populate the product details if needed.
      const cart = await NishuCart.findOne({ user: userId }).populate("items.product")
      .lean() ;
      // If no cart exists, return an empty cart structure
      if (!cart) {
        return NextResponse.json({ success: true, cart: { user: userId, items: [] } });
      }
  
      return NextResponse.json({ success: true, cart });
    } catch (error) {
      console.error("Error retrieving cart:", error);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  }

  export async function DELETE() {
    // Connect to the database
    await connectToDatabase();
  
    // Get the authenticated user's session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }
  
    // Get the user ID from the session
    const userId = session.user.id;
  
    try {
      // Find the cart for the user and remove all items
      const cart = await NishuCart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }, // Set the items array to empty
        { new: true } // Return the updated cart
      );
  
      if (!cart) {
        return NextResponse.json({
          success: false,
          message: "Cart not found",
        });
      }
  
      return NextResponse.json({
        success: true,
        message: "Cart emptied successfully",
        cart,
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  }
  

