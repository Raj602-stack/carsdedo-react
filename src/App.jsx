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
import CarGallery from "./pages/CarGallery";
import SellPageWeb from "./pages/SellPageWeb";
import LoginWeb from "./pages/LoginWeb";
import Wishlist from "./pages/Wishlist";
import AccountWeb from "./pages/AccountWeb";
import ScrollSections from "./pages/ScrollSections";
import CarBooking from "./pages/CarBooking";
import SpecificationsPage from "./components/SpecificationsPage";
import FeaturesPage from "./components/FeaturesPage";
import CheckoutPage from "./pages/CheckoutPage";
import ScheduleTestDrive from "./components/ScheduleTestDrive";
import ScheduleTestDriveWeb from "./pages/ScheduleTestDriveWeb";
import TestDriveConfirmation from "./components/TestDriveConfirmation";
import CarFilterMobile from "./pages/CarFilterMobile";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import { CarsProvider } from "./context/CarsContext";


export default function App() {
  const isMobile = useIsMobile(900);

  return (
    <AuthProvider>
      <CarsProvider>
      {isMobile ? (
        <Routes>
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<MobileHome />} />
            <Route path="sell" element={<MobileSellPage />} />
           
            <Route path="*" element={<MobileHome />} />
          </Route>
          <Route path="buy" element={<BuyPage />} />
          <Route path="blog" element={<Blog/>} />
          <Route path="blog/:id" element={<BlogDetail/>} />
            <Route path="car/:id" element={<CarDetails />} />
            <Route path="car/:id/gallery" element={<CarGallery />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="account" element={<ProtectedRoute><AccountPage/></ProtectedRoute>} />
            <Route path="/specifications" element={<SpecificationsPage/>} />
            <Route path="/features" element={<FeaturesPage/>} />
            <Route path="/checkout/:id" element={<CheckoutPage/>} />
            <Route path="/test-drive/:carId" element={<ScheduleTestDrive/>}/>
            <Route path="/search" element={<CarFilterMobile/>}/>

            <Route path="/test-drive/confirmation/:carId" element={<TestDriveConfirmation/>}/>

            



        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="buy" element={<BuyPageWeb/>} />
            <Route path="sell" element={<SellPageWeb/>} />
            <Route path="/car/:id" element={<CarDetailsWeb />} />
            <Route path="/car/:id/book" element={<CarBooking />} />
            <Route path="/test-drive/:carId" element={<ScheduleTestDriveWeb/>}/>
            <Route path="/test-drive/confirmation/:carId" element={<TestDriveConfirmation/>}/>

            <Route path="login" element={<LoginWeb/>} />
            <Route path="account" element={<AccountWeb/>} />
            <Route path="/wishlist" element={<Wishlist/>} />
            <Route path="/scroll" element={<ScrollSections/>} />
            <Route path="/blog" element={<Blog/>} />
            <Route path="/blog/:id" element={<BlogDetail/>} />
            

          </Route>
        </Routes>
      )}
      </CarsProvider>
    </AuthProvider>
  );
}
