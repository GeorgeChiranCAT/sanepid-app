// src/pages/DocumentsPage.js
import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toast } from 'react-toastify';
import documentsService from '../services/documentsService';

const ContentTab = () => {
    const [tableOfContents, setTableOfContents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTableOfContents = async () => {
            try {
                const data = await documentsService.getDocumentsContent();
                // Ensure data is an array before setting it
                setTableOfContents(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error('Failed to fetch table of contents');
                console.error('Error fetching table of contents:', error);
                setTableOfContents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTableOfContents();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-10">Loading content...</div>;
    }

    // Make sure tableOfContents is an array
    const safeContent = Array.isArray(tableOfContents) ? tableOfContents : [];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>

            {safeContent.length === 0 ? (
                <p className="text-gray-500">No content available.</p>
            ) : (
                <ul className="space-y-2">
                    {safeContent.map((item, idx) => (
                        <li key={item.id || idx} className="border-b pb-2">
                            <a
                                href={`#document-${item.id}`}
                                className="text-blue-600 hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // This would typically navigate to the document in the Documents tab
                                    toast.info(`Navigating to document: ${item.title}`);
                                }}
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const DocumentsTab = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedDocumentContent, setSelectedDocumentContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const data = await documentsService.getDocumentsContent();
                // Ensure data is an array
                const docsArray = Array.isArray(data) ? data : [];
                setDocuments(docsArray);
                if (docsArray.length > 0) {
                    setSelectedDocument(docsArray[0].id);
                }
            } catch (error) {
                toast.error('Failed to fetch documents');
                console.error('Error fetching documents:', error);
                setDocuments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    useEffect(() => {
        if (selectedDocument) {
            const fetchDocumentContent = async () => {
                try {
                    const data = await documentsService.getDocumentById(selectedDocument);
                    setSelectedDocumentContent(data);
                } catch (error) {
                    toast.error('Failed to fetch document content');
                    console.error('Error fetching document content:', error);
                    setSelectedDocumentContent(null);
                }
            };

            fetchDocumentContent();
        }
    }, [selectedDocument]);

    const handleDocumentChange = (e) => {
        setSelectedDocument(e.target.value);
    };

    if (loading) {
        return <div className="flex justify-center py-10">Loading documents...</div>;
    }

    // Make sure documents is an array
    const safeDocuments = Array.isArray(documents) ? documents : [];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Documents</h2>

            <div className="mb-4">
                <select
                    value={selectedDocument || ''}
                    onChange={handleDocumentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    {safeDocuments.length === 0 ? (
                        <option value="" disabled>No documents available</option>
                    ) : (
                        safeDocuments.map((doc, idx) => (
                            <option key={doc.id || idx} value={doc.id}>
                                {doc.title}
                            </option>
                        ))
                    )}
                </select>
            </div>

            {selectedDocumentContent ? (
                <div className="border rounded-md p-4 bg-white">
                    <h3 className="text-lg font-medium mb-2">{selectedDocumentContent.title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: selectedDocumentContent.content }}></div>
                </div>
            ) : (
                <p className="text-gray-500">
                    {safeDocuments.length > 0 ? 'Select a document to view its content.' : 'No documents available.'}
                </p>
            )}
        </div>
    );
};

const HaccpAnalysisTab = () => {
    const [haccpData, setHaccpData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHaccpAnalysis = async () => {
            try {
                const data = await documentsService.getHACCPAnalysis();
                setHaccpData(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error('Failed to fetch HACCP analysis');
                console.error('Error fetching HACCP analysis:', error);
                setHaccpData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHaccpAnalysis();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-10">Loading HACCP analysis...</div>;
    }

    // Make sure haccpData is an array
    const safeHaccpData = Array.isArray(haccpData) ? haccpData : [];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">HACCP Analysis</h2>

            {safeHaccpData.length === 0 ? (
                <p className="text-gray-500">No HACCP analysis data available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hazard
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Preventive Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {safeHaccpData.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-normal">
                                    <div className="text-sm text-gray-900">{item.hazard}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-normal">
                                    <div className="text-sm text-gray-900">{item.preventiveActions}</div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const DocumentsPage = () => {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Documents</h1>

            <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
                <TabList className="flex border-b mb-4">
                    <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:text-blue-600 focus:outline-none">
                        Content
                    </Tab>
                    <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:text-blue-600 focus:outline-none">
                        Documents
                    </Tab>
                    <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:text-blue-600 focus:outline-none">
                        HACCP Analysis
                    </Tab>
                </TabList>

                <TabPanel>
                    <ContentTab />
                </TabPanel>
                <TabPanel>
                    <DocumentsTab />
                </TabPanel>
                <TabPanel>
                    <HaccpAnalysisTab />
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default DocumentsPage;