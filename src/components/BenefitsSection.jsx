import React from "react";
import { Play, ShieldCheck, Wrench, IndianRupee, RotateCcw } from "lucide-react"; // modern icons
import "../styles/BenefitSection.css"

export default function BenefitsSection() {
  const benefits = [
    {
      id: 1,
      title: "200-Points Inspection",
      desc: "Every car is carefully handpicked after a thorough quality inspection.",
      img: process.env.PUBLIC_URL + "/inspection.png", // replace with your image path
      icon: <Wrench size={28} className="text-purple-700 bg-white/90 rounded-full p-1" />,
    },
    {
      id: 2,
      title: "Warranty Included",
      desc: "Our way of being there for you through your car ownership journey.",
      img: process.env.PUBLIC_URL + "/warranty.png", 
      icon: <ShieldCheck size={28} className="text-purple-700 bg-white/90 rounded-full p-1" />,
    },
    {
      id: 3,
      title: "5-Day Money Back",
      desc: "All our cars come with a no-questions-asked 5-day money back guarantee.",
      img: process.env.PUBLIC_URL + "/moneyback.png",
      icon: <RotateCcw size={28} className="text-purple-700 bg-white/90 rounded-full p-1" />,
    },
    {
      id: 4,
      title: "Fixed Price Assurance",
      desc: "No more endless negotiations or haggling. Get the best deal upfront and right away.",
      img:process.env.PUBLIC_URL + "/fixedprice.png",
      icon: <IndianRupee size={28} className="text-purple-700 bg-white/90 rounded-full p-1" />,
    },
  ];

  return (
    <section className="benefits-section">
    

      <div className="benefits-container">
        <h2 className="benefits-title">CarsDedo.com benefits</h2>

        <div className="benefit-cards">
          {benefits.map((b) => (
            <div className="benefit-card" key={b.id}>
              <div className="benefit-image">
                <img src={b.img} alt={b.title} />
                <div className="benefit-icon">{b.icon}</div>
              </div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="benefit-footer">
          <button className="watch-film">
            <Play size={18} fill="#e93b68" /> Watch the film
          </button>
          <button className="browse-cars">Browse cars</button>
          <button className="learn-more">Learn more →</button>
        </div>
      </div>
    </section>
  );
}
