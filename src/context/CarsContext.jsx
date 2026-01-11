import { createContext, useContext, useEffect, useState } from "react";
import { fetchCars } from "../services/carsApi";

const CarsContext = createContext();

export const CarsProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await fetchCars();
      setCars(data);
    } catch (err) {
      setError("Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CarsContext.Provider
      value={{
        cars,
        loading,
        error,
        reloadCars: loadCars,
      }}
    >
      {children}
    </CarsContext.Provider>
  );
};

// Custom hook (BEST PRACTICE)
export const useCars = () => useContext(CarsContext);
