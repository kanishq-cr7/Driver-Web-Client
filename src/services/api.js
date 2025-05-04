import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// attach JWT token if it exists
api.interceptors.request.use((config) => {
  config.headers["ngrok-skip-browser-warning"] = "true";  
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
