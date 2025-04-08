

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams(); // Extract the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const navigate = useNavigate();

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

  const handleAddToCart = () => {
    // Ensure size and color are selected
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // If the user is not logged in, redirect to login
      alert("You must be logged in to add items to the cart.");
      navigate("/login");
      return;
    }



    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
    if (!selectedColor) {
      alert("Please select a color before adding to cart.");
      return;
    }

    // Create cart item object
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      image: product.image,
    };

    // Save to localStorage or send to the backend
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart!");
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#FFE1A1]">
        <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-2xl w-[600px] lg:w-[800px] overflow-hidden">
          {/* Image Section */}
          <div className="w-full lg:w-[50%] flex items-center justify-center relative">
            <img
              src={`${BASE_URL}${product.image}`}
              alt="Product"
              className="w-full h-full object-contain p-10"
            />
          </div>

          {/* Details Section */}
          <div className="p-8 lg:w-[50%]">
            {/* Product Details */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-[#011627]">{product.name}</h2>
              <h3 className="text-xl font-semibold text-[#011627]">${product.price}</h3>
              <p className="text-sm font-medium text-[#011627]">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[#011627]">Size:</h3>
              <div className="flex space-x-4 mt-2">
                {product.available_sizes ? (
                  product.available_sizes.split(",").map((size) => (
                    <label
                      key={size.trim()}
                      className={`flex items-center ${
                        selectedSize === size.trim()
                          ? "border-[#00b4d8]"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="size"
                        className="hidden"
                        value={size.trim()}
                        onChange={() => setSelectedSize(size.trim())}
                      />
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

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[#011627]">Color:</h3>
              <div className="flex space-x-4 mt-2">
                {product.color ? (
                  <label
                    className={`flex items-center ${
                      selectedColor === product.color
                        ? "ring-2 ring-[#00b4d8]"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="color"
                      className="hidden"
                      onChange={() => setSelectedColor(product.color)}
                    />
                    <span
                      className="w-6 h-6 rounded-full cursor-pointer"
                      style={{
                        backgroundColor: product.color.toLowerCase(),
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
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="w-20 mt-2 bg-gray-200 border-none rounded px-3 py-1"
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-primary text-white font-medium rounded-lg shadow-md  transition-all duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
