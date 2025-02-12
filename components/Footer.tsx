import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedinIn, FaX } from 'react-icons/fa6';
import { TiShoppingCart } from "react-icons/ti";
function Footer() {
  return (
    <div className='bg-gray-800 py-20'>
        <div className='flex flex-col lg:flex-row justify-center gap-10  px-20  '>
            <div className='w-full  lg:w-[20%] text-white'>
                <p className='text-xl font-semibold mb-4'>Shop</p>
                <ul className='flex flex-col justify-start gap-4'>
                    <li>Shoes</li>
                    <li>Tshirts</li>
                    <li>Jeans</li>
                    <li>Accessories</li>
                    <li>Beauty</li>
                    <li>Household</li>

                </ul>
            </div>
            <div className='w-full lg:w-[20%] text-white'>
                <p className='text-xl font-semibold mb-4'>General Categories</p>
                <ul className='flex flex-col justify-start gap-4'>
                    <li>Mens</li>
                    <li>Women</li>
                    <li>Kids</li>
                    <li>Sports</li>
                    <li>Classics</li>

                </ul>
            </div>
            <div className='w-full lg:w-[20%] text-white'>
                <p className='text-xl font-semibold mb-4'>Support</p>
                <ul className='flex flex-col justify-start gap-4'>
                    <li>FAQ&apos;s</li>
                    <li>Helpline</li>
                    <li>Store Locator</li>
                    <li>Terms & Conditions</li>

                </ul>
            </div>
            <div className='w-full lg:w-[20%] text-white'>
                <p className='text-xl font-semibold mb-4'>Contact</p>
                <ul className='flex flex-col justify-start gap-4'>
                    <li>Contact Us</li>
                    <li>Order Status</li>

                </ul>
            </div> 

        </div>
        <div className='flex flex-col gap-10 lg:gap-0 justify-start lg:flex-row lg:justify-between px-20 lg:px-32 py-16'>
            <div className='text-white text-7xl'>
                <TiShoppingCart/>
            </div>
            <div className='flex flex-col text-white'>
               <p className='text-3xl mb-4 font-semibold tracking-wide'> Follow Ecom</p>
               <div className='flex text-base justify-start lg:justify-center flex-row gap-4 items-center'>
                  <FaInstagram/>
                  <FaFacebook/>
                  <FaX/>
                  <FaLinkedinIn/>
               </div>
            </div>
            <div className='text-white'>
                <p className='text-xl mb-4'>Free Newsletter</p>
                <input type='' className='px-4 py-2 rounded-md' placeholder='Subscribe'></input>
            </div>

        </div>
        <div className='flex justify-center gap-3 items-center pt-10'>
            <hr className='w-[30%] lg:w-[40%] border-t-2 border-t-gray-400'></hr>
            <p className='text-sm font-semibold text-gray-400'>Copyright@ Nishu,  2025</p>
            <hr className='w-[30%] lg:w-[40%] border-t-2 border-t-gray-400'></hr>
        </div>
    </div>
  )
}

export default Footer