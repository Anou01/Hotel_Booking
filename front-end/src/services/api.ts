// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // จาก .env (สำหรับ Vite)
  // หรือถ้าใช้ Create React App: baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor สำหรับ error (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // ตัวอย่าง: ถ้า token หมดอายุ ลบ token และนำทางไปหน้า login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // นำทางไปหน้า login
    }
    return Promise.reject(error);
  }
);

export default api;