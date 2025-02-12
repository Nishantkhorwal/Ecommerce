"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>(""); // State for the main image
  const [selectedColor, setSelectedColor] = useState<string>(""); // State for selected color
  const [message, setMessage] = useState<string>(""); // Message for user feedback

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();

        if (data.success) {
          setProduct(data.product);
          setMainImage(data.product.images[0]); // Set first image as default
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]); // Set first color as default
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handler for adding the product to the cart
  const handleAddToCart = async () => {
    if (!selectedColor) {
      setMessage("Please choose a color.");
      return;
    }
    try {
      const payload = {
        productId: product?._id,
        color: selectedColor,
        quantity,
      };

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Product added to cart!");
      } else {
        setMessage("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setTimeout(() => {
        setMessage("");
        setSelectedColor('');
        setQuantity(1);
      }, 3000);
    }
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-20">{error}</p>;
  if (!product) return null;

  return (
    <>
      <div>
        <Navbar />
        <div className="px-10 py-24 h-screen">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Column: Product Images */}
            <div className="w-full lg:w-[50%] sticky top-0">
              <div className="mb-6">
                <img
                  src={mainImage}
                  className="object-cover w-full h-[400px] rounded-md"
                  alt={product.name}
                />
              </div>
              <div className="flex flex-row items-center gap-6">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className="rounded-md cursor-pointer border-2 border-transparent hover:border-gray-400"
                    onClick={() => setMainImage(img)}
                  >
                    <img
                      src={img}
                      className={`rounded-md w-24 h-24 object-cover ${
                        mainImage === img ? "border-2 border-red-500" : ""
                      }`}
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Product Details */}
            <div className="w-full lg:w-[50%] px-8 overflow-y-auto scrollbar-hide">
              <h1
                className={`text-5xl font-semibold text-center w-full mb-6 ${poppins.className}`}
              >
                {product.name}
              </h1>
              <p className="text-justify text-gray-800 text-sm">
                {product.description}
              </p>

              <div className="h-[1px] w-full bg-gray-300 my-5"></div>

              <div className="flex flex-row gap-4 items-center">
                <p className="text-gray-900 font-semibold text-3xl">
                  ${product.price}
                </p>
              </div>

              <div className="h-[1px] w-full bg-gray-300 my-5"></div>

              {message && (
                  <p className="mb-4 text-center text-sm text-green-600">
                    {message}
                  </p>
                )}

              {/* Choose Color, Quantity, and Add to Cart */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Choose color</h2>
                <div className="flex items-center gap-4 mb-6">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer ${
                        selectedColor === color ? "border-2 border-red-500" : ""
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></div>
                  ))}
                </div>

                <div className="flex mb-6">
                  <div className="flex items-center gap-4 px-2 py-1 bg-gray-200 rounded-3xl">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-xl"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="text-lg">{quantity}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-xl"
                      onClick={() =>
                        setQuantity(
                          quantity < product.stock ? quantity + 1 : quantity
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-red-500/60 hover:bg-red-700 text-white py-2 px-6 rounded-3xl text-lg font-semibold"
                >
                  Add to Cart
                </button>
                
              </div>

              <div className="flex flex-col gap-3 mt-10">
                <p className="font-bold text-xl">Ratings</p>
                <p>⭐ {product.rating}</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ProductPage;



