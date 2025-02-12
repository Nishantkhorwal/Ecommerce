import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import NishuProduct from "@/models/products";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await NishuProduct.find();
    
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
