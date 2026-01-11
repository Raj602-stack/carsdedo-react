export const normalizeCar = (car) => {
    return {
      id: car.id,
      title: car.title,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: Number(car.discount_price || car.price || 0),
      originalPrice: Number(car.price || 0),
      km: car.km,
      fuel: car.fuel,
      transmission: car.transmission,
      body: car.body,
      city: car.city,
      colorKey: car.colorKey,
      tags: car.tags || [],
  
      // ✅ OLD image compatibility
      image:
        car.images?.exterior?.[0]?.image
          ? `http://localhost:8000${car.images.exterior[0].image}`
          : "/placeholder-car.png",
  
      images: {
        exterior:
          car.images?.exterior?.map((i) =>
            `${process.env.REACT_APP_BACKEND_URL}${i.image}`
          ) || [],
        interior:
          car.images?.interior?.map((i) =>
            `${process.env.REACT_APP_BACKEND_URL}${i.image}`
          ) || [],
        engine: [],
        tyres: [],
        overview: [],
      },
  
      // ✅ OLD features array compatibility
      features: Object.values(car.features || {})
        .flat()
        .map((f) => f.name),
  
      owner: car.owner_count === 1 ? "First Owner" : `${car.owner_count} Owners`,
    };
  };

  