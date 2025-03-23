import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const OnboardingPage = () => {
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            const userData = {
                email,
                password,
                location,
                // The role would typically be determined by the onboarding link/token
                role: 'client_user'
            };

            await register(userData);
            toast.success('Registration successful! You can now log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error || 'Registration failed. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Sanepid App</h1>
                    <p className="text-gray-600">Complete your registration</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2">
                            Location (Service Point)
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

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
                            minLength="8"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            minLength="8"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? 'Registering...' : 'Complete Registration'}
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default OnboardingPage;