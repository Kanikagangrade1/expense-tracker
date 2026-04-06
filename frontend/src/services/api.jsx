import axios from "axios";

const API = axios.create({
  // baseURL: "https://expense-tracker-app-pwzr.onrender.com/api",
  baseURL: "http://localhost:5000/api",
});


// 🔐 attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;