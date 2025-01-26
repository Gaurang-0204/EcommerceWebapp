// import React from 'react'
// import Navbar from '../Navbar/Navbar';

// const CartPage = () => {
//   return (
//     <div className="bg-[#FFE1A1] min-h-screen">
//     {/* Header */}
//     <Navbar/>

//     {/* Breadcrumb */}
    

//     {/* Main Content */}
//     <div className="container mx-auto mt-8 flex gap-6">
//       {/* Cart Items */}
//       <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border">
//         <h2 className="text-xl font-semibold mb-4">Your shopping cart</h2>
//         {/* Item 1 */}
//         <CartItem
//           imgSrc="https://via.placeholder.com/80"
//           title="Winter jacket for men and lady"
//           description="Yellow, Jeans"
//           price="$1156.00"
//         />
//        <div className="flex items-center border-b pb-4 mb-4">
//     <img src='' alt="Product" className="w-20 h-20 rounded-md" />
//     <div className="ml-4 flex-1">
//       <h4 className="font-medium text-lg">name</h4>
//       <p className="text-sm text-gray-500">description</p>
//     </div>
//     <div className="flex items-center space-x-4">
//       <select className="border rounded-md px-2 py-1">
//         <option>1</option>
//         <option>2</option>
//       </select>
//       <p className="text-lg font-medium">price</p>
//       <button className="text-red-500 hover:underline">Remove</button>
//     </div>
//     </div>
//       </div>

//       {/* Summary */}
//       <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm border">
//         <h4 className="text-xl font-semibold mb-4">Order Summary</h4>
//         <div className="mb-2 flex justify-between">
//           <span>Total price:</span>
//           <span>$329.00</span>
//         </div>
//         <div className="mb-2 flex justify-between">
//           <span>Discount:</span>
//           <span className="text-green-500">- $60.00</span>
//         </div>
//         <div className="mb-2 flex justify-between">
//           <span>TAX:</span>
//           <span>$14.00</span>
//         </div>
//         <div className="mb-6 flex justify-between font-semibold text-lg">
//           <span>Total price:</span>
//           <span>$283.00</span>
//         </div>
//         <button className="w-full bg-primary text-white py-3 rounded-md hover:bg-green-600">
//           MAKE PURCHASE
//         </button>
//         <a href="#" className="block text-center text-bg-primary mt-4 hover:underline">
//           Back to shop
//         </a>
//       </div>
//     </div>
//   </div>
// );
// };

// const CartItem = ({ imgSrc, title, description, price }) => {
// return (
//   <div className="flex items-center border-b pb-4 mb-4">
//     <img src={imgSrc} alt="Product" className="w-20 h-20 rounded-md" />
//     <div className="ml-4 flex-1">
//       <h4 className="font-medium text-lg">{title}</h4>
//       <p className="text-sm text-gray-500">{description}</p>
//     </div>
//     <div className="flex items-center space-x-4">
//       <select className="border rounded-md px-2 py-1">
//         <option>1</option>
//         <option>2</option>
//       </select>
//       <p className="text-lg font-medium">{price}</p>
//       <button className="text-red-500 hover:underline">Remove</button>
//     </div>
//   </div>
//   )
// }

// export default CartPage


import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateQuantity = (id, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const TAX_RATE = 0.05; // 5% tax
  const DISCOUNT = 60; // Fixed discount
  const subtotal = calculateTotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal - DISCOUNT + tax;

  return (
    <div className="bg-[#FFE1A1] min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto mt-8 flex gap-6">
        {/* Cart Items */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Your shopping cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                imgSrc={item.image}
                title={item.name}
                description={`Size: ${item.size}, Color: ${item.color}`}
                price={`$${(item.price * item.quantity).toFixed(2)}`}
                quantity={item.quantity}
                onQuantityChange={(quantity) => updateQuantity(item.id, parseInt(quantity))}
                onRemove={() => removeItem(item.id)}
              />
            ))
          )}
        </div>

        {/* Summary */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-xl font-semibold mb-4">Order Summary</h4>
          <div className="mb-2 flex justify-between">
            <span>Total price:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span>Discount:</span>
            <span className="text-green-500">- ${DISCOUNT.toFixed(2)}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span>TAX:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="mb-6 flex justify-between font-semibold text-lg">
            <span>Total price:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-primary text-white py-3 rounded-md "
            onClick={() => alert("Purchase successful!")}
          >
            MAKE PURCHASE
          </button>
          <a href="/AllProducts" className="block text-center text-bg-primary mt-4 hover:underline">
            Back to shop
          </a>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({ imgSrc, title, description, price, quantity, onQuantityChange, onRemove }) => {
    const BASE_URL = "http://127.0.0.1:8000";
  return (
    <div className="flex items-center border-b pb-4 mb-4">
      <img src={imgSrc.startsWith("http") ? imgSrc : `${BASE_URL}${imgSrc}`} alt="Product" className="w-20 h-20 rounded-md" />
      <div className="ml-4 flex-1">
        <h4 className="font-medium text-lg">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center space-x-4">
        <select
          className="border rounded-md px-2 py-1"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
        >
          {[...Array(10).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <p className="text-lg font-medium">{price}</p>
        <button className="text-red-500 hover:underline" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartPage;
