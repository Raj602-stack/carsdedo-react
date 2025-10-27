
import React, { useState, useEffect } from 'react';



const slides = [
  { id: 1, img: process.env.PUBLIC_URL + '/slide1.png', title: 'we make you spend less', subtitle: 'zero down payment options' },
  { id: 2, img: process.env.PUBLIC_URL + '/slide2.png', title: 'trusted used cars', subtitle: 'assured plus certified' },
  { id: 3, img: process.env.PUBLIC_URL + '/slide3.png', title: 'easy finance', subtitle: 'finance options available' },
];

export default function App() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="page">
      {/* Top purple navbar */}
      <header className="topbar">

        <div className="topbar-left">
          <div className="logo">
            <img className='logo-img' src="/carsdedo.jpeg" alt="Company Logo" />

          </div>
          <div className="location">Lucknow ▾</div>
        </div>

        <div className="topbar-center">
          <input className="top-search" placeholder="Search by assured plus cars" />
        </div>
        
        <div className="topbar-right">
        <nav className="top-actions">
  {/* BUY CAR */}
  <div className="dropdown">
    <div className="action">Buy Car ▾</div>
    <div className="dropdown-menu">
      <div className="dropdown-item">Used Cars</div>
      <div className="dropdown-item">Certified Cars</div>
      <div className="dropdown-item">Cars Under ₹5 Lakh</div>
      <div className="dropdown-item">New Arrivals</div>
      <div className="dropdown-item">View All</div>
    </div>
  </div>

  {/* SELL CAR */}
  <div className="dropdown">
    <div className="action">Sell Car ▾</div>
    <div className="dropdown-menu">
      <div className="dropdown-item">Instant Online Quote</div>
      <div className="dropdown-item">Car Inspection Booking</div>
      <div className="dropdown-item">Exchange My Car</div>
      <div className="dropdown-item">Get Best Price</div>
    </div>
  </div>

  {/* SERVICE */}
  <div className="dropdown">
    <div className="action">Service ▾</div>
    <div className="dropdown-menu">
      <div className="dropdown-item">Periodic Maintenance</div>
      <div className="dropdown-item">Car Wash & Detailing</div>
      <div className="dropdown-item">Tyre Replacement</div>
      <div className="dropdown-item">Insurance Renewal</div>
      <div className="dropdown-item">Roadside Assistance</div>
    </div>
  </div>
</nav>

          <div className="call">Call us: <strong>9664573074</strong></div>
        </div>
      </header>



      {/* Secondary filter/nav row (purple ribbon) */}
      <div className="subnav">
  <div className="subnav-inner">

    <div className="dropdown">
      <div className="sub-item">Explore By</div>
    </div>

    <div className="dropdown">
      <div className="sub-item">Price Range ▾</div>
      <div className="dropdown-menu dark">
        <div className="dropdown-item">Under ₹5 Lakh</div>
        <div className="dropdown-item">₹5–10 Lakh</div>
        <div className="dropdown-item">₹10–20 Lakh</div>
        <div className="dropdown-item">₹20 Lakh+</div>
      </div>
    </div>

    <div className="dropdown">
      <div className="sub-item">Make & Model ▾</div>
      <div className="dropdown-menu dark">
        <div className="dropdown-item">Hyundai</div>
        <div className="dropdown-item">Maruti Suzuki</div>
        <div className="dropdown-item">Tata</div>
        <div className="dropdown-item">Mahindra</div>
        <div className="dropdown-item">Toyota</div>
      </div>
    </div>

    <div className="dropdown">
      <div className="sub-item">Year ▾</div>
      <div className="dropdown-menu dark">
        <div className="dropdown-item">2024 - 2025</div>
        <div className="dropdown-item">2020 - 2023</div>
        <div className="dropdown-item">Before 2020</div>
      </div>
    </div>

    <div className="dropdown">
      <div className="sub-item">Fuel ▾</div>
      <div className="dropdown-menu dark">
        <div className="dropdown-item">Petrol</div>
        <div className="dropdown-item">Diesel</div>
        <div className="dropdown-item">CNG</div>
        <div className="dropdown-item">Electric</div>
      </div>
    </div>

    <div className="dropdown">
      <div className="sub-item">KM Driven ▾</div>
      <div className="dropdown-menu dark">
        <div className="dropdown-item">Under 25,000 KM</div>
        <div className="dropdown-item">25K–50K KM</div>
        <div className="dropdown-item">50K–100K KM</div>
        <div className="dropdown-item">1,00,000+ KM</div>
      </div>
    </div>

    <div className="dropdown">
      <div className="sub-item">Body Type ▾</div>
      <div className="dropdown-menu dark">
        <div className="dropdown-item">Hatchback</div>
        <div className="dropdown-item">Sedan</div>
        <div className="dropdown-item">SUV</div>
        <div className="dropdown-item">MUV</div>
      </div>
    </div>

    <div className="dropdown">
      <div className="sub-item">Transmission ▾</div>
      <div className="dropdown-menu dark">
        <div className="dropdown-item">Manual</div>
        <div className="dropdown-item">Automatic</div>
        <div className="dropdown-item">AMT</div>
      </div>
    </div>
  </div>
</div>


      <section className="hero">
        <div className="carousel">
          {slides.map((s, i) => (
            <div key={s.id} className={"slide " + (i === index ? 'active':'')}>
              <img src={s.img} alt={s.title} />
              <div className="hero-text">
                <h1>{s.title}</h1>
                <p>{s.subtitle}</p>
                <button className="primary">Check eligibility</button>
              </div>
            </div>
          ))}
          <button className="arrow left" onClick={() => setIndex(i => (i - 1 + slides.length)%slides.length)}>&lt;</button>
          <button className="arrow right" onClick={() => setIndex(i => (i + 1)%slides.length)}>&gt;</button>
          <div className="dots">
            {slides.map((_,i) => <span key={i} onClick={()=>setIndex(i)} className={i===index?'dot active':'dot'}></span>)}
          </div>
        </div>
      </section>

      <section className="toggle-card">
        <div className="pill">
          <button className="pill-btn active">Buy car</button>
          <button className="pill-btn">Sell car</button>
        </div>
      </section>

      <section className="benefits">
        <h2>Spinny benefits</h2>
        <div className="cards">
          <div className="card"><h3>Assured Quality</h3><p>Certified checks and reports</p></div>
          <div className="card"><h3>Easy Finance</h3><p>Low down payments</p></div>
          <div className="card"><h3>7-day Return</h3><p>Buy with confidence</p></div>
        </div>
      </section>

      <footer className="footer">© Spinny clone demo</footer>
    </div>
  );
}
