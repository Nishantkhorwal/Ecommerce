"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
  category: string;
}

function CategoryProducts() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? ""; // Get category from URL
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products"); // Fetch all products
        const data = await res.json();
        if (data.success) {
          // Ensure case-insensitive comparison and remove extra spaces
          const formattedCategory = category.trim().toLowerCase();
          const filteredProducts = data.products.filter(
            (product: Product) => product.category.trim().toLowerCase() === formattedCategory
          );
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchProducts();
  }, [category]);

  return (
    <div>
      <Header bgImage="/images/bgImage5.jpg" />
      <div className="px-20 py-20">
        <h1 className="font-semibold text-3xl mb-10">{category} Products</h1>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          <div className="flex flex-wrap gap-8 justify-start">
            {products.map((product) => (
              <div key={product._id} className="perspective w-full lg:w-[30%]">
                <div className="card">
                  {/* Front Side */}
                  <div className="card-front p-6">
                    <img
                      src={product.images[0]}
                      className="object-cover h-[200px] w-full rounded-lg"
                      alt={product.name}
                    />
                    <div className="flex flex-row items-center font-semibold px-4 justify-between pt-4">
                      <p className="text-lg">{product.name}</p>
                      <p className="text-lg font-bold">${product.price}</p>
                    </div>
                    <div className="text-sm pt-2 px-4 text-justify">
                      <p>⭐ {product.rating}/5</p>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="card-back p-6">
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <p className="text-xl font-bold text-yellow-400">⭐ {product.rating}/5</p>
                      <p className="text-sm text-gray-300">Customer Favorite!</p>
                      <Link href={`/product/${product._id}`}>
                        <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-full shadow-md transition-transform transform hover:scale-105">
                          View Product
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CategoryProducts;
