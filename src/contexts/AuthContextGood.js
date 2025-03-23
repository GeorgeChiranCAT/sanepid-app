import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on page load
        const checkLoggedIn = async () => {
            try {
                const userData = await authService.getCurrentUser();
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
        setLoading(true);
        try {
            const userData = await authService.login(email, password, location);
            setUser(userData);
            return userData;
        } catch (error) {
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
        try {
            await authService.logout();
            setUser(null);
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
