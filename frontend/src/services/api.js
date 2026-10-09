import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("akpizzas_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("akpizzas_token")) {
      localStorage.removeItem("akpizzas_token");
      localStorage.removeItem("akpizzas_user");
      window.dispatchEvent(new Event("akpizzas:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export function getApiError(error, fallback) {
  return error.response?.data?.error || fallback;
}

export default api;