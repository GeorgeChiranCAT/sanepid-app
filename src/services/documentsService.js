// src/services/documentsService.js
import api from './api';
import { documentsContent, haccpAnalysis } from '../mockData';

// Renamed to avoid React Hook rules
const isMockDataEnabled = () => {
    return localStorage.getItem('useMockData') === 'true' ||
        process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
        (window.appConfig && window.appConfig.useMockData);
};

const documentsService = {
    // Get all documents content
    getDocumentsContent: async () => {
        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(documentsContent);
                }, 500);
            });
        }

        try {
            const response = await api.get('/documents/content');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch documents content';
        }
    },

    // Get a specific document by ID
    getDocumentById: async (id) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const document = documentsContent.find(doc => doc.id === id);
                    if (document) {
                        resolve(document);
                    } else {
                        reject('Document not found');
                    }
                }, 500);
            });
        }

        try {
            const response = await api.get(`/documents/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch document';
        }
    },

    // Get HACCP analysis data
    getHACCPAnalysis: async () => {
        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(haccpAnalysis);
                }, 500);
            });
        }

        try {
            const response = await api.get('/documents/haccp');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch HACCP analysis';
        }
    }
};

export default documentsService;