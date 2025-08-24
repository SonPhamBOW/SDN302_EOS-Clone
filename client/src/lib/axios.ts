import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3110/api",
  withCredentials: true,
});
