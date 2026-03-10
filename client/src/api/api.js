import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});


// Global Error Handler for 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== "/signin" && window.location.pathname !== "/signup") {
        toast.error("Session expired. Please login again.");
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default api;