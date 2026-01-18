import axios from "axios";

const API_BASE_URL = "https://api.carsdedo.com/api"; // change this

export const fetchCars = async () => {
  const response = await axios.get(`${API_BASE_URL}/cars/`);
  console.log(response);
  return response.data;
};


