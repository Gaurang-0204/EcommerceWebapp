
// import Img1 from "../../assets/women/women.png";
// import Img2 from "../../assets/women/women2.jpg";
// import Img3 from "../../assets/women/women3.jpg";
// import Img4 from "../../assets/women/women4.jpg";
// import { FaStar } from "react-icons/fa6";
// import axios from "axios"
// import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// // const ProductsData = [
// //   {
// //     id: 1,
// //     img: Img1,
// //     title: "Women Ethnic",
// //     rating: 5.0,
// //     color: "white",
// //     aosDelay: "0",
// //   },
// //   {
// //     id: 2,
// //     img: Img2,
// //     title: "Women western",
// //     rating: 4.5,
// //     color: "Red",
// //     aosDelay: "200",
// //   },
// //   {
// //     id: 3,
// //     img: Img3,
// //     title: "Goggles",
// //     rating: 4.7,
// //     color: "brown",
// //     aosDelay: "400",
// //   },
// //   {
// //     id: 4,
// //     img: Img4,
// //     title: "Printed T-Shirt",
// //     rating: 4.4,
// //     color: "Yellow",
// //     aosDelay: "600",
// //   },
// //   {
// //     id: 5,
// //     img: Img2,
// //     title: "Fashin T-Shirt",
// //     rating: 4.5,
// //     color: "Pink",
// //     aosDelay: "800",
// //   },
// //   {
// //     id: 6,
// //     img: Img2,
// //     title: "Fashin T-Shirt",
// //     rating: 4.5,
// //     color: "Pink",
// //     aosDelay: "800",
// //   },
// // ];

// const Products = () => {
//   // const [products, setProducts] = useState([]);
//   // const [loading, setLoading] = useState(true);
//   // const BASE_URL = "http://127.0.0.1:8000";

//   // useEffect(() => {
//   //   // Fetch products from the Django API
//   //   axios
//   //     .get("http://127.0.0.1:8000/api/products/")
//   //     .then((response) => {
//   //       setProducts(response.data);
//   //       setLoading(false);
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error fetching products:", error);
//   //       setLoading(false);
//   //     });
//   // }, []);

//   // if (loading) {
//   //   return <p>Loading products...</p>;
//   // }

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const BASE_URL = "http://127.0.0.1:8000";

//   useEffect(() => {
//     // Fetch products from the Django API
//     axios
//       .get(`${BASE_URL}/api/products/`)
//       .then((response) => {
//         setProducts(response.data.slice(0, 5)); // Get only the top 5 products
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
//     <div className="mt-14 mb-12">
//       <div className="container">
//         {/* Header section */}
//         <div className="text-center mb-10 max-w-[600px] mx-auto">
//           <p data-aos="fade-up" className="text-sm text-primary">
//             Top Selling Products for you
//           </p>
//           <h1 data-aos="fade-up" className="text-3xl font-bold">
//             Products
//           </h1>
//           <p data-aos="fade-up" className="text-xs text-gray-400">
//             Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit
//             asperiores modi Sit asperiores modi
//           </p>
//         </div>
//         {/* Body section */}
//         <div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
//             {/* card section */}
//             {products.map((data) => (
//               <div
//                 data-aos="fade-up"
//                 data-aos-delay={data.aosDelay}
//                 key={data.id}
//                 className="space-y-3"
//               >
//                 <img
//                   src={`${BASE_URL}${data.image}`}
//                   alt=""
//                   className="h-[220px] w-[150px] object-cover rounded-md"
//                 />
//                 <div>
//                   <h3 className="font-semibold">{data.name}</h3>
//                   <p className="text-sm text-gray-600">{data.color}</p>
//                   <div className="flex items-center gap-1">
//                     <FaStar className="text-yellow-400" />
//                     <span>{data.rating}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/* view all button */}
//           <div className="flex justify-center">
//           <Link to="/Allproducts">
//             <button className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-md">
//               View All Button
//             </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;
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
        setProducts(response.data.slice(0, 5));
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

<div className="flex justify-center mt-10 mb-4">
  <Link to="/Allproducts">
    <button className="text-center cursor-pointer bg-primary text-white py-1 px-5 rounded-md">
      View All Button
    </button>
  </Link>
</div>

      </div>
    </div>
  );
};

export default AllProducts;