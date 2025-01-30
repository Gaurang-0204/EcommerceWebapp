import React, { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { FaDollarSign } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";



const ResultPage = () => {
    const BASE_URL = "http://127.0.0.1:8000";
    const [products, setProducts] = useState([]);
  const location = useLocation();

  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/ProductDetails/${id}`); // Navigate to the ProductDetails page
  };

  // Extract the search query from the URL
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/search/?q=${query}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div>
        <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
            <Navbar/>

            <div className="text-center mb-10 max-w-[600px] mx-auto mt-10">
        <h1 data-aos="fade-up" className="text-3xl font-bold">
          Our Results
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
    </div>
  )
}

export default ResultPage