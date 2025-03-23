// src/components/layout/Layout.js
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from './Header';
import MainMenu from './MainMenu';
import Footer from './Footer';

const Layout = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading state
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <MainMenu />
            <main className="container mx-auto py-6 px-4 flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;