
import Header from "@/components/Header"
import Products from "@/components/Products";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";
import NewProducts from "@/components/NewProducts";


export default function Home() {
  return (
    <>
      <div>
         <Header bgImage="/images/bgImage2.jpg"/>
         <div className="py-10 px-4 md:px-10 lg:px-20">
           <h1 className="text-4xl font-semibold mb-6">All Products</h1>
           <Products/>
         </div>
         <div className="py-10 p-4">
           <h1 className="text-4xl font-semibold mb-6 px-16">Categories</h1>
           <Categories/>
         </div>
         <div className="py-10 px-4 md:px-10 lg:px-20">
           <h1 className="text-4xl font-semibold mb-6">New Products</h1>
           <NewProducts/>
         </div>
         
            <Footer/>
         
      </div> 
    </>
  );
}
