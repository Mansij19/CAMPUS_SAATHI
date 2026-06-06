import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: false
});

const normalizeApiBaseUrl = (url) => {
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("campussathi_token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.defaults.baseURL = normalizeApiBaseUrl(api.defaults.baseURL);

export default api;
