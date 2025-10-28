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



      {/* <ToggleCard /> 
      <BenefitsSection/> */}
    </div>
  );
}
