// src/pages/HomePage.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // If not logged in, redirect to login page
    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Not logged in</h1>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-blue-700">
                        <strong>Role:</strong> {user.role}
                    </p>
                    <p className="text-blue-700">
                        <strong>Email:</strong> {user.email}
                    </p>
                    {user.location && (
                        <p className="text-blue-700">
                            <strong>Location:</strong> {user.location.name}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Mock Data Status</h2>
                    <p>
                        Using mock data: <strong>{window.appConfig?.useMockData ? 'Yes' : 'No'}</strong>
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Application Pages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-100 p-4 rounded">Controls</div>
                        <div className="bg-gray-100 p-4 rounded">Reports</div>
                        <div className="bg-gray-100 p-4 rounded">Documents</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;