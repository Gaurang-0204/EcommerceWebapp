import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// React Query
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './config/queryClient.config';

// Components
import Home from "./components/Home/Home";
import Admin from "./components/Admin/Admin";
import AllProducts from "./components/AllProducts/AllProducts";
import ProductDetails from "./components/AllProducts/ProductDetails";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import CartPage from "./components/Cart/CartPage";
import CheckoutPage from "./components/Cart/Checkoutpage";
import ProfilePage from "./components/Profile/ProfilePage";
import EditProfile from "./components/Profile/EditProfile";
import ResultPage from "./components/ResultPage/ResultPage";
import Products from "./components/Products/Products";
// NEW: Import Inventory Provider
import { InventoryProvider } from './contexts/InventoryContext';


const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <InventoryProvider>
      <Router>
        <Routes>
          <Route path="/Admin" element={<Admin />} />
          <Route path="/" element={<Home />} />
          <Route path="/AllProducts" element={<AllProducts />} />
          <Route path="/ProductDetails/:id" element={<ProductDetails />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Cart" element={<CartPage />} />
          <Route path="/Checkout" element={<CheckoutPage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/Result" element={<ResultPage />} />
          <Route path="/Products" element={<Products />} />
        </Routes>
      </Router>

      {/* React Query DevTools - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
      </InventoryProvider>
    </QueryClientProvider>
  );
};

export default App;
