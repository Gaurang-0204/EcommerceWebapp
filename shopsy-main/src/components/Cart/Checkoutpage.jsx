// import React, { useState } from "react";

// const CheckoutPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     pincode: "",
//     paymentMethod: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Validation and submission logic here
//     setSuccess("Order placed successfully!");
//     setError("");
//   };

//   // Calculate the estimated delivery date (3 days from today)
//   const estimatedDeliveryDate = new Date();
//   estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);
//   const formattedDeliveryDate = estimatedDeliveryDate.toLocaleDateString();

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#FFE1A1]">
//       <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl">
//         {/* Header Section */}
//         <div className="text-center mb-6">
//           <h1 className="text-gray-900 text-3xl font-semibold mb-2">
//             Checkout
//           </h1>
//           <p className="text-gray-600">
//             Please fill in the details to complete your purchase.
//           </p>
//         </div>

//         {/* Error/Success Messages */}
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

//         {/* Form Section */}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-gray-900 font-medium mb-2">
//               Full Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-6 mb-4">
//             <div>
//               <label htmlFor="street" className="block text-gray-900 font-medium mb-2">
//                 Street
//               </label>
//               <input
//                 id="street"
//                 type="text"
//                 placeholder="Street Address"
//                 value={formData.street}
//                 onChange={handleChange}
//                 className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="city" className="block text-gray-900 font-medium mb-2">
//                 City
//               </label>
//               <input
//                 id="city"
//                 type="text"
//                 placeholder="City"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6 mb-4">
//             <div>
//               <label htmlFor="state" className="block text-gray-900 font-medium mb-2">
//                 State
//               </label>
//               <input
//                 id="state"
//                 type="text"
//                 placeholder="State"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="pincode" className="block text-gray-900 font-medium mb-2">
//                 Pincode
//               </label>
//               <input
//                 id="pincode"
//                 type="text"
//                 placeholder="Pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label htmlFor="paymentMethod" className="block text-gray-900 font-medium mb-2">
//               Payment Method
//             </label>
//             <select
//               id="paymentMethod"
//               value={formData.paymentMethod}
//               onChange={handleChange}
//               className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//             >
//               <option value="">Select Payment Method</option>
//               <option value="creditCard">Credit Card</option>
//               <option value="debitCard">Debit Card</option>
//               <option value="netBanking">Net Banking</option>
//               <option value="cod">Cash on Delivery</option>
//             </select>
//           </div>

//           <div className="mb-6">
//             <p className="text-gray-600">
//               Estimated Delivery Date:{" "}
//               <span className="font-medium text-gray-900">
//                 {formattedDeliveryDate}
//               </span>
//             </p>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-primary text-white font-medium rounded-md px-4 py-2 focus:ring focus:ring-blue-300 flex items-center justify-center"
//             aria-label="Place Order"
//           >
//             <i className="pi pi-check-circle mr-2"></i>
//             Place Order
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "",
  });

  const [orderItems, setOrderItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
   const navigate = useNavigate();

  // Fetch user data and order items from localStorage
  useEffect(() => {

    const refreshAccessToken = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("Refresh token not found. Please log in.");
        return null;
      }
    
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: refreshToken,
        });
        const { access } = response.data;
        localStorage.setItem("accessToken", access); // Update the access token
        return access;
      } catch (error) {
        console.error("Failed to refresh access token:", error.response?.data || error.message);
        return null;
      }
    };

    

    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken"); // Retrieve the access token
      if (!token) {
        console.error("Access token not found. Please log in.");
        return;
      }
    
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user-data/", {
          headers: {
            Authorization: `Bearer ${token}`, // Use Bearer token scheme
          },
        });
        console.log("User Data:", response.data);
        setFormData(response.data);
      } catch (error) {
        if (error.response) {
          console.error("Error:", error.response.data);
    
          if (error.response.status === 401 && error.response.data.code === "token_not_valid") {
            console.warn("Access token expired or invalid. Attempting token refresh...");
            const newToken = await refreshAccessToken(); // Refresh the token
            if (newToken) {
              // Retry the request with the new token
              const retryResponse = await axios.get("http://127.0.0.1:8000/api/user-data/", {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              console.log("User Data:", retryResponse.data);
              setFormData(retryResponse.data);
            } else {
              console.error("Unable to refresh token. Please log in again.");
            }
          }
        } else if (error.request) {
          console.error("No response received from the server:", error.request);
        } else {
          console.error("Error in request setup:", error.message);
        }
      }
    };
    
    
    
    

    const fetchOrderItems = () => {
      const storedItems = localStorage.getItem("cart");
      if (storedItems) {
        setOrderItems(JSON.parse(storedItems));
      } else {
        setError("No order items found in localStorage");
      }
    };

    fetchUserData();
    fetchOrderItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (orderItems.length === 0) {
      setError("No items in the order. Please add items before placing an order.");
      return;
    }
  
    const token = localStorage.getItem("accessToken"); // Retrieve the access token
    if (!token) {
      setError("You need to log in to place an order.");
      console.error("Access token not found. Please log in.");
      return;
    }
  
    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
    const orderData = {
      items: JSON.stringify(orderItems),
      total_price: totalPrice,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    };
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/orders/", orderData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the access token
        },
      });
      setSuccess("Order placed successfully!");
      setError("");
      localStorage.removeItem("cart"); // Clear order items from localStorage after successful order
      navigate('/')
    } catch (err) {
      if (err.response) {
        console.error("Error:", err.response.data);
        setError(err.response.data.detail || "Failed to place order");
      } else {
        console.error("Error:", err.message);
        setError("Failed to place order");
      }
      setSuccess("");
    }
  };
  
  


  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);
  const formattedDeliveryDate = estimatedDeliveryDate.toLocaleDateString();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFE1A1]">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl">
        <div className="text-center mb-6">
          <h1 className="text-gray-900 text-3xl font-semibold mb-2">Checkout</h1>
          <p className="text-gray-600">Please fill in the details to complete your purchase.</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-900 font-medium mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="street" className="block text-gray-900 font-medium mb-2">
                Street
              </label>
              <input
                id="street"
                type="text"
                placeholder="Street Address"
                value={formData.street}
                onChange={handleChange}
                className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-gray-900 font-medium mb-2">
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="state" className="block text-gray-900 font-medium mb-2">
                State
              </label>
              <input
                id="state"
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-gray-900 font-medium mb-2">
                Pincode
              </label>
              <input
                id="pincode"
                type="text"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-gray-900 font-medium mb-2">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="creditCard">Credit Card</option>
              <option value="debitCard">Debit Card</option>
              <option value="netBanking">Net Banking</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          <div className="mb-6">
            <p className="text-gray-600">
              Estimated Delivery Date:{" "}
              <span className="font-medium text-gray-900">
                {formattedDeliveryDate}
              </span>
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-medium rounded-md px-4 py-2 focus:ring focus:ring-blue-300 flex items-center justify-center"
            aria-label="Place Order"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
