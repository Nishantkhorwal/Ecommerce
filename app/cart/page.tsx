"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";
import React, { useEffect, useState } from "react";

const poppins = Poppins({
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  subsets: ["latin"],
});

// Define interfaces for Product, CartItem, and Cart.
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  colors: string[];
  stock: number;
  rating: number;
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  color: string;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  taxRate: number;
  totalPrice: number; // Virtual field: subtotal before tax
  taxAmount: number; // Virtual field: calculated tax
  totalPriceWithTax: number; // Virtual field: total including tax
}

function Page() {
  // States for the cart and its loading/error status.
  const [cart, setCart] = useState<Cart | null>(null);
  const [loadingCart, setLoadingCart] = useState<boolean>(true);
  const [cartError, setCartError] = useState<string | null>(null);

  // Fetch the cart from your backend GET endpoint on component mount.
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart", { method: "GET" });
        const data = await res.json();
        if (data.success) {
          setCart(data.cart);
        } else {
          setCartError("Failed to fetch cart.");
        }
      } catch (err) {
        setCartError("Error fetching cart.");
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, []);

  // Example quantity state and handler for demonstration.
  const [quantity, setQuantity] = useState<number>(1);
  const stock = 20;
  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <div>
      <Navbar />
      {/* Use min-h-screen to allow content to grow if needed */}
      <div className="px-6 lg:px-32 py-20 min-h-screen flex flex-col pb-20">
        <h1 className={`${poppins.className} font-semibold text-4xl mb-10`}>
          Your Basket
        </h1>
        <div className="flex flex-1 flex-col lg:flex-row gap-6">
          {/* Left Column: Scrollable Cart Items */}
          <div className="w-full lg:w-[70%] overflow-y-auto">
            {loadingCart ? (
              <p className="text-center">Loading cart...</p>
            ) : cartError ? (
              <p className="text-center text-red-500">{cartError}</p>
            ) : cart && cart.items && cart.items.length > 0 ? (
              cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-row gap-6 border mb-7 py-6 justify-center items-center px-4 shadow-xl rounded-md"
                >
                  <div className="w-[40%]">
                    <img
                      src={item.product.images[0] || "/images/p1.jpg"}
                      alt={item.product.name}
                      className="w-full object-cover h-[200px]"
                    />
                  </div>
                  <div className="w-[60%] flex flex-col justify-between">
                    <div className="w-full">
                      <p
                        className={`font-bold ${poppins.className} text-xl w-full mb-5`}
                      >
                        {item.product.name}
                      </p>
                      <div className="flex items-center gap-4 mb-14">
                        <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
                          <span>{item.quantity}</span>
                        </div>
                        <div className="text-xs">
                          Color:{" "}
                          <span className="text-orange-500">
                            {item.color}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <p
                        className={`font-semibold ${poppins.className} text-xl`}
                      >
                        Subtotal
                      </p>
                      <p
                        className={`font-semibold ${poppins.className} text-xl`}
                      >
                        ${item.product.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Your basket is empty.</p>
            )}
          </div>

          {/* Right Column: Sticky Order Summary / Checkout */}
          <div className="w-full lg:w-[30%]">
            <div className="sticky top-20">
              <div className="shadow-xl border rounded-md py-8 px-8">
                <div className="flex flex-row justify-between items-center gap-4">
                  <div className="flex flex-row items-center">
                    <input type="radio" className="me-1" defaultChecked />
                    <p>Home Address</p>
                  </div>
                  <div className="flex flex-row items-center">
                    <input type="radio" className="me-1" />
                    <p>Office Address</p>
                  </div>
                </div>
                <div className="h-[1px] w-full bg-gray-600 mt-3 mb-6"></div>
                <div className="flex flex-row justify-between text-sm">
                  <p>Subtotal</p>
                  <p>${cart ? cart.totalPrice : 0}</p>
                </div>
                <div className="flex flex-row justify-between text-sm mb-6">
                  <p>Delivery</p>
                  <p>$0</p>
                </div>
                <div className="flex font-semibold flex-row justify-between text-xl mb-4">
                  <p>Total</p>
                  <p>${cart ? cart.totalPriceWithTax : 0}</p>
                </div>
                <button className="rounded-3xl w-full bg-green-700 px-5 py-2 text-white">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;


