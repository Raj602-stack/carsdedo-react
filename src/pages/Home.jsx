// src/pages/Home.jsx
import React, { useState } from "react";
import Carousel from "../components/Carousel";
import ToggleCard from "../components/ToggleCard";
import BenefitsSection from "../components/BenefitsSection";
import SellPanel from "../components/SellPanel";
import HowItWorks from "../components/HowItWorks";
import CarCatalog from "../components/CarCatalogue";
import BodyTypeCatalog from "../components/BodyTypeCatalog";
import BrandsGrid from "../components/BrandsGrid";
import LocationsSlider from "../components/LocationsSlider";
import ExploreMore from "../components/ExploreMore";
import SpinnyBuzz from "../components/SpinnyBuzz";
import InsightsCards from "../components/InsightsCards";
import StoriesSection from "../components/StoriesSection";
import FAQ from "../components/FAQ";
import WhyBuySection from "../components/WhyBuySection";
import ScrollToTop from "../components/ScrollToTop";
import NoticeBar from "../components/NoticeBar";

export default function Home() {
  const [mode, setMode] = useState("buy");

  return (
    <>
      <Carousel />
      <NoticeBar/>

      <section className="mode-section">
        <div className="toggle-wrapper">
          <ToggleCard mode={mode} setMode={setMode} />
        </div>

        <div className={`mode-wrapper ${mode}`}>
          <div className="mode-inner">
            <div className="panel buy-panel">
              <BenefitsSection />
            </div>

            <div className="panel sell-panel">
              <SellPanel />
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <CarCatalog />
      <BodyTypeCatalog />
      <BrandsGrid />
      <LocationsSlider />
      <ExploreMore />
      <SpinnyBuzz />
      <InsightsCards />
      <StoriesSection />
      <FAQ />
      <WhyBuySection />
      <ScrollToTop />
    </>
  );
}
