import axios from 'axios';
import { BACKEND_APP_URL, IMG_PATH } from '../config'; 

// const jwtAuthAxios = axios.create({
//   headers: {
//     "Content-Type": "application/json",
//   },
//   baseURL: BACKEND_APP_URL,
// });

const jwtAuthAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: 'https://masterapi.greenlabjewels.com',
});



jwtAuthAxios.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

jwtAuthAxios.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response && error.response.status === 401) {
          setAuthToken(null, false); // Clear token
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = '/login'; // Redirect to login on unauthorized access
      }
      return Promise.reject(error);
  }
);


// Function to set or clear the auth token
export const setAuthToken = (data, isRememberMe) => {
  if (data) {
    jwtAuthAxios.defaults.headers.common["Authorization"] = "Bearer " + data.token;

    if (isRememberMe) {
      localStorage.setItem("token", data.token); // Store in localStorage for long-term
    } else {
      sessionStorage.setItem("token", data.token); // Store in sessionStorage for session-only
    }

    localStorage.setItem("user", JSON.stringify(data));
  } else {
    delete jwtAuthAxios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    sessionStorage.removeItem("token"); // Clear session storage as well
    localStorage.removeItem("user");
  }
};

export default jwtAuthAxios;