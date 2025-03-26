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
import categoriesService from '../services/categoriesService';
import categoryDetailsService from '../services/categoryDetailsService';

const LocationControlsPage = () => {
    const { locationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [location, setLocation] = useState(null);
    const [controls, setControls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingControl, setEditingControl] = useState(null);
    const [frequencyOptions, setFrequencyOptions] = useState([]);
    const [frequencyDetailsSchema, setFrequencyDetailsSchema] = useState({});

    // Check if user is authorized
    const isAdmin = user && (user.role === 'client_admin' || user.role === 'sanepid_admin' || user.role === 'sanepid_user');

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
                const processedControls = Array.isArray(controlsData)
                    ? controlsData.map(control => ({
                        ...control,
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
    // State for categories and subcategories
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
    const [categoryDetails, setCategoryDetails] = useState([]);
    const [categoryDetailsLoading, setCategoryDetailsLoading] = useState(false);
    const [frequencyOptions, setFrequencyOptions] = useState([]);
    const [frequencyDetailsSchema, setFrequencyDetailsSchema] = useState({});

    // Initial form data
    const [formData, setFormData] = useState({
        name: control?.name || '',
        selectedCategory: control?.category || '',
        category_id: control?.category_id || '',
        frequency_type: control?.frequency_type || 'weekly',
        frequency_config: control?.frequency_config || { dayOfWeek: 1 },
        start_date: control?.start_date || new Date().toISOString().split('T')[0],
        end_date: control?.end_date || '',
        is_active: control?.is_active ?? true,
        description: control?.description || '',
        categoryValues: {}
    });

    const [submitting, setSubmitting] = useState(false);

    // Fetch categories when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const data = await categoriesService.getCategories();
                setCategories(Array.isArray(data) ? data : []);

                // If editing and we have a selected category, fetch subcategories
                if (control?.category) {
                    setSubcategoriesLoading(true);
                    const subcats = await categoriesService.getSubcategories(control.category);
                    setSubcategories(Array.isArray(subcats) ? subcats : []);
                    setSubcategoriesLoading(false);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Fallback to hardcoded categories for now
                setCategories([
                    { category: 'Temperature Control' },
                    { category: 'Hygiene' },
                    { category: 'Production' },
                    { category: 'Annual' }
                ]);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, [control]);


    // useEffect to load category details when a category is selected
    useEffect(() => {
        const fetchCategoryDetails = async () => {
            if (!formData.category_id) return;

            try {
                setCategoryDetailsLoading(true);
                const details = await categoryDetailsService.getCategoryDetails(formData.category_id);
                setCategoryDetails(details);

                // Extract frequency options and schema if available
                const recordWithFrequency = details.find(d => d.frequency_options);
                if (recordWithFrequency) {
                    setFrequencyOptions(recordWithFrequency.frequency_options || []);
                    setFrequencyDetailsSchema(recordWithFrequency.frequency_details_schema || {});
                }

                // Initialize form values
                const defaultValues = {};
                if (Array.isArray(details)) {
                    details.forEach(field => {
                        if (field.field_name && field.default_value !== undefined) {
                            defaultValues[field.field_name] = field.default_value || '';
                        }
                    });
                }

                setFormData(prev => ({
                    ...prev,
                    categoryValues: defaultValues
                }));
            } catch (error) {
                console.error('Error fetching category details:', error);
                setCategoryDetails([]);
            } finally {
                setCategoryDetailsLoading(false);
            }
        };

        fetchCategoryDetails();
    }, [formData.category_id]);

    // Fetch subcategories when selected category changes
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!formData.selectedCategory) {
                setSubcategories([]);
                return;
            }

            try {
                setSubcategoriesLoading(true);
                const data = await categoriesService.getSubcategories(formData.selectedCategory);
                setSubcategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                // Fallback
                if (formData.selectedCategory === 'Temperature Control') {
                    setSubcategories([
                        { id: '1', subcategory: 'Refrigerator' },
                        { id: '2', subcategory: 'Freezer' }
                    ]);
                } else {
                    setSubcategories([]);
                }
            } finally {
                setSubcategoriesLoading(false);
            }
        };

        fetchSubcategories();
    }, [formData.selectedCategory]);

    // General form field handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'selectedCategory') {
            setFormData(prev => ({
                ...prev,
                selectedCategory: value,
                category_id: '' // Reset subcategory when category changes
            }));
        } else if (name === 'frequency_type') {
            // Handle frequency type changes
            setFormData(prev => ({
                ...prev,
                frequency_type: value,
                frequency_config: {} // Reset config when frequency type changes
            }));
        } else {
            // Handle all other regular form fields
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };



// Handle category-specific field values
    const handleCategoryFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            categoryValues: {
                ...prev.categoryValues,
                [name]: fieldValue
            }
        }));
    };

    const handleFrequencyTypeChange = (e) => {
        const newFrequencyType = e.target.value;

        setFormData(prev => ({
            ...prev,
            frequency_type: newFrequencyType,
            frequency_config: {} // Reset config when frequency type changes
        }));
    };

    const handleFrequencyFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            frequency_config: {
                ...prev.frequency_config,
                [name]: fieldValue
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name?.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!formData.category_id) {
            toast.error('Category and subcategory are required');
            return;
        }

        setSubmitting(true);

        try {
            // Remove temporary fields before saving
            const apiData = {...formData};
            delete apiData.selectedCategory;
            delete apiData.categoryValues;

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
                    {/* Name field */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Control Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Category dropdown */}
                    <div className="mb-4">
                        <label htmlFor="selectedCategory" className="block text-sm font-medium mb-1">
                            Category
                        </label>
                        {categoriesLoading ? (
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                                Loading categories...
                            </div>
                        ) : (
                            <select
                                id="selectedCategory"
                                name="selectedCategory"
                                value={formData.selectedCategory}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map((cat, idx) => (
                                    <option key={idx} value={cat.category}>
                                        {cat.category}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>



                    {/* Subcategory dropdown - only shown when a category is selected */}
                    {formData.selectedCategory && (
                        <div className="mb-4">
                            <label htmlFor="category_id" className="block text-sm font-medium mb-1">
                                Subcategory
                            </label>
                            {subcategoriesLoading ? (
                                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                                    Loading subcategories...
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
                                    <option value="" disabled>Select a subcategory</option>
                                    {subcategories.map(subcat => (
                                        <option key={subcat.id} value={subcat.id}>
                                            {subcat.subcategory}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {/* Frequency selector - Add this after category selection */}
                    {frequencyOptions && frequencyOptions.length > 0 && (
                        <div className="mb-4">
                            <label htmlFor="frequency_type" className="block text-sm font-medium mb-1">
                                Frequency
                            </label>
                            <select
                                id="frequency_type"
                                name="frequency_type"
                                value={formData.frequency_type}
                                onChange={handleFrequencyTypeChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>Select frequency</option>
                                {frequencyOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Frequency-specific fields */}
                    {formData.frequency_type &&
                        frequencyDetailsSchema &&
                        frequencyDetailsSchema[formData.frequency_type] &&
                        frequencyDetailsSchema[formData.frequency_type].fields &&
                        frequencyDetailsSchema[formData.frequency_type].fields.length > 0 && (
                            <div className="mb-4 pl-4 border-l-2 border-blue-200">
                                <h4 className="text-sm font-medium mb-2 text-blue-600">Frequency Details</h4>

                                {frequencyDetailsSchema[formData.frequency_type].fields.map(field => (
                                    <div key={field.name} className="mb-3">
                                        <label htmlFor={field.name} className="block text-sm font-medium mb-1">
                                            {field.label}
                                        </label>

                                        {field.type === 'select' && (
                                            <select
                                                id={field.name}
                                                name={field.name}
                                                value={formData.frequency_config[field.name] || ''}
                                                onChange={handleFrequencyFieldChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select {field.label}</option>
                                                {field.options && field.options.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {field.type === 'multiselect' && (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {field.options && field.options.map(option => (
                                                    <label key={option.value} className="flex items-center p-2 border rounded">
                                                        <input
                                                            type="checkbox"
                                                            name={`${field.name}_${option.value}`}
                                                            checked={formData.frequency_config[field.name]?.includes(option.value) || false}
                                                            onChange={(e) => {
                                                                const currentValues = formData.frequency_config[field.name] || [];
                                                                let newValues;

                                                                if (e.target.checked) {
                                                                    // Add value
                                                                    newValues = [...currentValues, option.value];
                                                                } else {
                                                                    // Remove value
                                                                    newValues = currentValues.filter(v => v !== option.value);
                                                                }

                                                                handleFrequencyFieldChange({
                                                                    target: {
                                                                        name: field.name,
                                                                        value: newValues
                                                                    }
                                                                });
                                                            }}
                                                            className="mr-2 h-4 w-4"
                                                        />
                                                        <span className="text-sm">{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}





                    {/* Frequency selector component
                    <div className="mb-4">
                        <FrequencySelector
                            value={{
                                type: formData.frequency_type,
                                config: formData.frequency_config
                            }}
                            onChange={handleFrequencyChange}
                        />
                    </div> */}

                    {/* Date fields */}
                    <div className="mb-4">
                        <label htmlFor="start_date" className="block text-sm font-medium mb-1">
                            Start Date for the control
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




                    {/* Active status checkbox */}

                    {/*   <div className="mb-6">
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
                    </div>   */}

                    {/* INSERT DYNAMIC FORM FIELDS HERE */}
                    {categoryDetails.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-lg font-medium mb-3">Category Configuration</h3>

                            {categoryDetailsLoading ? (
                                <p>Loading configuration fields...</p>
                            ) : (
                                <div className="space-y-4">
                                    {categoryDetails.map(field => (
                                        <div key={field.id} className="mb-3">
                                            <label htmlFor={field.field_name} className="block text-sm font-medium mb-1">
                                                {field.field_label}
                                                {field.is_required && <span className="text-red-500 ml-1">*</span>}
                                            </label>

                                            {field.help_text && (
                                                <p className="text-xs text-gray-500 mb-1">{field.help_text}</p>
                                            )}

                                            {field.field_type === 'text' && (
                                                <input
                                                    type="text"
                                                    id={field.field_name}
                                                    name={field.field_name}
                                                    value={formData.categoryValues?.[field.field_name] || ''}
                                                    onChange={handleCategoryFieldChange}
                                                    required={field.is_required}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            )}

                                            {field.field_type === 'number' && (
                                                <input
                                                    type="number"
                                                    id={field.field_name}
                                                    name={field.field_name}
                                                    value={formData.categoryValues?.[field.field_name] || ''}
                                                    onChange={handleCategoryFieldChange}
                                                    required={field.is_required}
                                                    min={field.validation_rules?.min}
                                                    max={field.validation_rules?.max}
                                                    step={field.validation_rules?.step || 1}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            )}

                                            {field.field_type === 'select' && (
                                                <select
                                                    id={field.field_name}
                                                    name={field.field_name}
                                                    value={formData.categoryValues?.[field.field_name] || ''}
                                                    onChange={handleCategoryFieldChange}
                                                    required={field.is_required}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Select {field.field_label}</option>
                                                    {Array.isArray(field.allowed_values) && field.allowed_values.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            )}

                                            {field.field_type === 'checkbox' && (
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={field.field_name}
                                                        name={field.field_name}
                                                        checked={formData.categoryValues?.[field.field_name] === 'true' || formData.categoryValues?.[field.field_name] === true}
                                                        onChange={handleCategoryFieldChange}
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    <span className="text-sm">Yes</span>
                                                </label>
                                            )}

                                            {field.field_type === 'textarea' && (
                                                <textarea
                                                    id={field.field_name}
                                                    name={field.field_name}
                                                    value={formData.categoryValues?.[field.field_name] || ''}
                                                    onChange={handleCategoryFieldChange}
                                                    required={field.is_required}
                                                    rows="3"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                ></textarea>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}


                    {/* Form buttons */}
                    <div className="flex justify-end space-x-3">
                        {/* ... */}
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




