import axios from "axios";

// Axios instance with deployed backend base URL including /api
const api = axios.create({
  baseURL: "https://bitsa-backend-vrx7.onrender.com/api",
  withCredentials: false, // set to true if your backend uses cookies
});

// Interceptor to attach JWT tokens automatically
api.interceptors.request.use(
  (config) => {
    // Determine if the request is admin-protected
    const isAdminRoute =
      config.url?.includes("/admin") ||
      config.url?.startsWith("/events") ||
      config.url?.startsWith("/gallery") ||
      config.url?.startsWith("/blogs");

    // Get tokens from localStorage
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("token");

    if (isAdminRoute && adminToken) {
      // Attach admin token for admin routes
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      // Attach user token for general authenticated routes
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data.message || error.message);
    } else {
      console.error("API Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
