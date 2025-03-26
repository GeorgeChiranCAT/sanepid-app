// src/services/categoriesService.js
import api from './api';

// Helper function to check if mock data should be used
const isMockDataEnabled = () => {
    return localStorage.getItem('useMockData') === 'true' ||
        process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
        (window.appConfig && window.appConfig.useMockData);
};

// Mock categories data with renamed columns
const mockCategories = [
    { id: '1', category: 'Temperature Control', subcategory: 'Refrigerator', description: 'Refrigerator temperature checks' },
    { id: '2', category: 'Temperature Control', subcategory: 'Freezer', description: 'Freezer temperature checks' },
    { id: '3', category: 'Hygiene', subcategory: 'Hand washing', description: 'Staff hand washing checks' },
    { id: '4', category: 'Production', subcategory: 'Cooking', description: 'Food cooking temperature verification' },
    { id: '5', category: 'Goods Receipt', subcategory: 'Delivery', description: 'Verify received goods temperature and quality' },
    { id: '6', category: 'Annual', subcategory: 'Pest Control', description: 'Annual pest control verification' }
];

const categoriesService = {
    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            throw error;
        }
    },

    // Get subcategories for a specific category
    getSubcategories: async (category) => {
        try {
            const response = await api.get(`/categories/${encodeURIComponent(category)}/subcategories`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch subcategories for ${category}:`, error);
            throw error;
        }
    },

    // Get all categories with subcategories
    getAllCategoriesWithSubcategories: async () => {
        try {
            const response = await api.get('/categories/all');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch all categories with subcategories:', error);
            throw error;
        }
    },

    // Get a single category by ID
    getCategoryById: async (id) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const category = mockCategories.find(cat => cat.id === id);
                    if (category) {
                        resolve(category);
                    } else {
                        reject(new Error('Category not found'));
                    }
                }, 300);
            });
        }

        try {
            const response = await api.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch category with ID ${id}:`, error);
            throw error;
        }
    },

    // Create a new category
    createCategory: async (categoryData) => {
        if (isMockDataEnabled()) {
            return new Promise(resolve => {
                setTimeout(() => {
                    const newCategory = {
                        id: String(mockCategories.length + 1),
                        ...categoryData
                    };
                    mockCategories.push(newCategory);
                    resolve(newCategory);
                }, 500);
            });
        }

        try {
            const response = await api.post('/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Failed to create category:', error);
            throw error;
        }
    },

    // Update an existing category
    updateCategory: async (id, categoryData) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
                    if (categoryIndex === -1) {
                        reject(new Error('Category not found'));
                        return;
                    }

                    const updatedCategory = {
                        ...mockCategories[categoryIndex],
                        ...categoryData
                    };

                    mockCategories[categoryIndex] = updatedCategory;
                    resolve(updatedCategory);
                }, 500);
            });
        }

        try {
            const response = await api.put(`/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update category with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete a category
    deleteCategory: async (id) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
                    if (categoryIndex === -1) {
                        reject(new Error('Category not found'));
                        return;
                    }

                    mockCategories.splice(categoryIndex, 1);
                    resolve({ success: true });
                }, 500);
            });
        }

        try {
            await api.delete(`/categories/${id}`);
            return { success: true };
        } catch (error) {
            console.error(`Failed to delete category with ID ${id}:`, error);
            throw error;
        }
    }
};

export default categoriesService;