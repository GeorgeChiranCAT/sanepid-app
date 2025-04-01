// src/services/controlsService.js
import api from './api';
import { controls, expiredControls, locations } from '../mockData';

// Helper function to check if mock data is enabled
const isMockDataEnabled = () => {
    return localStorage.getItem('useMockData') === 'true' ||
        process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
        (window.appConfig && window.appConfig.useMockData);
};

const controlsService = {

   // bring all the controls instances for a location
    // In your frontend service
    getControlInstancesForMonth: async (locationId, year, month) => {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Create mock data for control instances
                    const mockInstances = [];
                    // Use the existing controls array from your mock data
                    controls.forEach(control => {
                        // Generate a few instances for each control
                        for (let day = 1; day <= Math.min(5, lastDay); day++) {
                            // Only create instances for some days (randomized)
                            if (Math.random() > 0.7) {
                                const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                mockInstances.push({
                                    id: `mock-${control.id}-${day}`,
                                    location_control_id: control.id,
                                    scheduled_date: date,
                                    status: ['pending', 'completed', 'missed'][Math.floor(Math.random() * 3)],
                                    category: control.category,
                                    subcategory: control.subcategory || '',
                                    completed_at: Math.random() > 0.5 ? new Date().toISOString() : null,
                                    measurements: Math.random() > 0.7 ? { value: `${Math.floor(Math.random() * 100)}°C` } : null
                                });
                            }
                        }
                    });
                    resolve(mockInstances);
                }, 500);
            });
        }

        try {
            const response = await api.get(`/instances/location/${locationId}`, {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching control instances:', error);
            throw error;
        }
    },

    // Get all controls with optional filters
    getControls: async (filters = {}) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let filteredControls = [...controls];

                    // Apply filters
                    if (filters.status) {
                        filteredControls = filteredControls.filter(control => control.status === filters.status);
                    }

                    if (filters.category) {
                        filteredControls = filteredControls.filter(control => control.category === filters.category);
                    }

                    if (filters.dueWithin) {
                        const dueDate = new Date();
                        dueDate.setDate(dueDate.getDate() + filters.dueWithin);
                        filteredControls = filteredControls.filter(control =>
                            new Date(control.expiresAt) <= dueDate && control.status === 'pending'
                        );
                    }

                    resolve(filteredControls);
                }, 500);
            });
        }

        try {
            const response = await api.get('/controls', { params: filters });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch controls';
        }
    },

    // Get expired controls
    getExpiredControls: async () => {
        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(expiredControls);
                }, 500);
            });
        }

        try {
            const response = await api.get('/controls/expired');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch expired controls';
        }
    },

    // Get a single control by ID
    getControlById: async (id) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const control = controls.find(c => c.id === id);
                    if (control) {
                        resolve(control);
                    } else {
                        reject('Control not found');
                    }
                }, 500);
            });
        }

        try {
            const response = await api.get(`/controls/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch control';
        }
    },

    // Complete a control
    completeControl: async (id, data) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const controlIndex = controls.findIndex(c => c.id === id);
                    if (controlIndex !== -1) {
                        controls[controlIndex] = {
                            ...controls[controlIndex],
                            status: 'done',
                            completedAt: new Date().toISOString(),
                            completedBy: data.user || 'Current User',
                            ...data
                        };
                    }
                    resolve(controls[controlIndex]);
                }, 500);
            });
        }

        try {
            const response = await api.post(`/controls/${id}/complete`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to complete control';
        }
    },

    // Add a reason for missed control(s)
    addMissedControlReason: async (id, data) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (id) {
                        // Single control update
                        const controlIndex = controls.findIndex(c => c.id === id);
                        if (controlIndex !== -1) {
                            controls[controlIndex] = {
                                ...controls[controlIndex],
                                status: 'missed',
                                missedReason: data.reason || data.standardExcuse,
                                missedBy: data.user || 'Current User'
                            };
                        }
                        resolve(controls[controlIndex]);
                    } else if (data.controlIds) {
                        // Multiple controls update
                        data.controlIds.forEach(controlId => {
                            const controlIndex = controls.findIndex(c => c.id === controlId);
                            if (controlIndex !== -1) {
                                controls[controlIndex] = {
                                    ...controls[controlIndex],
                                    status: 'missed',
                                    missedReason: data.reason || data.standardExcuse,
                                    missedBy: data.user || 'Current User'
                                };
                            }
                        });
                        resolve({ success: true });
                    }
                }, 500);
            });
        }

        try {
            if (id) {
                const response = await api.post(`/controls/${id}/missed`, data);
                return response.data;
            } else {
                const response = await api.post('/controls/missed', data);
                return response.data;
            }
        } catch (error) {
            throw error.response?.data?.message || 'Failed to add missed control reason';
        }
    },

    // Add a new control
    addControl: async (data) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newControl = {
                        id: (controls.length + 1).toString(),
                        ...data,
                        status: 'pending',
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
                    };
                    controls.push(newControl);
                    resolve(newControl);
                }, 500);
            });
        }

        try {
            const response = await api.post('/controls', data);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to add control';
        }
    },

    // Get all controls for a specific location
    getLocationControls: async (locationId) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Find the location details
                    const location = locations.find(loc => loc.id === locationId);
                    if (!location) {
                        resolve([]);
                        return;
                    }

                    // Filter controls for the specific location
                    const locationControls = controls.filter(control =>
                        control.location === location.name
                    );

                    resolve(locationControls);
                }, 500);
            });
        }

        try {
            const response = await api.get(`/locations/${locationId}/controls`);
            return response.data;
        } catch (error) {
            console.error('Error fetching location controls:', error);
            throw error.response?.data?.message || 'Failed to fetch location controls';
        }
    },

    // Create a new control for a location
    createLocationControl: async (locationId, controlData) => {
        // Ensure frequency_config is properly formatted as a JSON string for the API
        const formattedData = {
            ...controlData,
            frequency_config: typeof controlData.frequency_config === 'object'
                ? controlData.frequency_config
                : {}
        };

        if (isMockDataEnabled()) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Find the location
                    const location = locations.find(loc => loc.id === locationId);
                    if (!location) {
                        throw new Error('Location not found');
                    }

                    // Create new control with location info
                    const newId = String(Math.max(...controls.map(c => parseInt(c.id) || 0), 0) + 1);
                    const newControl = {
                        id: newId,
                        ...formattedData,
                        location: location.name,
                        status: 'pending',
                        is_active: formattedData.is_active !== undefined ? formattedData.is_active : true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };

                    // Add to controls array
                    controls.push(newControl);
                    resolve(newControl);
                }, 500);
            });
        }

        try {
            const response = await api.post(`/locations/${locationId}/controls`, formattedData);
            return response.data;
        } catch (error) {
            console.error('Error creating location control:', error);
            throw error.response?.data?.message || 'Failed to create location control';
        }
    },

    // Update an existing control for a location
    updateLocationControl: async (locationId, controlId, controlData) => {
        // Ensure frequency_config is properly formatted as a JSON string for the API
        const formattedData = {
            ...controlData,
            frequency_config: typeof controlData.frequency_config === 'object'
                ? controlData.frequency_config
                : {}
        };

        if (isMockDataEnabled()) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Find the control
                    const controlIndex = controls.findIndex(c => c.id === controlId);
                    if (controlIndex === -1) {
                        reject('Control not found');
                        return;
                    }

                    // Update the control
                    const updatedControl = {
                        ...controls[controlIndex],
                        ...formattedData,
                        updated_at: new Date().toISOString()
                    };

                    controls[controlIndex] = updatedControl;
                    resolve(updatedControl);
                }, 500);
            });
        }

        try {
            const response = await api.put(`/locations/${locationId}/controls/${controlId}`, formattedData);
            return response.data;
        } catch (error) {
            console.error('Error updating location control:', error);
            throw error.response?.data?.message || 'Failed to update location control';
        }
    },

    // Delete a control
    deleteLocationControl: async (locationId, controlId) => {
        if (isMockDataEnabled()) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const controlIndex = controls.findIndex(c => c.id === controlId);
                    if (controlIndex === -1) {
                        reject('Control not found');
                        return;
                    }

                    // Remove the control from the array
                    controls.splice(controlIndex, 1);
                    resolve({ success: true });
                }, 500);
            });
        }

        try {
            await api.delete(`/locations/${locationId}/controls/${controlId}`);
            return { success: true };
        } catch (error) {
            console.error('Error deleting location control:', error);
            throw error.response?.data?.message || 'Failed to delete location control';
        }
    }
};

export default controlsService;