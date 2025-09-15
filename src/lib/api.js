import axios from "axios";

// Get API base URL from .env
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    console.error("VITE_API_BASE_URL is not defined in .env file");
  }
  return envUrl;
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true, 
});

// Set or remove Authorization header globally
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Always attach token from localStorage before sending a request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired token (401/403) by retrying with a new access token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("/user/refresh")) {
      return Promise.reject(error);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // queue requests until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Ask backend for new access token using refreshToken cookie
        const res = await api.post("/user/refresh", {}, { withCredentials: true });
        const newToken = res.data?.accessToken;

        if (newToken) {
          localStorage.setItem("token", newToken);
          setAuthToken(newToken);
          processQueue(null, newToken);

          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return api(originalRequest);
        } else {
          processQueue(new Error("No accessToken in refresh response"), null);
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
