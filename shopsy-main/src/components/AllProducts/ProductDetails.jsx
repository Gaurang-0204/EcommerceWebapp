import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
const ProductDetails = () => {

    const { id } = useParams(); // Extract the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://127.0.0.1:8000"; // Base URL for the API

  useEffect(() => {
    // Fetch product details by ID
    axios
      .get(`${BASE_URL}/api/detail/${id}/`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    // <div>
    //     <section className="w-full h-screen flex justify-center items-center bg-[#a8dadc]">
    //   <div className="flex w-[90%] max-w-[750px]">
    //     {/* Image Gallery */}
    //     <div className="flex-[0.47] bg-[#011627] shadow-[10px_5px_10px_10px_rgba(0,0,0,0.1)] scale-[1.07] relative">
    //       <img
    //         src="./img/1.png"
    //         alt="Product"
    //         className="w-full pt-[150px]"
    //         id="productImg"
    //       />
    //       <div className="absolute bottom-[40px] right-[20px] flex flex-col gap-[10px]">
    //         <span className="w-[10px] h-[10px] rounded-full bg-[rgba(255,255,255,0.5)] cursor-pointer active:bg-[#00b4d8]"></span>
    //         <span className="w-[10px] h-[10px] rounded-full bg-[rgba(255,255,255,0.5)] cursor-pointer"></span>
    //         <span className="w-[10px] h-[10px] rounded-full bg-[rgba(255,255,255,0.5)] cursor-pointer"></span>
    //       </div>
    //     </div>

    //     {/* Product Details */}
    //     <div className="flex-[0.53] bg-white shadow-[10px_5px_10px_10px_rgba(0,0,0,0.1)] p-[40px_30px_40px_40px]">
    //       {/* Details */}
    //       <div className="mb-[20px]">
    //         <h2 className="text-[25px] font-semibold leading-[35px] capitalize mb-[10px] text-[#011627]">
    //           Edgar Moran Kobhy Chair
    //         </h2>
    //         <h3 className="text-[20px] font-semibold leading-[35px] mb-[10px] text-[#011627]">
    //           $150.00
    //         </h3>
    //         <h4 className="text-[18px] font-bold leading-[25px] uppercase text-[#f72585] mb-[10px]">
    //           35% OFF
    //         </h4>
    //         <p className="text-[15px] font-medium leading-[25px] text-[#011627]">
    //           Lorem ipsum dolor sit amet consectetur adipisicing elit...
    //         </p>
    //       </div>

    //       {/* Sizes */}
    //       <div className="mb-[20px]">
    //         <form className="flex items-center">
    //           <h3 className="w-[70px] mr-[30px] text-[20px] font-medium text-[#011627]">Size:</h3>
    //           {["S", "M", "L", "XL", "XXL"].map((size) => (
    //             <label key={size} className="flex items-center mr-[10px]">
    //               <input type="radio" name="size" className="hidden" />
    //               <span className="text-[18px] font-normal uppercase text-[#011627] cursor-pointer hover:font-semibold hover:text-[#00b4d8]">
    //                 {size}
    //               </span>
    //             </label>
    //           ))}
    //         </form>
    //       </div>

    //       {/* Colors */}
    //       <div className="mb-[20px]">
    //         <form className="flex items-center">
    //           <h3 className="w-[70px] mr-[30px] text-[20px] font-medium text-[#011627]">Color:</h3>
    //           {["#d90429", "#38b000", "#0081a7", "#ffd100"].map((color, index) => (
    //             <label key={index} className="flex items-center mr-[10px]">
    //               <input type="radio" name="color" className="hidden" />
    //               <span
    //                 className={`block w-[15px] h-[15px] rounded-full cursor-pointer`}
    //                 style={{ backgroundColor: color }}
    //               ></span>
    //             </label>
    //           ))}
    //         </form>
    //       </div>

    //       {/* Quantity */}
    //       <div className="mb-[50px]">
    //         <div className="flex items-center">
    //           <h3 className="w-[70px] mr-[30px] text-[20px] font-medium text-[#011627]">
    //             Quantity:
    //           </h3>
    //           <input
    //             type="number"
    //             name="quantity"
    //             defaultValue="1"
    //             className="bg-[#e8e8e8] outline-0 border-0 p-[2px_15px] rounded-[12px] w-[50px]"
    //           />
    //         </div>
    //       </div>

    //       {/* Submit Button */}
    //       <div className="p-[0_30px]">
    //         <button className="w-full p-[10px] bg-[#0077b6] text-white text-[15px] font-medium rounded-[30px] shadow-[0_10px_10px_rgba(85,63,240,0.25)] relative overflow-hidden hover:bg-[#00b4d8] transition-[0.4s_linear]">
    //           Buy Now
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </section>
    // </div>
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-[#FFE1A1]">
       
      <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-2xl w-[600px] lg:w-[800px] overflow-hidden">
        {/* Image Section */}
        <div className=" w-full lg:w-[50%] flex items-center justify-center relative">
          <img
            src={`${BASE_URL}${product.image}`}
            alt="Product"
            className="w-full h-full object-contain p-10"
          />
          {/* Dots Controls */}
          <div className="absolute bottom-5 right-5 flex flex-col space-y-2">
            <span className="w-3 h-3 rounded-full bg-[#00b4d8]"></span>
            <span className="w-3 h-3 rounded-full bg-white opacity-50"></span>
            <span className="w-3 h-3 rounded-full bg-white opacity-50"></span>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 lg:w-[50%]">
          {/* Product Details */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#011627]">{product.name}</h2>
            <h3 className="text-xl font-semibold text-[#011627]">${product.price}</h3>
            
            <p className="text-sm font-medium text-[#011627]">
            {product.description}
            </p>
          </div>

          {/* Sizes */}
          {/* <div className="mb-6">
            <h3 className="text-lg font-medium text-[#011627]">Size:</h3>
            <div className="flex space-x-4 mt-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <label key={size} className="flex items-center">
                  <input type="radio" name="size" className="hidden" />
                  <span className="text-sm font-medium text-[#011627] cursor-pointer px-2 py-1 border rounded hover:border-[#00b4d8]">
                    {size}
                  </span>
                </label>
              ))}
            </div>
          </div> */}
          <div className="mb-6">
  <h3 className="text-lg font-medium text-[#011627]">Size:</h3>
  <div className="flex space-x-4 mt-2">
    {product.available_sizes ? (
      product.available_sizes.split(",").map((size) => (
        <label key={size.trim()} className="flex items-center">
          <input type="radio" name="size" className="hidden" />
          <span className="text-sm font-medium text-[#011627] cursor-pointer px-2 py-1 border rounded hover:border-[#00b4d8]">
            {size.trim()}
          </span>
        </label>
      ))
    ) : (
      <p className="text-sm text-gray-500">Sizes not available</p>
    )}
  </div>
</div>



          {/* Colors */}
          {/* <div className="mb-6">
            <h3 className="text-lg font-medium text-[#011627]">Color:</h3>
            <div className="flex space-x-4 mt-2">
              {["#d90429", "#38b000", "#0081a7", "#ffd100"].map((color) => (
                <label key={color} className="flex items-center">
                  <input type="radio" name="color" className="hidden" />
                  <span
                    className="w-6 h-6 rounded-full cursor-pointer"
                    style={{
                      backgroundColor: color,
                      boxShadow: "0 0 0 4px #fff, 0 0 0 6px #011627",
                    }}
                  ></span>
                </label>
              ))}
            </div>
          </div> */}

<div className="mb-6">
  <h3 className="text-lg font-medium text-[#011627]">Color:</h3>
  <div className="flex space-x-4 mt-2">
    {product.color ? (
      <label className="flex items-center">
        <input type="radio" name="color" className="hidden" />
        <span
          className="w-6 h-6 rounded-full cursor-pointer"
          style={{
            backgroundColor: product.color.toLowerCase(), // Use the single color dynamically
            boxShadow: "0 0 0 4px #fff, 0 0 0 6px #011627",
          }}
        ></span>
      </label>
    ) : (
      <p className="text-sm text-gray-500">Color not available</p>
    )}
  </div>
</div>



          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#011627]">Quantity:</h3>
            <input
              type="number"
              defaultValue="1"
              className="w-20 mt-2 bg-gray-200 border-none rounded px-3 py-1"
            />
          </div>

          {/* Submit Button */}
          <button className="w-full py-3  bg-primary text-white font-medium rounded-lg shadow-md hover:bg-[#00b4d8] transition-all duration-300">
            Buy Now
          </button>
        </div>
      </div>
    </div>

    </div>
  )
}

export default ProductDetails