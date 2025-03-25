// src/pages/LocationControlsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import locationsService from '../services/locationsService';
import controlsService from '../services/controlsService';
import FrequencySelector from '../components/common/FrequencySelector';
import categoriesService from '../services/categoriesService';

const LocationControlsPage = () => {
    const { locationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [location, setLocation] = useState(null);
    const [controls, setControls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingControl, setEditingControl] = useState(null);
    const [categories, setCategories] = useState([]);
    // Check if user is authorized
    const isAdmin = user && (user.role === 'client_admin' || user.role === 'sanepid_admin' || user.role === 'sanepid_user');

    // Fetch categories when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesService.getCategories();
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
            }
        };

        fetchCategories();
    }, []);



    // useEffect for data fetching
    useEffect(() => {
        const fetchLocationData = async () => {
            if (!isAdmin || !locationId) return;

            try {
                setLoading(true);

                // Fetch location details
                const locationData = await locationsService.getLocationById(locationId);
                setLocation(locationData);

                // Fetch location controls
                const controlsData = await controlsService.getLocationControls(locationId);

                // Process controls data - ensure proper parsing of JSON fields
                // and handle renamed category/subcategory fields
                const processedControls = Array.isArray(controlsData)
                    ? controlsData.map(control => ({
                        ...control,
                        // Create a display name if needed
                        displayName: `${control.category} - ${control.subcategory}`,
                        // Parse frequency_config if it's a string
                        frequency_config: typeof control.frequency_config === 'string'
                            ? JSON.parse(control.frequency_config)
                            : control.frequency_config || {}
                    }))
                    : [];

                setControls(processedControls);
            } catch (error) {
                console.error('Error fetching location data:', error);
                toast.error('Failed to fetch location data');
            } finally {
                setLoading(false);
            }
        };

        fetchLocationData();
    }, [isAdmin, locationId]);

    const handleAddControl = () => {
        setEditingControl(null);
        setShowModal(true);
    };

    const handleEditControl = (control) => {
        setEditingControl(control);
        setShowModal(true);
    };

    const handleDeleteControl = async (controlId) => {
        if (window.confirm('Are you sure you want to delete this control?')) {
            try {
                await controlsService.deleteLocationControl(locationId, controlId);
                setControls(prevControls =>
                    prevControls.filter(control => control.id !== controlId)
                );
                toast.success('Control deleted successfully');
            } catch (error) {
                console.error('Error deleting control:', error);
                toast.error('Failed to delete control');
            }
        }
    };

    const handleSaveControl = async (controlData) => {
        try {
            let result;
            if (editingControl) {
                // Update existing control
                result = await controlsService.updateLocationControl(
                    locationId,
                    editingControl.id,
                    controlData
                );
                setControls(prevControls =>
                    prevControls.map(control =>
                        control.id === result.id ? result : control
                    )
                );
                toast.success('Control updated successfully');
            } else {
                // Create new control
                result = await controlsService.createLocationControl(
                    locationId,
                    controlData
                );
                setControls(prevControls => [...prevControls, result]);
                toast.success('Control created successfully');
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving control:', error);
            toast.error(editingControl ? 'Failed to update control' : 'Failed to create control');
        }
    };

    const formatFrequency = (control) => {
        if (!control.frequency_type) {
            return 'Unknown';
        }

        switch (control.frequency_type) {
            case 'daily':
                return 'Daily';
            case 'weekly': {
                const day = control.frequency_config?.dayOfWeek;
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return `Weekly (${days[day] || day})`;
            }
            case 'monthly': {
                const day = control.frequency_config?.dayOfMonth;
                return `Monthly (Day ${day})`;
            }
            case 'yearly': {
                const month = control.frequency_config?.month;
                const day = control.frequency_config?.dayOfMonth;
                const months = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                return `Yearly (${months[month] || month} ${day})`;
            }
            case 'custom': {
                const days = control.frequency_config?.daysOfWeek || [];
                const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
                const selectedDays = days.map(d => dayNames[d]).join(', ');
                return `Custom (${selectedDays})`;
            }
            default:
                return control.frequency_type;
        }
    };

    const columns = [
        {
            header: 'Name',
            accessor: 'name',
        },
        {
            header: 'Category',
            accessor: 'category',
        },
        {
            header: 'Subcategory',
            accessor: 'subcategory',
        },
        {
            header: 'Frequency',
            accessor: 'frequency_type',
            cell: (row) => formatFrequency(row),
        },
        {
            header: 'Status',
            accessor: 'is_active',
            cell: (row) => (
                <span className={`px-2 py-1 rounded text-xs ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'id',
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditControl(row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteControl(row.id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    if (loading) {
        return <div className="flex justify-center py-10">Loading location controls...</div>;
    }

    if (!location) {
        return <div className="text-center py-10">Location not found</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Manage Controls: {location.name}</h1>
                    <p className="text-gray-600 mt-1">Configure controls for this location</p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/manage-locations')}
                    >
                        Back to Locations
                    </Button>
                    <Button onClick={handleAddControl}>
                        Add New Control
                    </Button>
                </div>
            </div>

            <Card>
                {controls.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        No controls configured for this location yet.
                        Click "Add New Control" to create one.
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={controls}
                        emptyMessage="No controls found."
                    />
                )}
            </Card>

            {showModal && (
                <ControlFormModal
                    control={editingControl}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveControl}
                />
            )}
        </div>
    );
};

// Control Form Modal Component
const ControlFormModal = ({ control, onClose, onSave }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    // Initial state with support for frequency type and config
    const [formData, setFormData] = useState({
        category_id: control?.category_id || '',
        // Store the original category/subcategory values for display
        originalCategory: control?.category || '',
        originalSubcategory: control?.subcategory || '',
        frequency_type: control?.frequency_type || 'weekly',
        frequency_config: control?.frequency_config || { dayOfWeek: 1 },
        start_date: control?.start_date || new Date().toISOString().split('T')[0],
        end_date: control?.end_date || '',
        is_active: control?.is_active ?? true,
        description: control?.description || ''
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFrequencyChange = (frequencyData) => {
        setFormData(prev => ({
            ...prev,
            frequency_type: frequencyData.type,
            frequency_config: frequencyData.config
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim() || !formData.category_id) {
            toast.error('Name and category are required');
            return;
        }
        if (!formData.category_id) {
            toast.error('Category is required');
            return;
        }

        setSubmitting(true);

        try {
            // Format data for API - use the renamed fields
            const apiData = {
                ...formData,
                // Remove the display-only fields
                originalCategory: undefined,
                originalSubcategory: undefined
            };

            await onSave(apiData);
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Failed to save control');
        } finally {
            setSubmitting(false);
        }
    };



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-bold mb-4">
                    {control ? 'Edit Control' : 'Add New Control'}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Category selector with category-subcategory display */}
                    <div className="mb-4">
                        <label htmlFor="category_id" className="block text-sm font-medium mb-1">
                            Category
                        </label>
                        {loading ? (
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                                Loading categories...
                            </div>
                        ) : (
                            <select
                                id="category_id"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.category} - {cat.subcategory}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Display current category/subcategory when editing */}
                    {control && formData.originalCategory && (
                        <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
                            <p>Current category: <span className="font-medium">{formData.originalCategory}</span></p>
                            <p>Current subcategory: <span className="font-medium">{formData.originalSubcategory}</span></p>
                        </div>
                    )}

                    {/* Frequency selector component */}
                    <div className="mb-4">
                        <FrequencySelector
                            value={{
                                type: formData.frequency_type,
                                config: formData.frequency_config
                            }}
                            onChange={(frequencyData) => setFormData({
                                ...formData,
                                frequency_type: frequencyData.type,
                                frequency_config: frequencyData.config
                            })}
                        />
                    </div>

                    {/* Date fields */}
                    <div className="mb-4">
                        <label htmlFor="start_date" className="block text-sm font-medium mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="end_date" className="block text-sm font-medium mb-1">
                            End Date (Optional)
                        </label>
                        <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Description field */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    {/* Active status checkbox */}
                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="mr-2 h-4 w-4"
                            />
                            <span className="text-sm">Active</span>
                        </label>
                    </div>

                    {/* Form buttons */}
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
                            {submitting ? 'Saving...' : (control ? 'Update' : 'Create')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocationControlsPage;