// src/components/common/ConfigPanel.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { clearLoginData } from '../../services/api';

const ConfigPanel = () => {
    const [useMockData, setUseMockData] = useState(
        localStorage.getItem('useMockData') === 'true' || process.env.REACT_APP_USE_MOCK_DATA === 'true'
    );
    const [apiUrl, setApiUrl] = useState(
        localStorage.getItem('apiUrl') || process.env.REACT_APP_API_URL || 'http://localhost:8080/api'
    );
    const [showPanel, setShowPanel] = useState(false);

    useEffect(() => {
        // Save settings to localStorage when they change
        localStorage.setItem('useMockData', useMockData);
        localStorage.setItem('apiUrl', apiUrl);

        // Update the window object to make settings available to services
        window.appConfig = {
            useMockData,
            apiUrl
        };
    }, [useMockData, apiUrl]);

    const handleSave = () => {
        // Save settings and refresh the page to apply changes
        localStorage.setItem('useMockData', useMockData);
        localStorage.setItem('apiUrl', apiUrl);
        window.location.reload();
    };

    const togglePanel = () => {
        setShowPanel(!showPanel);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={togglePanel}
                className="bg-gray-700 text-white p-2 rounded-full shadow-lg"
                title="Configuration"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>

            {showPanel && (
                <div className="absolute bottom-14 right-0 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Configuration</h3>

                    <div className="mb-3">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={useMockData}
                                onChange={(e) => setUseMockData(e.target.checked)}
                                className="mr-2 h-4 w-4"
                            />
                            <span className="text-sm">Use Mock Data</span>
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            API URL
                        </label>
                        <input
                            type="text"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md"
                            disabled={useMockData}
                        />
                    </div>

                    <div className="flex justify-between mb-2">
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                            Save & Reload
                        </button>
                        <button
                            onClick={togglePanel}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm"
                        >
                            Close
                        </button>
                    </div>

                    <button
                        onClick={clearLoginData}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm mt-2 w-full"
                    >
                        Clear Login & Reload
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConfigPanel;