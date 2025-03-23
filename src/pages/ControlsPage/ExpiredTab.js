// src/pages/ControlsPage/ExpiredTab.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import controlsService from '../../services/controlsService';

const ExpiredTab = ({ searchTerm = '' }) => {
    const [expiredControls, setExpiredControls] = useState([]);
    const [selectedControls, setSelectedControls] = useState([]);
    const [reason, setReason] = useState('');
    const [standardExcuse, setStandardExcuse] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchExpiredControls = async () => {
            try {
                const data = await controlsService.getExpiredControls();
                // Ensure data is an array
                setExpiredControls(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error('Failed to fetch expired controls');
                console.error('Error fetching expired controls:', error);
                setExpiredControls([]);
            } finally {
                setLoading(false);
            }
        };

        fetchExpiredControls();
    }, []);

    const handleSelectControl = (controlId) => {
        setSelectedControls(prev => {
            if (prev.includes(controlId)) {
                return prev.filter(id => id !== controlId);
            } else {
                return [...prev, controlId];
            }
        });
    };

    const handleSelectAll = () => {
        // Make sure expiredControls is an array
        const safeControls = Array.isArray(expiredControls) ? expiredControls : [];

        if (selectedControls.length === safeControls.length) {
            setSelectedControls([]);
        } else {
            setSelectedControls(safeControls.map(control => control.id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedControls.length === 0) {
            toast.warn('Please select at least one control');
            return;
        }

        setSubmitting(true);
        try {
            const data = {
                controlIds: selectedControls,
                reason: reason,
                standardExcuse: standardExcuse
            };

            await controlsService.addMissedControlReason(null, data);

            toast.success('Reasons for missed controls saved successfully');

            // Refresh the list after submission
            const updatedControls = await controlsService.getExpiredControls();
            setExpiredControls(Array.isArray(updatedControls) ? updatedControls : []);

            // Reset form
            setSelectedControls([]);
            setReason('');
            setStandardExcuse('');
        } catch (error) {
            toast.error('Failed to save reasons for missed controls');
            console.error('Error adding missed control reasons:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-10">Loading expired controls...</div>;
    }

    // Make sure expiredControls is an array
    const safeExpiredControls = Array.isArray(expiredControls) ? expiredControls : [];

    // Filter controls based on search term
    const filteredControls = searchTerm
        ? safeExpiredControls.filter(control =>
            control.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            control.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : safeExpiredControls;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Expired Controls</h2>

            {!Array.isArray(filteredControls) || filteredControls.length === 0 ? (
                <p className="text-gray-500">
                    {searchTerm ? 'No expired controls found matching your search.' : 'No expired controls found.'}
                </p>
            ) : (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2">
                        <div className="mb-3 flex items-center">
                            <input
                                type="checkbox"
                                id="select-all"
                                checked={selectedControls.length === filteredControls.length && filteredControls.length > 0}
                                onChange={handleSelectAll}
                                className="mr-2 h-4 w-4"
                            />
                            <label htmlFor="select-all" className="text-sm font-medium">Select All</label>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto border rounded-md p-2">
                            {filteredControls.map((control, idx) => (
                                <div key={control.id || idx} className="flex items-center p-2 hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        id={`control-${control.id || idx}`}
                                        checked={selectedControls.includes(control.id)}
                                        onChange={() => handleSelectControl(control.id)}
                                        className="mr-3 h-4 w-4"
                                    />
                                    <label htmlFor={`control-${control.id || idx}`} className="flex-grow cursor-pointer">
                                        <div className="font-medium">{control.name}</div>
                                        <div className="text-sm text-gray-600">
                                            Expired on: {new Date(control.expiresAt).toLocaleDateString()}
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="remarks" className="block text-sm font-medium mb-1">Remarks</label>
                                <textarea
                                    id="remarks"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    rows="4"
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="responsible" className="block text-sm font-medium mb-1">Responsible</label>
                                <input
                                    type="text"
                                    id="responsible"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                                    value="Current User" // This would be populated with the logged-in user
                                    readOnly
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="standard-excuse" className="block text-sm font-medium mb-1">
                                    Standard Excuse
                                </label>
                                <select
                                    id="standard-excuse"
                                    value={standardExcuse}
                                    onChange={(e) => setStandardExcuse(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select an excuse...</option>
                                    <option value="holiday">Not carried out due to holiday/weekend</option>
                                    <option value="illness">Not performed due to illness</option>
                                </select>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={submitting || selectedControls.length === 0}
                                    className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                                        (submitting || selectedControls.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {submitting ? 'Saving...' : 'Save'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedControls([]);
                                        setReason('');
                                        setStandardExcuse('');
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpiredTab;