// src/services/authService.js
import api from './api';
import { users } from '../mockData';

// Helper function to check if mock data should be used
const isMockDataEnabled = () => {
    return localStorage.getItem('useMockData') === 'true' ||
        process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
        (window.appConfig && window.appConfig.useMockData);
};

const authService = {
    login: async (email, password, location) => {
        console.log("Login attempt with:", { email, password });

        if (isMockDataEnabled()) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (email === 'john@example.com') {
                        const user = { ...users.client_user };
                        localStorage.setItem('token', 'mock-token-client-user');
                        localStorage.setItem('user', JSON.stringify(user));
                        console.log("Mock login successful as client user:", user);
                        resolve(user);
                    } else if (email === 'jane@example.com') {
                        const user = { ...users.client_admin };
                        localStorage.setItem('token', 'mock-token-client-admin');
                        localStorage.setItem('user', JSON.stringify(user));
                        console.log("Mock login successful as client admin:", user);
                        resolve(user);
                    } else if (email === 'robert@example.com') {
                        const user = { ...users.sanepid_user };
                        localStorage.setItem('token', 'mock-token-sanepid-user');
                        localStorage.setItem('user', JSON.stringify(user));
                        console.log("Mock login successful as sanepid user:", user);
                        resolve(user);
                    } else {
                        console.log("Mock login failed: Invalid username");
                        reject('Invalid email or password');
                    }
                }, 500); // Simulate network delay
            });
        }

        try {
            console.log("Making real API login request to:", api.defaults.baseURL);
            const response = await api.post('/auth/login', { email, password, location });
            console.log("Login API response:", response.data);

            const { token, user } = response.data;

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        } catch (error) {
            console.error("Login API error:", error);
            throw error.response?.data?.message || 'Login failed';
        }
    },

    // ... rest of the methods remain the same

    getCurrentUser: async () => {
        const user = localStorage.getItem('user');

        if (!user) {
            return null;
        }

        if (isMockDataEnabled()) {
            return JSON.parse(user);
        }

        // For production, validate the token with the backend
        try {
            const response = await api.get('/auth/validate');
            return response.data;
        } catch (error) {
            // If token validation fails, clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }
    }
};

export default authService;