import Image from "next/image";
import Header from "@/components/Header"
import Products from "@/components/Products";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <>
      <div>
         <Header bgImage="/images/bgImage2.jpg"/>
         <div className="py-10 px-20">
           <h1 className="text-4xl font-semibold mb-6">All Products</h1>
           <Products/>
         </div>
         <div className="py-10 p-4">
           <h1 className="text-4xl font-semibold mb-6 px-16">Categories</h1>
           <Categories/>
         </div>
         <div className="py-10 px-20">
           <h1 className="text-4xl font-semibold mb-6">New Products</h1>
           <Products/>
         </div>
         
            <Footer/>
         
      </div> 
    </>
  );
}
