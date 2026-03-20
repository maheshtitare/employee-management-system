import API from "./axios";

/**
 * authAPI.js - API calls related to authentication.
 */

// POST /api/auth/login
export const loginAPI = (email, password) => {
  return API.post("/auth/login", { email, password });
};
