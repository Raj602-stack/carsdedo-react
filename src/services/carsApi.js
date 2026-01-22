import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API_BSE_URL = `${API_BASE_URL}/api`; // change this

export const fetchCars = async () => {
  const response = await axios.get(`${API_BSE_URL}/cars/`);
  console.log(response);
  return response.data;
};


