import React from "react";
import CarCard from "../components/CarCard";
import "../styles/BuyPage.css";
import wishlist from "../data/wishlist";

export default function Wishlist() {
  if (!wishlist.length) {
    return <div className="empty">No cars in wishlist</div>;
  }

  return (
    <div className="cars-grid">
      {wishlist.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
