// src/services/categoryDetailsService.js
import api from './api';

const categoryDetailsService = {
    // Get configuration fields for a category
    getCategoryDetails: async (categoryId) => {
        try {
            const response = await api.get(`/category-details/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch details for category ${categoryId}:`, error);
            throw error;
        }
    }
};

export default categoryDetailsService;