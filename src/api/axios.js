import axios from "axios";
// const BASE_URL = 'http://localhost:5000';

export default axios.create({
  baseURL: process.env.REACT_APP_IRSA_BACKEND_API,
  headers: { "Content-Type": "application/json" },
});

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_IRSA_BACKEND_API,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});
