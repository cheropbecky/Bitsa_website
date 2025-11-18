import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5500/api", // your backend URL
  withCredentials: false,
});

// REQUEST INTERCEPTOR: Attaches the JWT to every outgoing request
api.interceptors.request.use(
  (config) => {
    // 1. Get the token from local storage
    const token = localStorage.getItem("token");

    // 2. If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Continue with the request
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;