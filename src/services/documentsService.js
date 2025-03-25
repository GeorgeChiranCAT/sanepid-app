// src/services/documentsService.js
import { documentsContent, haccpAnalysis } from '../mockData';
// If your mockData is exported differently, adjust the import accordingly

const documentsService = {
    getDocumentsContent: async () => {
        return Promise.resolve(documentsContent);
    },

    getDocumentById: async (documentId) => {
        const document = documentsContent.find(doc => doc.id === documentId);
        return Promise.resolve(document);
    },

    getHACCPAnalysis: async () => {
        return Promise.resolve(haccpAnalysis);
    }
};

export default documentsService;