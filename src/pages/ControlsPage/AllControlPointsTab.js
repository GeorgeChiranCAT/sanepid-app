// src/pages/ControlsPage/AllControlPointsTab.js
import React from 'react';

const AllControlPointsTab = ({ searchTerm = '' }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">All Control Points</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-700">
                    This feature is coming soon. It will display all control points across your locations.
                </p>
            </div>
        </div>
    );
};

export default AllControlPointsTab;