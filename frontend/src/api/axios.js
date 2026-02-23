import axios from "axios";

const api = axios.create({
  baseURL: "/api", // goes through proxy
});

export default api;