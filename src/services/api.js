// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Create an axios instance with base URL and common headers
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        // Update baseURL in case it changed via config panel
        const storedApiUrl = localStorage.getItem('apiUrl');
        const configApiUrl = window.appConfig?.apiUrl;
        const defaultApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

        config.baseURL = storedApiUrl || configApiUrl || defaultApiUrl;
        console.log("API request to URL:", config.baseURL + config.url);

        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.error("API Error:", {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });

        // Handle 401 Unauthorized error
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Helper function to clear login data
export const clearLoginData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Login data cleared. Please login again.');
    window.location.href = '/login';
};

export default api;