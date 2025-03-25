// src/pages/CategoriesPage.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import categoriesService from '../services/categoriesService';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await categoriesService.getCategories();
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleAddCategory = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoriesService.deleteCategory(categoryId);
                setCategories(prevCategories =>
                    prevCategories.filter(cat => cat.id !== categoryId)
                );
                toast.success('Category deleted successfully');
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Failed to delete category');
            }
        }
    };

    const handleSaveCategory = async (categoryData) => {
        try {
            let result;
            if (editingCategory) {
                // Update existing category
                result = await categoriesService.updateCategory(
                    editingCategory.id,
                    categoryData
                );
                setCategories(prevCategories =>
                    prevCategories.map(cat =>
                        cat.id === result.id ? result : cat
                    )
                );
                toast.success('Category updated successfully');
            } else {
                // Create new category
                result = await categoriesService.createCategory(categoryData);
                setCategories(prevCategories => [...prevCategories, result]);
                toast.success('Category created successfully');
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category');
        }
    };

    const columns = [
        {
            header: 'Category',
            accessor: 'category',
        },
        {
            header: 'Subcategory',
            accessor: 'subcategory',
        },
        {
            header: 'Description',
            accessor: 'description',
        },
        {
            header: 'Actions',
            accessor: 'id',
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditCategory(row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteCategory(row.id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    if (loading) {
        return <div className="flex justify-center py-10">Loading categories...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button onClick={handleAddCategory}>
                    Add New Category
                </Button>
            </div>

            <Card>
                {categories.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        No categories found. Click "Add New Category" to create one.
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={categories}
                        emptyMessage="No categories found."
                    />
                )}
            </Card>

            {showModal && (
                <CategoryFormModal
                    category={editingCategory}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveCategory}
                />
            )}
        </div>
    );
};

// Category Form Modal Component
const CategoryFormModal = ({ category, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        category: category?.category || '',
        subcategory: category?.subcategory || '',
        description: category?.description || ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.category.trim() || !formData.subcategory.trim()) {
            toast.error('Category and subcategory are required');
            return;
        }

        setSubmitting(true);

        try {
            await onSave(formData);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                    {category ? 'Edit Category' : 'Add New Category'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="subcategory" className="block text-sm font-medium mb-1">
                            Subcategory
                        </label>
                        <input
                            type="text"
                            id="subcategory"
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

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
                            {submitting ? 'Saving...' : (category ? 'Update' : 'Create')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoriesPage;