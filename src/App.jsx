// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

/* Desktop pages/layout (existing) */
import Layout from "./pages/Layout";
import Home from "./pages/Home";

/* Mobile layout & page (you should add these files) */
import useIsMobile from "./hooks/useIsMobile";
import MobileLayout from "./layouts/MobileLayout";
import MobileHome from "./components/MobileHome";
import MobileCarousel from "./components/MobileCarousel";
import MobileSellPage from "./pages/MobileSellPage";
import BuyPage from "./pages/BuyPage";

/**
 * App - chooses between mobile shell and desktop routes.
 *
 * Strategy:
 * - If viewport <= breakpoint (useIsMobile), render a single mobile layout (no react-router routes inside).
 * - Otherwise render your normal <Routes> with Layout wrapper.
 *
 * This keeps desktop routing untouched while giving a dedicated mobile shell.
 */
export default function App() {
  const isMobile = useIsMobile(900); // change breakpoint as needed

  // if (isMobile) {
  //   return (
  //     <MobileLayout>
  //       <MobileHome />
  //       {/* <MobileCarousel/> */}
  //     </MobileLayout>
      
  //   );
  // }

  //----------------------------------------------------------------------------------------------

  if (isMobile) {
    return (
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<MobileHome />} />
          <Route path="sell" element={<MobileSellPage/>} /> 
          {/* <Route path="buy" element={<BuyPage/>}/>  */}

          {/* Add other mobile routes later */}
          <Route path="*" element={<MobileHome />} />
        </Route>


        <Route path="/buy" element={<BuyPage />}>
        {/* nested routes inside special layout if needed */}
       
      </Route>
      </Routes>
    );
  }




  //----------------------------------------------------------------------------------------------




  // Desktop: Keep existing routes/layout.
  return (
    <Routes>
      {/* public layout wraps these pages (Topbar/Subnav/Footer inside Layout) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* Add other desktop routes here */}
      </Route>
    </Routes>
  );
}
