"use client";
import React, { useState, useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { IoIosSearch } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaCartShopping } from "react-icons/fa6";
import { IoMenuOutline, IoClose } from "react-icons/io5";
import Link from "next/link";

const Navbar = () => {
  const [menu, setMenu] = useState<boolean>(false);
  const [slider, setSlider] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Full-Screen Background Image */}
     
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
                <Link href='/'><li className="cursor-pointer">Home</li></Link>
                <Link href='/about'><li className="cursor-pointer">About</li></Link>
                <Link href='/categories'><li className="cursor-pointer">Categories</li></Link>
                <Link href='/tandc'><li className="cursor-pointer">Terms & Condition</li></Link>
              </ul>
            </div>

            {/* Search & Profile Section */}
            <div className="lg:flex flex-row gap-6 hidden">
              <div className="flex flex-row items-center rounded-2xl bg-white px-3 py-1">
                <input
                  type="search"
                  className="focus:outline-none rounded-l-xl px-1"
                  placeholder="Search.."
                />
                <IoIosSearch />
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
                    <Link href='/register'><p className="mb-2">Register</p></Link>
                    <Link className="cursor-pointer" href='/login'>Login</Link>
                  </div>
                </div>
                <Link href='/cart'><FaCartShopping /></Link>
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