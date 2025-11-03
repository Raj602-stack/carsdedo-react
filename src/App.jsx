import React, { useState } from "react";
import Topbar from "./components/Topbar";
import Subnav from "./components/Subnav";
import Carousel from "./components/Carousel";
import ToggleCard from "./components/ToggleCard";
import Benefits from "./components/Benefits";
import Footer from "./components/Footer";
import "./styles/App.css"; 
import BenefitsSection from "./components/BenefitsSection";
import SellPanel from "./components/SellPanel";
import HowItWorks from "./components/HowItWorks";
import CarCatalog from "./components/CarCatalogue";
import BodyTypeCatalog from "./components/BodyTypeCatalog";
import BrandsGrid from "./components/BrandsGrid";
import LocationsSlider from "./components/LocationsSlider";
import ExploreMore from "./components/ExploreMore";
import SpinnyBuzz from "./components/SpinnyBuzz";
import InsightsCards from "./components/InsightsCards";
import StoriesSection from "./components/StoriesSection";
import FAQ from "./components/FAQ";
import WhyBuySection from "./components/WhyBuySection";


export default function App() {
  const [mode, setMode] = useState("buy");
  return (
    <div className="page">
      <Topbar />
      <Subnav />
      <Carousel />
      {/* <ToggleCard /> */}
      {/* <Benefits />
      <Footer /> */}


{/* <ToggleCard mode={mode} setMode={setMode} />

<div className={`mode-wrapper ${mode}`}>
  <div className="mode-inner">
    <div className="panel buy-panel">
      <BenefitsSection />
    
    </div>
    <div className="panel sell-panel">
    <SellPanel/>
    </div>
  </div>
</div> */}

<section className="mode-section">
  
<div className="toggle-wrapper"><ToggleCard mode={mode} setMode={setMode} /></div>
  <div className={`mode-wrapper ${mode}`}>
 
    <div className="mode-inner">
   
      <div className="panel buy-panel"><BenefitsSection /></div>
      <div className="panel sell-panel"><SellPanel /></div>
    </div>
  </div>
</section>

<HowItWorks/>
<CarCatalog/>
<BodyTypeCatalog/>
<BrandsGrid/>

<LocationsSlider/>
<ExploreMore/>

<SpinnyBuzz/>
<InsightsCards/>
<StoriesSection/>
<FAQ/>
<WhyBuySection/>
<Footer/>



      {/* <ToggleCard /> 
      <BenefitsSection/> */}
    </div>
  );
}
