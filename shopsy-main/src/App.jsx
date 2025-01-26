import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import AOS from "aos";
import "aos/dist/aos.css";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";


import Admin from "./components/Admin/Admin";
import AllProducts from "./components/AllProducts/AllProducts";
import ProductDetails from "./components/AllProducts/ProductDetails";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import CartPage from "./components/Cart/CartPage";
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
    <div >
      

      <Router>
        <Routes>
        <Route path="/Admin" element={<Admin/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/AllProducts" element={<AllProducts/>}/>
        <Route path="/ProductDetails/:id" element={<ProductDetails />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Cart" element={<CartPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
