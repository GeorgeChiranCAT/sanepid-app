// src/pages/ControlsPage/CurrentControlsTab.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import controlsService from '../../services/controlsService';
import locationsService from '../../services/locationsService';

const ControlItem = ({ control, onControlClick }) => {
    // Status colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'missed':
                return 'bg-red-500';
            default:
                return 'bg-yellow-400'; // For pending
        }
    };

    return (
        <div
            className="border rounded-md p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onControlClick(control)}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">{control.subcategory || control.category}</h3>
                    <p className="text-sm text-gray-600">{control.category}</p>
                </div>
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(control.status)}`}></div>
                    <span className="text-sm text-gray-600">
                        {control.status.charAt(0).toUpperCase() + control.status.slice(1)} -
                        {control.scheduled_date ? new Date(control.scheduled_date).toLocaleDateString() : 'Unknown date'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const CurrentControlsTab = ({ searchTerm = '' }) => {
    const { user } = useAuth();
    const [controls, setControls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedControl, setSelectedControl] = useState(null);
    const [showControlModal, setShowControlModal] = useState(false);

    // Add new state for locations
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [loadingLocations, setLoadingLocations] = useState(false);

    // Fetch locations for admin users
    useEffect(() => {
        const fetchLocations = async () => {
            if (!user) return;

            // Only fetch locations for admin users
            if (user.role === 'client_admin' || user.role === 'sanepid_admin' || user.role === 'sanepid_user') {
                setLoadingLocations(true);
                try {
                    console.log('Fetching locations for admin user');
                    const data = await locationsService.getLocations();
                    console.log('Received locations:', data);
                    setLocations(data);

                    // Set default selected location if none is selected yet
                    if (data.length > 0 && !selectedLocation) {
                        setSelectedLocation(data[0].id);
                    }
                } catch (error) {
                    console.error('Error fetching locations:', error);
                    toast.error('Failed to fetch locations');
                } finally {
                    setLoadingLocations(false);
                }
            } else if (user?.location) {
                // For regular users, set their assigned location
                setSelectedLocation(user.location.id);
            }
        };

        fetchLocations();
    }, [user, selectedLocation]);

    // Update the fetch controls effect to use selectedLocation
    useEffect(() => {
        const fetchControlInstances = async () => {
            if (!selectedLocation) return;

            try {
                setLoading(true);
                console.log(`Fetching controls for location: ${selectedLocation}`);

                // Get current month and year
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1;
                const currentYear = currentDate.getFullYear();

                const data = await controlsService.getControlInstancesForMonth(
                    selectedLocation,
                    currentYear,
                    currentMonth
                );

                console.log('Received control instances:', data);
                setControls(data);
            } catch (error) {
                toast.error('Failed to fetch controls');
                console.error('Error fetching controls:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchControlInstances();
    }, [selectedLocation]);

    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
    };

    const handleControlClick = (control) => {
        setSelectedControl(control);
        setShowControlModal(true);
        console.log('Control clicked:', control);
    };

    // Filter controls based on search term
    const filteredControls = searchTerm && controls
        ? controls.filter(control =>
            (control.subcategory || control.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (control.category || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        : controls;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Current Controls</h2>

            {/* Location selector for admin users */}
            {user && (user.role === 'client_admin' || user.role === 'sanepid_admin' || user.role === 'sanepid_user') && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    {loadingLocations ? (
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                            Loading locations...
                        </div>
                    ) : (
                        <select
                            value={selectedLocation}
                            onChange={handleLocationChange}
                            className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>Select a location</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-10">Loading controls...</div>
            ) : !Array.isArray(filteredControls) ? (
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
                        <h3 className="text-xl font-bold mb-4">{selectedControl.subcategory || selectedControl.category}</h3>
                        <p><strong>Category:</strong> {selectedControl.category}</p>
                        <p><strong>Status:</strong> {selectedControl.status}</p>
                        <p><strong>Scheduled Date:</strong> {new Date(selectedControl.scheduled_date).toLocaleDateString()}</p>

                        {selectedControl.completed_at && (
                            <p><strong>Completed:</strong> {new Date(selectedControl.completed_at).toLocaleDateString()}</p>
                        )}

                        {selectedControl.completed_by && (
                            <p><strong>Completed By:</strong> {selectedControl.completed_by}</p>
                        )}

                        {selectedControl.measurements && (
                            <div className="mt-2">
                                <strong>Measurements:</strong> {
                                typeof selectedControl.measurements === 'object'
                                    ? Object.entries(selectedControl.measurements)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(', ')
                                    : selectedControl.measurements
                            }
                            </div>
                        )}

                        {selectedControl.notes && (
                            <div className="mt-2">
                                <strong>Notes:</strong> {selectedControl.notes}
                            </div>
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