// src/services/controlsService.js
import api from './api';
import { controls, expiredControls } from '../mockData';

// Renamed to avoid React Hook rules
const isMockDataEnabled = () => {
    return localStorage.getItem('useMockData') === 'true' ||
        process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
        (window.appConfig && window.appConfig.useMockData);
};

const controlsService = {
    // Get all controls
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

    // Add a reason for missed control
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
    }
};

export default controlsService;