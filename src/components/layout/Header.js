// src/components/layout/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate here
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        // Redirect to login page after logout
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="text-xl font-bold text-blue-600">
                        Sanepid App
                    </Link>
                </div>
                <div>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;