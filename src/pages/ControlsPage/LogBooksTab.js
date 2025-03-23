// src/pages/ControlsPage/LogBooksTab.js
import React from 'react';

const LogBooksTab = ({ searchTerm = '' }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Log Books</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-700">
                    This feature is coming soon. It will allow you to view and manage log books for your location.
                </p>
            </div>
        </div>
    );
};

export default LogBooksTab;