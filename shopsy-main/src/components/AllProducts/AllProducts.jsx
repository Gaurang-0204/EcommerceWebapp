
// import Navbar from '../Navbar/Navbar'
// import Hero from '../Hero/Hero'
// import AOS from "aos";
// import "aos/dist/aos.css";
// import axios from "axios"
// import React, { useEffect, useState } from "react";
// import { FaStar } from "react-icons/fa6";
// import { FaDollarSign } from "react-icons/fa";
// import { useNavigate } from "react-router-dom"

// const AllProducts = ({ products, BASE_URL }) => {
//     // const [orderPopup, setOrderPopup] = React.useState(false);
    
//     //   const handleOrderPopup = () => {
//     //     setOrderPopup(!orderPopup);
//     //   };
//     //   React.useEffect(() => {
//     //     AOS.init({
//     //       offset: 100,
//     //       duration: 800,
//     //       easing: "ease-in-sine",
//     //       delay: 100,
//     //     });
//     //     AOS.refresh();
//     //   }, []);

//     const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const BASE_URL = "http://127.0.0.1:8000";

//   const navigate = useNavigate();

//   const handleProductClick = (id) => {
//     navigate(`/ProductDetails/${id}`); // Navigates to the product page with the product ID in the URL
//   };

//   useEffect(() => {
//     // Fetch products from the Django API
//     axios
//       .get("http://127.0.0.1:8000/api/products/")
//       .then((response) => {
//         setProducts(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching products:", error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <p>Loading products...</p>;
//   }

//   return (
//     <div>
//         <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
//         <Navbar  />

//         <div className="text-center mb-10 max-w-[600px] mx-auto mt-10">
//         <h1 data-aos="fade-up" className="text-3xl font-bold">
//            Our Products
//           </h1>
//         </div>
//         {/* <Hero handleOrderPopup={handleOrderPopup} /> */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
//       {/* Card Section */}
//       {products.map((data) => (
//         <div
//           key={data.id}
//           data-aos="fade-up"
//           data-aos-delay={data.aosDelay}
//           className="space-y-3 cursor-pointer"
//           onClick={() => handleProductClick(data.id)} // Send product ID on click
//         >
//           <img
//             src={`${BASE_URL}${data.image}`}
//             alt=""
//             className="h-[220px] w-[150px] object-cover rounded-md"
//           />
//           <div>
//             <h3 className="font-semibold">{data.name}</h3>
//             <p className="text-sm text-gray-600">{data.color}</p>
//             <div className="flex items-center gap-1">
//               <FaDollarSign className="text-black-500" />
//               <span>{data.price}</span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//         </div>
//     </div>
//   )
// }

// export default AllProducts

import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { FaDollarSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://127.0.0.1:8000"; // Base URL for API requests

  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/ProductDetails/${id}`); // Navigate to the ProductDetails page
  };

  useEffect(() => {
    // Initialize AOS for animations
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });

    // Fetch products from the API
    axios
      .get(`${BASE_URL}/api/products/`)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar />

      <div className="text-center mb-10 max-w-[600px] mx-auto mt-10">
        <h1 data-aos="fade-up" className="text-3xl font-bold">
          Our Products
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
        {/* Product Cards */}
        {products.map((data) => (
          <div
            key={data.id}
            data-aos="fade-up"
            data-aos-delay={data.aosDelay || 100} // Default AOS delay if not provided
            className="space-y-3 cursor-pointer"
            onClick={() => handleProductClick(data.id)}
          >
            <img
              src={`${BASE_URL}${data.image}`}
              alt={data.name}
              className="h-[220px] w-[150px] object-cover rounded-md"
            />
            <div>
              <h3 className="font-semibold">{data.name}</h3>
              <p className="text-sm text-gray-600">{data.color}</p>
              <div className="flex items-center gap-1">
                <FaDollarSign className="text-black-500" />
                <span>{data.price}</span>
              </div>
            </div>
          </div>
        ))}
        



      </div>
    </div>
  );
};

export default AllProducts;
