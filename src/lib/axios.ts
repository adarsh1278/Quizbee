import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, 
});

api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        console.warn('Not logged in.');
       
      }
      return Promise.reject(error);
    }
  );
  
export default api;
