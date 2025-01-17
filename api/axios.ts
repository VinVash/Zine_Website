import axios from "axios";
let db_url = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: db_url,
  headers: {
     "stage": "test"
  }


})

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization =  `Bearer ${token}`;
   
  return config;
});

export const setAuthorizationHeader = (token: string) => {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export default api;


