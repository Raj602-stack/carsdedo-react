import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import BuyPage from "./pages/BuyPage";
import CarDetails from "./pages/CarDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import useIsMobile from "./hooks/useIsMobile";
import MobileLayout from "./layouts/MobileLayout";
import MobileHome from "./components/MobileHome";
import MobileSellPage from "./pages/MobileSellPage";
import BuyPageWeb from "./pages/BuyPageWeb";
import CarDetailsWeb from "./pages/CarDetailsWeb";

export default function App() {
  const isMobile = useIsMobile(900);

  return (
    <AuthProvider>
      {isMobile ? (
        <Routes>
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<MobileHome />} />
            <Route path="sell" element={<MobileSellPage />} />
           
            <Route path="*" element={<MobileHome />} />
          </Route>
          <Route path="buy" element={<BuyPage />} />
            <Route path="car/:id" element={<CarDetails />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="account" element={<ProtectedRoute><AccountPage/></ProtectedRoute>} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="buy" element={<BuyPageWeb/>} />
            <Route path="/car/:id" element={<CarDetailsWeb />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="account" element={<ProtectedRoute><AccountPage/></ProtectedRoute>} />
          </Route>
        </Routes>
      )}
    </AuthProvider>
  );
}
