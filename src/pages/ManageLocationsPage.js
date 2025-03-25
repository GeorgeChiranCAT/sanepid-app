// src/pages/ManageLocationsPage.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import locationsService from '../services/locationsService';
import { useNavigate } from 'react-router-dom';

const ManageLocationsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);

    // Check if user is authorized
    const isAdmin = user && (user.role === 'client_admin' || user.role === 'sanepid_admin' || user.role === 'sanepid_user');

    useEffect(() => {
        const fetchLocations = async () => {
            if (!isAdmin) return;

            try {
                setLoading(true);
                const data = await locationsService.getLocations();
                setLocations(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching locations:', error);
                toast.error('Failed to fetch locations');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [isAdmin]);

    // If not admin, redirect to home
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    const handleEdit = (location) => {
        navigate(`/manage-locations/${location.id}/controls`);
        setEditingLocation(location);
        setShowAddModal(true);
    };

    const handleDelete = async (locationId) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            try {
                await locationsService.deleteLocation(locationId);
                setLocations(prevLocations =>
                    prevLocations.filter(loc => loc.id !== locationId)
                );
                toast.success('Location deleted successfully');
            } catch (error) {
                console.error('Error deleting location:', error);
                toast.error('Failed to delete location');
            }
        }
    };

    const columns = [
        {
            header: 'Name',
            accessor: 'name',
        },
        {
            header: 'Actions',
            accessor: 'id',
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(row.id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Locations</h1>
                <Button
                    onClick={() => {
                        setEditingLocation(null);
                        setShowAddModal(true);
                    }}
                >
                    Add New Location
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">Loading locations...</div>
            ) : (
                <Card>
                    <Table
                        columns={columns}
                        data={locations}
                        emptyMessage="No locations found."
                    />
                </Card>
            )}

            {showAddModal && (
                <LocationFormModal
                    location={editingLocation}
                    onClose={() => setShowAddModal(false)}
                    onSave={(newLocation) => {
                        if (editingLocation) {
                            // Update existing location in the list
                            setLocations(prevLocations =>
                                prevLocations.map(loc =>
                                    loc.id === newLocation.id ? newLocation : loc
                                )
                            );
                        } else {
                            // Add new location to the list
                            setLocations(prevLocations => [...prevLocations, newLocation]);
                        }
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
};

// Location Form Modal Component
const LocationFormModal = ({ location, onClose, onSave }) => {
    const [name, setName] = useState(location?.name || '');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Location name is required');
            return;
        }

        setSubmitting(true);
        try {
            let result;
            if (location) {
                // Update existing location
                result = await locationsService.updateLocation(location.id, { name });
                toast.success('Location updated successfully');
            } else {
                // Create new location
                result = await locationsService.createLocation({ name });
                toast.success('Location created successfully');
            }
            onSave(result);
        } catch (error) {
            console.error('Error saving location:', error);
            toast.error(location ? 'Failed to update location' : 'Failed to create location');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                    {location ? 'Edit Location' : 'Add New Location'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Location Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : (location ? 'Update' : 'Create')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageLocationsPage;