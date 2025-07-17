import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/products`);
    return response.data;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    return [];
  }
};
