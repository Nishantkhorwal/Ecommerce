"use client";
import React, { useState, useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { IoIosSearch } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaCartShopping } from "react-icons/fa6";
import { IoMenuOutline, IoClose } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [menu, setMenu] = useState<boolean>(false);
  const [slider, setSlider] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search State
  const router = useRouter();
  const [cartCount, setCartCount] = useState<number>(0);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to handle search
  const handleSearch = () => {
    if (searchQuery.trim() === "") return;
    
    // Capitalize first letter
    const formattedCategory =
      searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase();

    router.push(`/list?category=${formattedCategory}`);
  };
  useEffect(() => {
      if (session) {
        fetch("/api/cart")
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setCartCount(data.cart.items.length);
            }
          })
          .catch((err) => console.error("Error fetching cart:", err));
      }
    }, [session]);

  return (
    <>
      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 w-full py-4 px-8 z-40 transition-all duration-300 ${
          isScrolled ? "bg-black shadow-md" : "bg-black"
        }`}
      >
        <div className="flex flex-row justify-between items-center">
          {/* Logo Section */}
          <div className="flex flex-row gap-1 text-2xl text-white items-center">
            <TiShoppingCart />
            <p className="font-semibold">Ecom</p>
          </div>

          {/* Desktop Navigation */}
          <div className="lg:block hidden">
            <ul className="flex flex-row text-sm text-white items-center justify-center gap-8">
              <Link href="/"><li className="cursor-pointer">Home</li></Link>
              <Link href="/"><li className="cursor-pointer">About</li></Link>
              <Link href="/"><li className="cursor-pointer">Terms & Condition</li></Link>
            </ul>
          </div>

          {/* Search & Profile Section */}
          <div className="lg:flex flex-row gap-6 hidden">
            <div className="flex flex-row items-center rounded-2xl bg-white px-3 py-1">
              <input
                type="search"
                className="focus:outline-none rounded-l-xl px-1"
                placeholder="Search Category.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Search on Enter
              />
              <IoIosSearch className="cursor-pointer" onClick={handleSearch} />
            </div>
            <div className="lg:flex flex-row items-center text-white text-xl gap-6 hidden">
              <IoMdNotificationsOutline />
              <div className="relative flex flex-col">
                  <CgProfile className="cursor-pointer" onClick={() => setMenu(!menu)} />
                  <div
                    className={`absolute top-6 text-sm shadow-xl border text-black right-0 px-4 py-2 bg-white ${
                      menu ? "block" : "hidden"
                    }`}
                  >
                    {session ? (
                      <>
                        <Link href="/profile"><p className="mb-2">Profile</p></Link>
                        <Link href="/orders"><p className="mb-2">Orders</p></Link>
                        <button onClick={() => signOut()} className="text-red-500">Logout</button>
                      </>
                    ) : (
                      <>
                        <Link href="/register"><p className="mb-2">Register</p></Link>
                        <Link href="/login">Login</Link>
                      </>
                    )}
                  </div>
                </div>
              <div className="relative">
                  <Link href="/cart">
                    <FaCartShopping className="text-xl" />
                  </Link>
                  {cartCount > 0 && (
                    <Link href="/cart">
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                    </Link>
                  )}
                </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="block lg:hidden">
            <IoMenuOutline
              className="cursor-pointer text-white text-2xl"
              onClick={() => setSlider(true)}
            />
          </div>
        </div>
      </div>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 z-50 bg-black text-white shadow-lg transform ${
          slider ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <IoClose className="text-2xl cursor-pointer" onClick={() => setSlider(false)} />
        </div>

        {/* Mobile Navigation Links */}
        <ul className="flex flex-col text-sm text-white items-start px-6 gap-6 mt-6">
          <li className="cursor-pointer">Home</li>
          <li className="cursor-pointer">About</li>
          <li className="cursor-pointer">Categories</li>
          <li className="cursor-pointer">Terms & Condition</li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
