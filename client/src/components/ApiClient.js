import axios from 'axios';

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
<<<<<<< HEAD
  const token = localStorage.getItem('triviaapptoken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
=======
    const token = localStorage.getItem('triviaapptoken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
>>>>>>> Iryna's_branch
});

export default apiClient;