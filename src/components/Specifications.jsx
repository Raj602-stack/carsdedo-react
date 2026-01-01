import React, { useState, forwardRef } from "react";
import "../styles/Specifications.css";
import { useNavigate } from "react-router-dom";

const Specifications = forwardRef(function Specifications(props, ref) {
  const navigate = useNavigate();
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  const mainSpecs = [
    { label: "Mileage (ARAI)", value: "18.9 kmpl", checked: false },
    { label: "Ground clearance", value: "165 mm", checked: true },
    { label: "Boot space", value: "256 litres", checked: false },
    { label: "Displacement", value: "1197 cc", checked: false }
  ];

  const allSpecifications = {
    dimensions: [
      { label: "Ground clearance", value: "165 mm" },
      { label: "Boot space", value: "256 litres" },
      { label: "Number of seating rows", value: "2 units" },
      { label: "Wheelbase", value: "2425 mm" },
      { label: "Length", value: "3765 mm" },
      { label: "Front tyre size", value: "165 / 65 R14" },
      { label: "Rear tyre size", value: "165 / 65 R14" },
      { label: "Number of doors", value: "5 units" },
      { label: "Height", value: "1520 mm" }
    ],
    engine: [
      { label: "Displacement", value: "1197 cc" },
      { label: "Max power", value: "87 bhp @ 6000 rpm" },
      { label: "Max torque", value: "113 Nm @ 4200 rpm" },
      { label: "Cylinders", value: "3" },
      { label: "Transmission", value: "Manual, 5 Speed" },
      { label: "Fuel type", value: "Petrol" }
    ],
    fuel: [
      { label: "Mileage (ARAI)", value: "18.9 kmpl" },
      { label: "City mileage", value: "16.5 kmpl" },
      { label: "Highway mileage", value: "21.3 kmpl" },
      { label: "Fuel tank capacity", value: "35 litres" }
    ],
    suspension: [
      { label: "Front suspension", value: "McPherson Strut" },
      { label: "Rear suspension", value: "Torsion Beam" },
      { label: "Steering type", value: "Electric Power Steering" },
      { label: "Front brakes", value: "Disc" },
      { label: "Rear brakes", value: "Drum" }
    ]
  };

  const categories = [
    { id: "dimensions", label: "Dimensions & capacity" },
    { id: "engine", label: "Engine & transmission" },
    { id: "fuel", label: "Fuel & performance" },
    { id: "suspension", label: "Suspension, steering & brakes" }
  ];

  return (
    <>
      {/* Main Compact View */}
      <div className="specifications-container" ref={ref}>
        <div className="compact-specs">
          <h2 className="specs-title">Specifications</h2>

          <div className="specs-grid">
            {mainSpecs.map((spec, index) => (
              <div key={index} className="spec-item">
                <div className="spec-checkbox"></div>
                <div className="spec-content">
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="specs-divider"></div>

          <button
            className="view-all-btn"
            // onClick={() => {
            //   if (ref?.current) {
            //     sessionStorage.setItem(
            //       "specifications_scroll",
            //       ref.current.scrollTop
            //     );
            //   }
            //   navigate("/specifications");
            // }}

            onClick={() => { const el = document.querySelector("main.cd-main"); if (el) { sessionStorage.setItem("cd_main_scroll", el.scrollTop); } navigate("/specifications"); }}
          >
            View all specifications
            <span className="btn-icon">→</span>
          </button>
        </div>
      </div>
    </>
  );
});

export default Specifications;
