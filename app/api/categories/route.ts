import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import NishuProduct from "@/models/products";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch products and group by unique categories
    const products = await NishuProduct.aggregate([
      {
        $group: {
          _id: "$category",
          image: { $first: "$images" }, // Get the first image of the product in each category
        },
      },
      {
        $project: {
          category: "$_id",
          image: { $arrayElemAt: ["$image", 0] }, // Extract first image from array
          _id: 0,
        },
      },
    ]);

    return NextResponse.json({ success: true, categories: products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
