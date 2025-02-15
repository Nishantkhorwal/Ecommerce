"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";
import React, { useEffect, useState } from "react";
import RazorpayScriptLoader from "@/components/RazorpayScriptLoader";
import { useSession } from "next-auth/react";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[]; // Optional to avoid undefined errors
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
  items?: CartItem[];
  taxRate: number;
  totalPrice: number;
  taxAmount: number;
  totalPriceWithTax: number;
}

function Page() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loadingCart, setLoadingCart] = useState<boolean>(true);
  const [cartError, setCartError] = useState<string | null>(null);
  const { data: session } = useSession();

  const [address, setAddress] = useState<string>("");
  const [addressType, setAddressType] = useState<string>("Home");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        console.log("Cart Data:", data.cart); // Debugging log
  
        if (data.success && data.cart) {
          let totalPrice = data.cart.totalPrice || 0;
          let taxAmount = data.cart.taxAmount || 0;
          
          // Calculate totalPrice if it's missing
          if (!totalPrice) {
            totalPrice =
              data.cart.items?.reduce(
                (acc: number, item: CartItem) => acc + item.product.price * item.quantity,
                0
              ) || 0;
          }
  
          // Ensure taxAmount is valid
          if (!taxAmount) {
            taxAmount = (totalPrice * (data.cart.taxRate || 0)) / 100;
          }
  
          // Ensure totalPriceWithTax is valid
          const totalPriceWithTax = totalPrice + taxAmount;
  
          setCart({
            ...data.cart,
            totalPrice,
            taxAmount,
            totalPriceWithTax,
          });
        } else {
          setCartError("Failed to fetch cart.");
        }
      } catch (err) {
        console.log(err);
        setCartError("Error fetching cart.");
      } finally {
        setLoadingCart(false);
      }
    };
  
    fetchCart();
  }, []);
  

  const handlePayment = async () => {
    if (!cart?.totalPriceWithTax || cart.totalPriceWithTax <= 0) {
      alert("Cart is empty or total amount is invalid");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your address before checkout.");
      return;
    }

    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalAmount: cart.totalPriceWithTax }),
    });

    const data = await res.json();
    if (!data.order) {
      alert("Failed to create order");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "My eCommerce",
      description: "Payment for your order",
      order_id: data.order.id,
      handler: async function (response: any) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);

        await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: response.razorpay_payment_id,
            address,
            addressType,
          }),
        });

        await fetch("/api/cart", { method: "DELETE" });
        setCart(null);
      },
      prefill: {
        name: session?.user?.name || "Guest",
        email: session?.user?.email || "guest@example.com",
        contact: "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div>
      <RazorpayScriptLoader />
      <Navbar />
      <div className="px-6 lg:px-32 py-20 min-h-screen flex flex-col pb-20">
        <h1 className={`${poppins.className} font-semibold text-4xl mb-10`}>
          Your Basket
        </h1>
        <div className="flex flex-1 flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[70%] overflow-y-auto">
            {loadingCart ? (
              <p className="text-center">Loading cart...</p>
            ) : cartError ? (
              <p className="text-center text-red-500">{cartError}</p>
            ) : cart?.items?.length ? (
              cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-row gap-6 border mb-7 py-6 justify-center items-center px-4 shadow-xl rounded-md"
                >
                  <div className="w-[40%]">
                    <img
                      src={item.product.images?.[0] || "/images/p1.jpg"}
                      alt={item.product.name}
                      className="w-full object-cover h-[200px]"
                      onError={(e) => (e.currentTarget.src = "/images/p1.jpg")}
                    />
                  </div>
                  <div className="w-[60%] flex flex-col justify-between">
                    <p className={`font-bold ${poppins.className} text-xl mb-5`}>
                      {item.product.name}
                    </p>
                    <div className="flex flex-row justify-between items-center">
                      <p className={`font-semibold ${poppins.className} text-xl`}>
                        Subtotal
                      </p>
                      <p className={`font-semibold ${poppins.className} text-xl`}>
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

          <div className="w-full lg:w-[30%]">
            <div className="sticky top-20 shadow-xl border rounded-md py-8 px-8">
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Delivery Address</label>
                <textarea
                  className="w-full border rounded-md p-2"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-semibold">Address Type</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-row justify-between text-sm">
                <p>Subtotal</p>
                <p>${cart?.totalPrice || 0}</p>
              </div>
              <div className="flex font-semibold flex-row justify-between text-xl mb-4">
                <p>Total</p>
                <p>${cart?.totalPriceWithTax || 0}</p>
              </div>

              <button onClick={handlePayment} className="rounded-3xl w-full bg-green-700 px-5 py-2 text-white">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;







