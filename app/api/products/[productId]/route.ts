import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/db/connection"; // Import MongoDB connection utility
import NishuProduct from "@/models/products";


export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
    try {
       await connectToDatabase();
       const {productId} =  params ;
       if(!productId){
        return NextResponse.json({message : "Product id not found"}, {status : 400})
       }

       const product = await NishuProduct.findById(productId);
       if(!product) {
        return NextResponse.json({message : "Product with this Id not found"}, {status : 404});
       } 

       return NextResponse.json({ success: true, product }, { status: 200 });


    }catch(e) {
      console.log("Server Error", e);
      return NextResponse.json({success: false, message: "Error fetching product"}, {status : 500});
    }
}