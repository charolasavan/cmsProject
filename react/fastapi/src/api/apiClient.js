import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    // You can add other default headers here if needed
});

// Add a request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');  // get JWT token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;  // set Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
