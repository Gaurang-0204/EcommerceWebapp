// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//     const [username, setusername] = useState("");
// const [password, setPassword] = useState("");
// const [error, setError] = useState("");
// const navigate = useNavigate();

// const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axios.post("http://127.0.0.1:8000/api/login/", {
//         username,
//         password,
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//     // Destructure tokens and role from the response data
//     const { access, refresh } = response.data.tokens;
//     const userRole = response.data.user.role;

//     // Save tokens and user role to local storage
//     localStorage.setItem("accessToken", access);
//     localStorage.setItem("refreshToken", refresh);
//     localStorage.setItem("userRole", userRole);

//     // Navigate to the appropriate page based on the role
//     if (userRole === "admin") {
//       navigate("/admin");
//     } else if (userRole === "user") {
//       navigate("/");
//     } else {
//       setError("Unknown role. Please contact the administrator.");
//     }
//   } catch (err) {
//     setError("Invalid username or password.");
//   }
// };



//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
//         {/* Header Section */}
//         <div className="text-center mb-6">
//           <img
//             src="/demo/images/blocks/logos/hyper.svg"
//             alt="Hyper Logo"
//             className="mb-4 h-12 mx-auto"
//           />
//           <h1 className="text-gray-900 text-3xl font-semibold mb-2">Login</h1>
//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//           <p className="text-gray-600">
//             Don’t have an account?
//             <a
//               href="/Register"
//               className="ml-2 text-blue-500 font-medium hover:underline"
//               aria-label="Create an account"
//             >
//               Create today!
//             </a>
//           </p>
          
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         </div>

//         {/* Form Section */}
//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-gray-900 font-medium mb-2"
//             >
//               User Name
//             </label>
//             <input
//               id="username"
//               type="text"
//               placeholder="Email address"
//               value={username}
//               onChange={(e) => setusername(e.target.value)}
              
//               className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label
//               htmlFor="password"
//               className="block text-gray-900 font-medium mb-2"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>

//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center">
//               <input
//                 id="rememberme"
//                 type="checkbox"
//                 className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <label
//                 htmlFor="rememberme"
//                 className="text-gray-900 ml-2"
//               >
//                 Remember me
//               </label>
//             </div>
//             <a
//               href="#"
//               className="text-blue-500 font-medium hover:underline"
//               aria-label="Forgot your password?"
//             >
//               Forgot your password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-600 focus:ring focus:ring-blue-300 flex items-center justify-center"
//             aria-label="Sign In"
//           >
//             <i className="pi pi-user mr-2"></i>
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access, refresh } = response.data.tokens;
      const userRole = response.data.user.role;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userRole", userRole);

      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "user") {
        navigate("/");
      } else {
        setError("Unknown role. Please contact the administrator.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFE1A1]">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <div className="text-center mb-6">
          {/* <img
            src='../'
            alt="Hyper Logo"
            className="mb-4 h-12 mx-auto"
          /> */}
           
          <h1 className="text-gray-900 text-3xl font-semibold mb-2">Login</h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <p className="text-gray-600">
            Don’t have an account?
            <a
              href="/Register"
              className="ml-2 text-black-500 font-medium hover:underline"
              aria-label="Create an account"
            >
              Create today!
            </a>
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-900 font-medium mb-2"
            >
              User Name
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-900 font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="rememberme"
                type="checkbox"
                className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="rememberme" className="text-gray-900 ml-2">
                Remember me
              </label>
            </div>
            <a
              href="/forgot-password"
              className=" font-medium hover:underline"
              aria-label="Forgot your password?"
            >
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-medium rounded-md px-4 py-2  focus:ring focus:ring-blue-300 flex items-center justify-center"
            aria-label="Sign In"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
