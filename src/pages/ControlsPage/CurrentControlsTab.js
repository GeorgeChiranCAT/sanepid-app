// src/pages/ControlsPage/CurrentControlsTab.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import controlsService from '../../services/controlsService';

const ControlItem = ({ control, onControlClick }) => {
    // Status colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'done':
                return 'bg-green-500';
            case 'missed':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <div
            className="border rounded-md p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onControlClick(control)}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">{control.name}</h3>
                    <p className="text-sm text-gray-600">{control.category}</p>
                </div>
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(control.status)}`}></div>
                    <span className="text-sm text-gray-600">
            {control.status === 'pending' ? 'Expires on:' : 'Expired on:'} {new Date(control.expiresAt).toLocaleDateString()}
          </span>
                </div>
            </div>
        </div>
    );
};

const CurrentControlsTab = ({ searchTerm = '' }) => {
    const [controls, setControls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedControl, setSelectedControl] = useState(null);
    const [showControlModal, setShowControlModal] = useState(false);

    useEffect(() => {
        const fetchControls = async () => {
            try {
                const data = await controlsService.getControls();
                setControls(data);
            } catch (error) {
                toast.error('Failed to fetch controls');
                console.error('Error fetching controls:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchControls();
    }, []);

    const handleControlClick = (control) => {
        setSelectedControl(control);
        setShowControlModal(true);
        // In a real implementation, you'd open a modal or navigate to a details page
        console.log('Control clicked:', control);
    };

    // Filter controls based on search term
    const filteredControls = searchTerm
        ? controls.filter(control =>
            control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            control.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : controls;

    if (loading) {
        return <div className="flex justify-center py-10">Loading controls...</div>;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Current Controls</h2>

            {!Array.isArray(filteredControls) ? (
                <div className="flex justify-center py-10">Loading controls...</div>
            ) : filteredControls.length === 0 ? (
                <p className="text-gray-500">
                    {searchTerm ? 'No controls found matching your search.' : 'No controls available.'}
                </p>
            ) : (
                <div className="space-y-4">
                    {filteredControls.map(control => (
                        <ControlItem
                            key={control.id}
                            control={control}
                            onControlClick={handleControlClick}
                        />
                    ))}
                </div>
            )}

            {/* This would be replaced with a proper modal component in a full implementation */}
            {showControlModal && selectedControl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4">{selectedControl.name}</h3>
                        <p><strong>Category:</strong> {selectedControl.category}</p>
                        <p><strong>Status:</strong> {selectedControl.status}</p>
                        <p><strong>Expires:</strong> {new Date(selectedControl.expiresAt).toLocaleDateString()}</p>

                        {selectedControl.completedAt && (
                            <p><strong>Completed:</strong> {new Date(selectedControl.completedAt).toLocaleDateString()}</p>
                        )}

                        {selectedControl.completedBy && (
                            <p><strong>Completed By:</strong> {selectedControl.completedBy}</p>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowControlModal(false)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentControlsTab;