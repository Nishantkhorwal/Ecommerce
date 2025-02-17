"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Category {
  category: string;
  image: string;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div id="categories" className="overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex gap-10 w-max">
        {categories.length > 0 ? (
          categories.map((cat, index) => (
            <Link href={`/list?category=${cat.category}`} key={index}>
              <div className="w-[300px] flex-shrink-0">
                <img
                  src={cat.image}
                  className="object-cover w-full h-[400px] rounded-lg"
                  alt={cat.category}
                />
                <p className="mt-6 font-semibold">{cat.category}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>Loading categories...</p>
        )}
      </div>
    </div>
  );
}

export default Categories;

