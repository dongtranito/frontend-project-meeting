import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // backend port
  withCredentials: true,
});

export default api;
