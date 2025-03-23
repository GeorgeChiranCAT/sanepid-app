// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create and export the context
export const AuthContext = createContext();

// Helper function to check if mock data should be used
const isMockDataEnabled = () => {
    return localStorage.getItem('useMockData') === 'true' ||
        process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
        (window.appConfig && window.appConfig.useMockData);
};

// Create and export the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on page load
        const checkLoggedIn = async () => {
            console.log("Checking if user is logged in...");
            try {
                const userData = await authService.getCurrentUser();
                console.log("Current user data:", userData);
                setUser(userData);
            } catch (error) {
                console.error('Error checking authentication status:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password, location) => {
        console.log("AuthContext login with:", email, password, location);
        setLoading(true);
        try {
            const userData = await authService.login(email, password, location);
            console.log("Login successful, user data:", userData);
            setUser(userData);
            return userData;
        } catch (error) {
            console.error("Login error in AuthContext:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const newUser = await authService.register(userData);
            return newUser;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        console.log('Logout initiated');
        try {
            // Call the backend logout endpoint if not using mock data
            if (!isMockDataEnabled()) {
                try {
                    // Optional: You can call a backend logout endpoint if you have one
                    // await api.post('/auth/logout');
                } catch (logoutError) {
                    console.error('Error during backend logout:', logoutError);
                    // Continue with local logout even if backend fails
                }
            }

            // Always clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Update auth context state
            setUser(null);
            console.log('Logout successful');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};