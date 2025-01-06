import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:3030", // Base URL for all requests
  headers: {
    "Content-Type": "application/json", // Default headers
  },
});

export default axiosInstance;
