import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5500/api",  // your backend URL
  withCredentials: false,
});

export default api;
