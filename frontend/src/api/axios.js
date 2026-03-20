import axios from "axios";

/**
 * axios.js - Configured Axios instance.
 *
 * Why create a custom instance?
 * - Set base URL once (no need to repeat "http://localhost:8080" everywhere)
 * - Auto-attach JWT token to every request using interceptors
 */
const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

/**
 * Request interceptor - runs BEFORE every API call.
 * Reads JWT from localStorage and adds it to Authorization header.
 * Backend JwtAuthFilter reads this header to authenticate the user.
 */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
