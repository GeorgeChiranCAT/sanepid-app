// src/services/locationsService.js
import api from './api';
import { locations } from '../mockData';

// Helper function to check if mock data should be used
const isMockDataEnabled = () => {
    return localStorage.getItem('useMockData') === 'true' ||
        process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
        (window.appConfig && window.appConfig.useMockData);
};

const locationsService = {
    // Get all locations accessible to the current user
    getLocations: async () => {
        if (isMockDataEnabled()) {
            // For mock data, filter locations based on user role from localStorage
            return new Promise((resolve) => {
                setTimeout(() => {
                    const userStr = localStorage.getItem('user');
                    if (!userStr) {
                        resolve([]);
                        return;
                    }

                    const user = JSON.parse(userStr);

                    // Filter locations based on user role
                    if (user.role === 'client_user' && user.location) {
                        // Client user has access to only their assigned location
                        resolve([user.location]);
                    } else if (['client_admin', 'sanepid_user', 'sanepid_admin'].includes(user.role) && user.locations) {
                        // Admin users have access to multiple locations
                        resolve(user.locations);
                    } else {
                        // Fallback to all mock locations
                        resolve(locations);
                    }
                }, 300);
            });
        }

        try {
            // Ensure the token is included in the request
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await api.get('/locations');
            console.log('Fetched user-specific locations from API:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch locations:', error);
            throw error.response?.data?.message || 'Failed to fetch locations';
        }
    },

    // Get location by id
    getLocationById: async (id) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const location = locations.find(loc => loc.id === id);
                    if (location) {
                        resolve(location);
                    } else {
                        reject('Location not found');
                    }
                }, 500);
            });
        }

        try {
            const response = await api.get(`/locations/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch location';
        }
    }
};

export default locationsService;