import axios from "axios";

// Get base URL from environment variable
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    console.error("VITE_API_BASE_URL is not defined in .env file");
  }
  return envUrl;
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});


console.log("Axios API Base URL:", api.defaults.baseURL); //Check if it's localhost

// Set/remove Authorization header on the shared axios instance
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Ensure the token is always attached, even on first requests after reload
api.interceptors.request.use((config) => {
  console.log("Axios Request Interceptor - URL:", config.url);
  console.log("Axios Request Interceptor - Headers:", config.headers);
  const token = localStorage.getItem("token");
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
