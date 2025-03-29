// src/services/reportsService.js
import api from './api';
import { generateReportsData, locations } from '../mockData';

// Helper function to check if mock data should be used
const isMockDataEnabled = () => {
    return localStorage.getItem('useMockData') === 'true' ||
        process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
        (window.appConfig && window.appConfig.useMockData);
};

const reportsService = {
    // Get reports for a specific month and year
    getReports: async (month, year, locationId = null) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(generateReportsData(month, year, locationId || '1'));
                }, 500);
            });
        }

        try {
            const response = await api.get(`/reports/${year}/${month}/location/${locationId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reports:', error);
            throw error;
        }
    },

    // Get locations available for reports (for admin users)
    getLocations: async () => {
        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(locations);
                }, 500);
            });
        }

        try {
            const response = await api.get('/locations');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch locations';
        }
    }
};

export default reportsService;