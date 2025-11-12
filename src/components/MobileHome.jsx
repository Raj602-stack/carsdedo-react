import React, { useMemo, useState } from "react";
import "../styles/MobileHome.css";
import MobileCarousel from "./MobileCarousel";
import MobileBuySellPanel from "./MobileBuySellPanel";
import MobileCards from "./MobileCards";
import HowItWorksMob from "./HowItWorksMob";
import FeaturedCars from "./FeaturedCars";

/**
 * MobileHome - mobile-specific homepage (cards list + hero + filters)
 * Props:
 *   - cars: array of { id, title, subtitle, price, image, km, fuel, transmission, hub, emi }
 */
export default function MobileHome({ cars = [] }) {
 

  return (
    <>
  <MobileCarousel/>
  <MobileBuySellPanel/>
  <MobileCards/>
  <HowItWorksMob/>
  <FeaturedCars/>
  
  </>
  );
}
