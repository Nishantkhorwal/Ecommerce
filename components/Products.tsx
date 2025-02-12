"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  rating: number;
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center text-lg">Loading products...</p>;
  }

  return (
    <div className="flex flex-wrap gap-8 justify-start">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="perspective cursor-pointer w-full lg:w-[30%]">
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
                  <p>{product.description.substring(0, 60)}...</p>
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
        ))
      ) : (
        <p className="text-center w-full text-lg">No products available.</p>
      )}
    </div>
  );
}

export default Products;


