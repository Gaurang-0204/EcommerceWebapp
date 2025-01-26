// import React from 'react';

// const Register = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl">
//         {/* Header Section */}
//         <div className="text-center mb-6">
//           <img
//             src="/demo/images/blocks/logos/hyper.svg"
//             alt="Hyper Logo"
//             className="mb-4 h-12 mx-auto"
//           />
//           <h1 className="text-gray-900 text-3xl font-semibold mb-2">Create an Account</h1>
//           <p className="text-gray-600">
//             Already have an account?
//             <a
//               href="#"
//               className="ml-2 text-blue-500 font-medium hover:underline"
//               aria-label="Sign in to your account"
//             >
//               Sign in here!
//             </a>
//           </p>
//         </div>

//         {/* Form Section */}
//         <form>
//           <div className="grid grid-cols-2 gap-6 mb-4">
//             <div>
//               <label
//                 htmlFor="username"
//                 className="block text-gray-900 font-medium mb-2"
//               >
//                 Username
//               </label>
//               <input
//                 id="username"
//                 type="text"
//                 placeholder="Username"
//                 className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-gray-900 font-medium mb-2"
//               >
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Email address"
//                 className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6 mb-4">
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-gray-900 font-medium mb-2"
//               >
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="Password"
//                 className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="street"
//                 className="block text-gray-900 font-medium mb-2"
//               >
//                 Street
//               </label>
//               <input
//                 id="street"
//                 type="text"
//                 placeholder="Street address"
//                 className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6 mb-4">
//             <div>
//               <label
//                 htmlFor="city"
//                 className="block text-gray-900 font-medium mb-2"
//               >
//                 City
//               </label>
//               <input
//                 id="city"
//                 type="text"
//                 placeholder="City"
//                 className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="state"
//                 className="block text-gray-900 font-medium mb-2"
//               >
//                 State
//               </label>
//               <input
//                 id="state"
//                 type="text"
//                 placeholder="State"
//                 className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//           </div>

//           <div className="mb-6">
//             <label
//               htmlFor="pincode"
//               className="block text-gray-900 font-medium mb-2"
//             >
//               Pincode
//             </label>
//             <input
//               id="pincode"
//               type="text"
//               placeholder="Pincode"
//               className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-600 focus:ring focus:ring-blue-300 flex items-center justify-center"
//             aria-label="Register"
//           >
//             <i className="pi pi-user-plus mr-2"></i>
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const navigate = useNavigate();
  

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", formData);
      setSuccess(response.data.message);
      navigate('/Login');
      setError("");
    } catch (err) {
      setError("Registration failed. Please check the inputs.");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFE1A1]">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl">
        {/* Header Section */}
        <div className="text-center mb-6">
          {/* <img
            src="/demo/images/blocks/logos/hyper.svg"
            alt="Hyper Logo"
            className="mb-4 h-12 mx-auto"
          /> */}
          <h1 className="text-gray-900 text-3xl font-semibold mb-2">Create an Account</h1>
          <p className="text-gray-600">
            Already have an account?
            <a
              href="/Login"
              className="ml-2 text-gray-900 font-medium hover:underline"
              aria-label="Sign in to your account"
            >
              Sign in here!
            </a>
          </p>
        </div>

        {/* Form Section */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="username" className="block text-gray-900 font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="password" className="block text-gray-900 font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="street" className="block text-gray-900 font-medium mb-2">
                Street
              </label>
              <input
                id="street"
                type="text"
                placeholder="Street address"
                value={formData.street}
                onChange={handleChange}
                className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
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
          </div>

          <div className="mb-6">
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

          <button
            type="submit"
            className="w-full  bg-primary text-white font-medium rounded-md px-4 py-2 focus:ring focus:ring-blue-300 flex items-center justify-center"
            aria-label="Register"
          >
            <i className="pi pi-user-plus mr-2"></i>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

