
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const ProfilePage = () => {
// //     const [user, setUser] = useState(null);
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);

  

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const userResponse = await axios.get("/api/user/", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
// //         setUser(userResponse.data);
        
// //         const ordersResponse = await axios.get("/api/orders/", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
// //         setOrders(ordersResponse.data);
        
// //         setLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   if (loading) return <p>Loading...</p>;






// //   return (
// //     <div>
// //      <div className="bg-gradient-to-r from-pink-200 to-blue-200">
// //       <div className="container mx-auto py-5 h-screen flex justify-center items-center">
// //         <div className="w-full max-w-4xl"> {/* Increased width */}
// //           <div className="bg-white shadow-md rounded-lg overflow-hidden">
// //             <div className="bg-black h-64 flex items-end p-4 relative"> {/* Increased height */}
// //               <div className="absolute top-10 left-5 flex flex-col items-center"> {/* Centered button */}
// //                 <img
// //                   src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
// //                   alt="Profile"
// //                   className="w-40 h-40 rounded-full border-4 border-white" /* Increased size */
// //                 />
// //                 <button className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-md text-sm shadow-md hover:bg-gray-700 transition"> {/* Improved button styling */}
// //                   Edit Profile
// //                 </button>
// //               </div>
// //               <div className="ml-48 mb-8 text-white"> {/* Adjusted for spacing */}
// //                 <h5 className="text-2xl font-bold">{user?.username}</h5>
// //                 <p className="text-gray-300">{user?.city}</p>
// //               </div>
// //             </div>
// //             <div className="p-6 text-black">
// //               <p className="text-lg font-semibold mb-2">Address</p>
// //               <div className="bg-gray-100 p-4 rounded-md">
// //                 <p className="italic">{user?.street}</p>
// //                 <p className="italic">{user?.city}, {user?.state} - {user?.pincode}</p>
// //                 <p className="italic">INDIA</p>
// //               </div>
// //             </div>
// //             <div className="p-6">
// //               <div className="flex justify-between items-center mb-4">
// //                 <p className="text-lg font-semibold">Past Orders</p>
// //                 <a href="#" className="text-gray-500 text-sm">Show all</a>
// //               </div>
// //               <div className="grid grid-cols-2 gap-4"> {/* Increased gap */}
// //               <div className="text-gray-700">
// //                 {orders.length > 0 ? (
// //                   <ul className="list-disc pl-4">
// //                     {orders.map(order => (
// //                       <li key={order.id} className="py-2 border-b">
// //                         Order #{order.id} - ₹{order.total_price} - {new Date(order.created_at).toLocaleDateString()}
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 ) : (
// //                   <p>No past orders available.</p>
// //                 )}
// //               </div>
               
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //     </div>
// //   )
// // }

// // export default ProfilePage



// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ProfilePage = () => {
// //   const [user, setUser] = useState(null);
// //   const [orders, setOrders] = useState([]); // Ensure orders is an array
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const userResponse = await axios.get("http://127.0.0.1:8000/api/user/", {
// //           headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
// //         });

// //         setUser(userResponse.data);

// //         const ordersResponse = await axios.get("http://127.0.0.1:8000/api/orders/", {
// //           headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
// //         });

// //         // Ensure ordersResponse.data is an array before setting state
// //         setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);

// //         setLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   if (loading) return <p>Loading...</p>;



// // const [user, setUser] = useState(null);
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //         try {
// //           const token = localStorage.getItem("accessToken");
      
// //           if (!token) {
// //             throw new Error("No authentication token found. Please log in.");
// //           }
      
// //           const userResponse = await axios.get("http://127.0.0.1:8000/api/user/", {
// //             headers: { Authorization: `Bearer ${token}` },
// //           });
      
// //           setUser(userResponse.data);
      
     
// //           console.log("Fetching orders from:", "http://127.0.0.1:8000/api/orders/");
      
// //           const ordersResponse = await axios.get("http://127.0.0.1:8000/api/orders/", {
// //             headers: { Authorization: `Bearer ${token}` },
// //           });
      
// //           console.log("Orders response:", ordersResponse.data);
      
// //           setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
// //         } catch (error) {
// //           console.error("Error fetching data:", error.response ? error.response.data : error);
// //         }
// //       };
// //     fetchData();
// //   }, []);

// //   if (loading) return <p>Loading...</p>;
// //   if (error) return <p style={{ color: "red" }}>{error}</p>;


// const [user, setUser] = useState(null);
// const [orders, setOrders] = useState([]);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");

//       if (!token) {
//         throw new Error("No authentication token found. Please log in.");
//       }

//       // Fetching user data
//       const userResponse = await axios.get("http://127.0.0.1:8000/api/user/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setUser(userResponse.data);

//       // Fetching orders data
//       const ordersResponse = await axios.get("http://127.0.0.1:8000/api/orders/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
//     } catch (error) {
//       // Ensure you're extracting a message from the error object
//       const errorMessage = error.response ? error.response.data.detail : error.message;
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, []);

// if (loading) return <p>Loading...</p>;
// if (error) return <p style={{ color: "red" }}>{error}</p>;


//   return (
//     <div>
//       <div className="bg-gradient-to-r from-pink-200 to-blue-200">
//         <div className="container mx-auto py-5 h-screen flex justify-center items-center">
//           <div className="w-full max-w-4xl">
//             <div className="bg-white shadow-md rounded-lg overflow-hidden">
//               <div className="bg-black h-64 flex items-end p-4 relative">
//                 <div className="absolute top-10 left-5 flex flex-col items-center">
//                   <img
//                     src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
//                     alt="Profile"
//                     className="w-40 h-40 rounded-full border-4 border-white"
//                   />
//                   <button className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-md text-sm shadow-md hover:bg-gray-700 transition">
//                     Edit Profile
//                   </button>
//                 </div>
//                 <div className="ml-48 mb-8 text-white">
//                   <h5 className="text-2xl font-bold">{user?.username}</h5>
//                   <p className="text-gray-300">{user?.city}</p>
//                 </div>
//               </div>
//               <div className="p-6 text-black">
//                 <p className="text-lg font-semibold mb-2">Address</p>
//                 <div className="bg-gray-100 p-4 rounded-md">
//                   <p className="italic">{user?.street}</p>
//                   <p className="italic">
//                     {user?.city}, {user?.state} - {user?.pincode}
//                   </p>
//                   <p className="italic">INDIA</p>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <p className="text-lg font-semibold">Past Orders</p>
//                   <a href="#" className="text-gray-500 text-sm">
//                     Show all
//                   </a>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="text-gray-700">
//                     {orders.length > 0 ? (
//                       <ul className="list-disc pl-4">
//                         {orders.map((order) => (
//                           <li key={order.id} className="py-2 border-b">
//                             Order #{order.id} - ₹{order.total_price} -{" "}
//                             {new Date(order.created_at).toLocaleDateString()}
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p>No past orders available.</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ProfilePage = () => {
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//           const token = localStorage.getItem('accessToken');
  
//           if (!token) {
//               console.error("No token found.");
//               return;
//           }
  
//           const response = await axios.get('http://127.0.0.1:8000/api/order/', {
//               headers: {
//                   'Authorization': `Bearer ${token}`,
//                   'Content-Type': 'application/json'
//               }
//           });
  
//           console.log("Response:", response.data);
//           setOrders(response.data);
//       } catch (err) {
//           console.error("Error fetching orders:", err);
//       }
//   };

//       fetchOrders();
//   }, []);
//   return (
//     <div>
//       <div className="bg-gradient-to-r from-pink-200 to-blue-200">
//         <div className="container mx-auto py-5 h-screen flex justify-center items-center">
//           <div className="w-full max-w-4xl">
//             <div className="bg-white shadow-md rounded-lg overflow-hidden">
//               <div className="bg-black h-64 flex items-end p-4 relative">
//                 <div className="absolute top-10 left-5 flex flex-col items-center">
//                   <img
//                     src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
//                     alt="Profile"
//                     className="w-40 h-40 rounded-full border-4 border-white"
//                   />
//                   <button className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-md text-sm shadow-md hover:bg-gray-700 transition">
//                     Edit Profile
//                   </button>
//                 </div>
//                 <div className="ml-48 mb-8 text-white">
//                   <h5 className="text-2xl font-bold"></h5>
//                   <p className="text-gray-300"></p>
//                 </div>
//               </div>
//               <div className="p-6 text-black">
//                 <p className="text-lg font-semibold mb-2">Address</p>
//                 <div className="bg-gray-100 p-4 rounded-md">
//                   <p className="italic"></p>
//                   <p className="italic">
                    
//                   </p>
//                   <p className="italic">INDIA</p>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <p className="text-lg font-semibold">Past Orders</p>
//                   <a href="#" className="text-gray-500 text-sm">
//                     Show all
//                   </a>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                 {cartItems.length === 0 ? (
//             <p>Your cart is empty.</p>
//           ) : (
//             cartItems.map((item) => (
//               <CartItem
//                 key={item.id}
//                 imgSrc={item.image}
//                 title={item.name}
//                 description={`Size: ${item.size}, Color: ${item.color}`}
//                 price={`$${(item.price * item.quantity).toFixed(2)}`}
//                 quantity={item.quantity}
//                 onQuantityChange={(quantity) => updateQuantity(item.id, parseInt(quantity))}
//                 onRemove={() => removeItem(item.id)}
//               />
//             ))
//           )}

// const CartItem = ({ imgSrc, title, description, price, quantity, onQuantityChange, onRemove }) => {
//     const BASE_URL = "http://127.0.0.1:8000";
//   return (
//     <div className="flex items-center border-b pb-4 mb-4">
//       <img src={imgSrc.startsWith("http") ? imgSrc : `${BASE_URL}${imgSrc}`} alt="Product" className="w-20 h-20 rounded-md" />
//       <div className="ml-4 flex-1">
//         <h4 className="font-medium text-lg">{title}</h4>
//         <p className="text-sm text-gray-500">{description}</p>
//       </div>
//       <div className="flex items-center space-x-4">
//         <select
//           className="border rounded-md px-2 py-1"
//           value={quantity}
//           onChange={(e) => onQuantityChange(e.target.value)}
//         >
//           {[...Array(10).keys()].map((i) => (
//             <option key={i + 1} value={i + 1}>
//               {i + 1}
//             </option>
//           ))}
//         </select>
//         <p className="text-lg font-medium">{price}</p>
//         <button className="text-red-500 hover:underline" onClick={onRemove}>
//           Remove
//         </button>
//       </div>
//     </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default ProfilePage;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const ProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
      // Function to fetch user data
      const fetchUserData = () => {
          const token = localStorage.getItem('accessToken');

          if (!token) {
              setError('No token found. Please login.');
              setLoading(false);
              return;
          }

          axios.get('http://127.0.0.1:8000/api/user/', {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              }
          })
          .then(response => {
              setUserData(response.data);
          })
          .catch(error => {
              console.error('Error fetching user data:', error);
              setError('Error fetching user data');
          });
      };

      // Function to fetch orders
      const fetchOrders = async () => {
          const token = localStorage.getItem('accessToken');

          if (!token) {
              console.error("No token found.");
              setLoading(false);
              return;
          }

          try {
              const response = await axios.get('http://127.0.0.1:8000/api/order/', {
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  }
              });

              console.log("Orders Response:", response.data);
              setOrders(response.data);
          } catch (err) {
              console.error("Error fetching orders:", err);
              setError("Failed to fetch orders.");
          }
      };

      // Fetch both user data and orders
      fetchUserData();
      fetchOrders();

      // Set loading to false after both requests are done
      setLoading(false);

  }, []); // Empty dependency array ensures this runs once on component mount

  if (loading) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>{error}</div>;
  }

  if (!userData) {
      return <div>No user data available</div>;
  }

  return (
    // <div>
    //   <div className="bg-gradient-to-r from-pink-200 to-blue-200">
    //     <div className="container mx-auto py-5 h-screen flex justify-center items-center">
    //       <div className="w-full max-w-4xl">
    //         <div className="bg-white shadow-md rounded-lg overflow-hidden">
    //           <div className="bg-black h-64 flex items-end p-4 relative">
    //             <div className="absolute top-10 left-5 flex flex-col items-center">
    //               <img
    //                 src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
    //                 alt="Profile"
    //                 className="w-40 h-40 rounded-full border-4 border-white"
    //               />
    //               <button className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-md text-sm shadow-md hover:bg-gray-700 transition">
    //                 Edit Profile
    //               </button>
    //             </div>
    //             <div className="ml-48 mb-8 text-white">
    //               <h5 className="text-2xl font-bold"></h5>
    //               <p className="text-gray-300"></p>
    //             </div>
    //           </div>
    //           <div className="p-6 text-black">
    //             <p className="text-lg font-semibold mb-2">Address</p>
    //             <div className="bg-gray-100 p-4 rounded-md">
    //               <p className="italic"></p>
    //               <p className="italic">INDIA</p>
    //             </div>
    //           </div>
    //           <div className="p-6">
    //             <div className="flex justify-between items-center mb-4">
    //               <p className="text-lg font-semibold">Past Orders</p>
    //               <a href="#" className="text-gray-500 text-sm">
    //                 Show all
    //               </a>
    //             </div>

    //             <div className="grid grid-cols-2 gap-4">
    //               {orders.length === 0 ? (
    //                 <p>No past orders found.</p>
    //               ) : (
    //                 orders.map((order) => (
    //                   <OrderItem key={order.id} order={order} />
    //                 ))
    //               )}
    //             </div>

    //             {error && <p className="text-red-500">{error}</p>}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="bg-gradient-to-r bg-[#FFE1A1] min-h-screen">
      <Navbar/>
  <div className="container mx-auto py-10 flex justify-center items-start">
    <div className="w-full max-w-4xl">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-black h-48 flex items-center p-4 relative">
          <div className="absolute top-10 left-5 flex flex-col items-center">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <Link to='/EditProfile'>
            <button className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-md text-sm shadow-md hover:bg-gray-700 transition">
              Edit Profile
            </button>
            </Link>
          </div>
          <div className="ml-44 mt-10 text-white">
            <h5 className="text-2xl font-bold">{userData.username}</h5>
            <p className="text-gray-300">{userData.city},{userData.state}</p>
          </div>
        </div>

        {/* Address Section */}
        <div className="p-6 text-black">
          <p className="text-lg font-semibold mb-2">Address</p>

          <div className="bg-gray-100 p-4 rounded-md">
          <p className="italic"> {userData.street}, {userData.city}, {userData.pincode}, {userData.state}</p>
            <p className="italic">INDIA</p>
          </div>
        </div>

        {/* Orders Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">Past Orders</p>
            <a href="#" className="text-gray-500 text-sm hover:underline">
              Show all
            </a>
          </div>

          {/* Adjust Order Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.length === 0 ? (
              <p>No past orders found.</p>
            ) : (
              orders.map((order) => <OrderItem key={order.id} order={order} />)
            )}
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

const OrderItem = ({ order }) => {
  const BASE_URL = "http://127.0.0.1:8000";
  const items = JSON.parse(order.items || "[]");

  // Ensure order.items is an array before mapping
  // const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg mb-2">Order ID: {order.id}</h3>
      <p className="text-gray-500 mb-2">Date: {new Date(order.created_at).toLocaleDateString()}</p>

      <div className="grid grid-cols-1 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex items-center border-b pb-2 mb-2">
              <img
                src={item.image?.startsWith("http") ? item.image : `${BASE_URL}${item.image}`}
                alt="Product"
                className="w-16 h-16 rounded-md"
              />
              <div className="ml-4 flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="text-lg font-medium">${Number(item.price).toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No items found in this order.</p>
        )}
      </div>

      <div className="flex justify-between mt-4">
  <p className="text-lg font-semibold">Total Price:</p>
  <p className="text-lg font-bold">
    ${Number(order.total_price || 0).toFixed(2)}
  </p>
</div>
    </div>
  );
};


export default ProfilePage;
