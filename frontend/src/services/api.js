import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const getAllProducts = () => {
  return axios.get(`${BASE_URL}/products`);
};
