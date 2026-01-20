import React, { useMemo, useState } from "react";
import "../styles/MobileHome.css";
import MobileCarousel from "./MobileCarousel";
import MobileBuySellPanel from "./MobileBuySellPanel";
import MobileCards from "./MobileCards";
import HowItWorksMob from "./HowItWorksMob";
import FeaturedCars from "./FeaturedCars";
import BodyTypeCarousel from "./BodyTypeCarousel";
import BrandsGridMob from "./BrandsGridMob";
import LuxurySlider from "./LuxurySlider";
import CarsAcrossCity from "./CarsAcrossCity";
import ExploreMoreCards from "./ExploreMoreCards";
import SpinnyBuzzCarousel from "./SpinnyBuzzCarousel";
import SwipableInsights from "./SwipableInsights";
import StoryCarousel from "./StoryCarousel";
import FaqMob from "./FaqMob";
import MobileMoreAbout from "./MobileMoreAbout";
import FooterMobile from "./FooterMobile";
import ScrollToTop from "./ScrollToTop";
import NoticeBar from "./NoticeBar";

/**
 * MobileHome - mobile-specific homepage (cards list + hero + filters)
 * Props:
 *   - cars: array of { id, title, subtitle, price, image, km, fuel, transmission, hub, emi }
 */
export default function MobileHome({ cars = [] }) {
 

  return (
    <>
  <MobileCarousel/>
  <NoticeBar/>
  <MobileBuySellPanel/>
  <MobileCards/>
  <HowItWorksMob/>
  <FeaturedCars/>
  <BodyTypeCarousel/>
  <BrandsGridMob/>
  <LuxurySlider/>
  <CarsAcrossCity/>
  <ExploreMoreCards/>
  <SpinnyBuzzCarousel/>
  <SwipableInsights/>
  <StoryCarousel/>
  <FaqMob/>
  <MobileMoreAbout/>
  <FooterMobile/>
  <ScrollToTop />
  </>
  );
}
