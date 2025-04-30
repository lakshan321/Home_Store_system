import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import AddProduct from "./pages/AddProduct";
import Product from "./pages/Product";
import AddSupply from "./pages/AddSupply";
import Supply from "./pages/Supply";
import RoleManagement from "./components/DashSupliers";

{/*tempory import*/}

import AddRole from "./components/AddRole"

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products/:productId" element={<Product />} />
          <Route path="/add-supply" element={<AddSupply />} />
          <Route path="/supplys/:supplyId" element={<Supply />} />
          <Route path="/addrole" element={<AddRole/>} />
          <Route path="/dashrole" element={<RoleManagement/>} />
        </Route>
        <Route path="*" element={<h1 className="text-center mt-10 text-3xl">404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
