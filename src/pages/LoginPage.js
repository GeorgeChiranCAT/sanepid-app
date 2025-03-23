// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDemo, setShowDemo] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If already logged in, redirect to home
        if (user) {
            navigate('/');
        }

        // Check if using mock data
        const isMockData = localStorage.getItem('useMockData') === 'true' ||
            (window.appConfig && window.appConfig.useMockData);
        setShowDemo(isMockData);
    }, [user, navigate]);

    // src/pages/LoginPage.js - update the handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log("Login form submitted with:", {email, password, location});

            // Set mock data to false to use real API
            localStorage.setItem('useMockData', 'false');
            if (window.appConfig) {
                window.appConfig.useMockData = false;
            }

            await login(email, password, location);
            toast.success('Login successful');
            navigate('/');
        } catch (error) {
            console.error("Login error:", error);
            toast.error('Invalid email or password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDemoLogin = async (userType) => {
        setIsSubmitting(true);

        try {
            let credentials = {};

            switch (userType) {
                case 'client_user':
                    credentials = { email: 'john@example.com', password: 'password' };
                    setEmail('john@example.com');
                    setPassword('password');
                    break;
                case 'client_admin':
                    credentials = { email: 'jane@example.com', password: 'password' };
                    setEmail('jane@example.com');
                    setPassword('password');
                    break;
                case 'sanepid_user':
                    credentials = { email: 'robert@example.com', password: 'password' };
                    setEmail('robert@example.com');
                    setPassword('password');
                    break;
                default:
                    credentials = { email: 'john@example.com', password: 'password' };
                    setEmail('john@example.com');
                    setPassword('password');
            }

            await login(credentials.email, credentials.password, '');
            toast.success(`Demo login successful as ${userType}`);
            navigate('/');
        } catch (error) {
            console.error("Demo login error:", error);
            toast.error('Demo login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Sanepid App</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2">
                            Location (required for Client Users)
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Signing in...
    </span>
                        ) : 'Sign In'}
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/onboarding" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>

                {/* Demo login section */}
                {showDemo && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Login Options</h3>
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('client_user')}
                                disabled={isSubmitting}
                                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
                            >
                                Login as Client User
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('client_admin')}
                                disabled={isSubmitting}
                                className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm"
                            >
                                Login as Client Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('sanepid_user')}
                                disabled={isSubmitting}
                                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 text-sm"
                            >
                                Login as Sanepid User
                            </button>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                            <p>Demo credentials:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>Client User: john@example.com / password</li>
                                <li>Client Admin: jane@example.com / password</li>
                                <li>Sanepid User: robert@example.com / password</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;