// src/components/layout/MainMenu.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const MainMenu = () => {
    const { user } = useAuth();

    if (!user) return null;

    // Check if user is an admin
    const isAdmin = user.role === 'client_admin' || user.role === 'sanepid_admin' || user.role === 'sanepid_user';

    return (
        <nav className="bg-gray-100 py-2 border-b">
            <div className="container mx-auto">
                <ul className="flex space-x-8">
                    <li>
                        <NavLink
                            to="/controls"
                            className={({ isActive }) =>
                                isActive
                                    ? "font-medium text-blue-600 border-b-2 border-blue-600 pb-2"
                                    : "text-gray-700 hover:text-blue-600"
                            }
                        >
                            Controls
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/reports"
                            className={({ isActive }) =>
                                isActive
                                    ? "font-medium text-blue-600 border-b-2 border-blue-600 pb-2"
                                    : "text-gray-700 hover:text-blue-600"
                            }
                        >
                            Reports
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/documents"
                            className={({ isActive }) =>
                                isActive
                                    ? "font-medium text-blue-600 border-b-2 border-blue-600 pb-2"
                                    : "text-gray-700 hover:text-blue-600"
                            }
                        >
                            Documents
                        </NavLink>
                    </li>
                    {isAdmin && (
                        <li>
                            <NavLink
                                to="/manage-locations"
                                className={({ isActive }) =>
                                    isActive
                                        ? "font-medium text-blue-600 border-b-2 border-blue-600 pb-2"
                                        : "text-gray-700 hover:text-blue-600"
                                }
                            >
                                Manage Locations
                            </NavLink>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default MainMenu;