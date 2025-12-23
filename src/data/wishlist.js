// src/data/cars.js
// Small sample dataset. Add more objects or load from API.
const wishlist = [
    {
      id: 1,
      title: "2019 Jaguar XE",
      brand: "Jaguar",
      model: "XE",
      year: 2019,
      price: 2168000,
      km: 63000,
      fuel: "Petrol",
      transmission: "Automatic",
      body: "Sedan",
      city: "Delhi",
      // colorKey matches the palette keys used in Filters.jsx
      colorKey: "black",
      image: process.env.PUBLIC_URL + "/baleno.avif",
      tags: ["Luxury"],
      features: ["ABS", "Parking Sensors"],
    },
    {
      id: 2,
      title: "2022 Mercedes GLC",
      brand: "Mercedes",
      model: "GLC",
      year: 2022,
      price: 4330000,
      km: 28500,
      fuel: "Petrol",
      transmission: "Automatic",
      body: "SUV",
      city: "Gurgaon",
      colorKey: "white",
      image: process.env.PUBLIC_URL + "/innova.avif",
      tags: ["On Hold"],
      features: ["Sunroof", "Leather Seats"],
    },
    {
      id: 3,
      title: "2021 Hyundai i20",
      brand: "Hyundai",
      model: "i20",
      year: 2021,
      price: 804000,
      km: 37000,
      fuel: "Petrol",
      transmission: "Automatic",
      body: "Hatchback",
      city: "Noida",
      colorKey: "blue",
      image: "/cars/hyundai-i20.jpg",
      tags: ["Assured"],
      features: ["Reverse Camera"],
    },
   
   
  ];
  
  export default wishlist;
  