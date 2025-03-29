// src/pages/ReportsPage.js


import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import reportsService from '../services/reportsService';
import locationsService from '../services/locationsService'; // Make sure this is imported


const ReportsPage = () => {
    const { user } = useAuth();

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedLocation, setSelectedLocation] = useState('');
    const [locations, setLocations] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingLocations, setLoadingLocations] = useState(true); // Add this state

    // Generate array of months for the dropdown
    const months = [
        { value: 0, label: 'January' },
        { value: 1, label: 'February' },
        { value: 2, label: 'March' },
        { value: 3, label: 'April' },
        { value: 4, label: 'May' },
        { value: 5, label: 'June' },
        { value: 6, label: 'July' },
        { value: 7, label: 'August' },
        { value: 8, label: 'September' },
        { value: 9, label: 'October' },
        { value: 10, label: 'November' },
        { value: 11, label: 'December' }
    ];

    // Generate array of years for the dropdown
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    useEffect(() => {
        // Add a safeguard in case user isn't available yet
        if (!user) {
            setLoading(false);
            return;
        }

        // For admin users, fetch available locations
        if (user && (user.role === 'client_admin' || user.role === 'sanepid_admin' || user.role === 'sanepid_user')) {
            const fetchLocations = async () => {
                setLoadingLocations(true);
                try {
                    // This always tries to get locations from the real API
                    const data = await locationsService.getLocations();
                    setLocations(data);
                    // Only set a default location if one isn't already selected
                    if (data.length > 0 && !selectedLocation) {
                        setSelectedLocation(data[0].id);
                    }
                } catch (error) {
                    console.error('Error fetching locations:', error);
                    toast.error('Failed to fetch locations');
                } finally {
                    setLoadingLocations(false);
                }
            };

            fetchLocations();
        } else if (user && user.location) {
            // For regular users, set their assigned location
            setSelectedLocation(user.location.id);
            setLoadingLocations(false);
        }
    }, [user, selectedLocation]);

    useEffect(() => {
        const fetchReports = async () => {
            // Add more safeguards to prevent unnecessary fetching
            if (!user || (user.role === 'client_admin' && !selectedLocation)) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const locationId = user.role === 'client_user' ? user.location?.id : selectedLocation;
                // Only fetch if we have a valid locationId
                if (locationId) {
                    const data = await reportsService.getReports(selectedMonth + 1, selectedYear, locationId);
                    setReports(data || []);
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
                toast.error('Failed to fetch reports');
                setReports([]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchReports();
        }
    }, [selectedMonth, selectedYear, selectedLocation, user]);

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
    };

    // Get the days in the selected month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Function to determine status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'missed':
                return 'bg-red-500';
            case 'pending':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-300';
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center py-10">
                Please log in to view reports.
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Reports</h1>

            <div className="flex flex-wrap gap-4 mb-6">
                <div className="w-full md:w-auto">
                    <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                    </label>
                    <select
                        id="month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        {months.map(month => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full md:w-auto">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                    </label>
                    <select
                        id="year"
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location dropdown for admin users */}
                {user && (user.role === 'client_admin' || user.role === 'sanepid_admin' || user.role === 'sanepid_user') && (
                    <div className="w-full md:w-auto">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        {loadingLocations ? (
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                                Loading locations...
                            </div>
                        ) : (
                            <select
                                id="location"
                                value={selectedLocation}
                                onChange={handleLocationChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="" disabled>Select a location</option>
                                {locations.map(location => {
                                    console.log('Rendering location:', location);
                                    return (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-10">Loading reports...</div>
            ) : reports && reports.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Control</th>
                            {daysArray.map(day => (
                                <th key={day} className="border border-gray-300 px-3 py-2 text-center">
                                    {day}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(
                            reports.reduce((acc, control) => {
                                if (!acc[control.category]) {
                                    acc[control.category] = [];
                                }
                                acc[control.category].push(control);
                                return acc;
                            }, {})
                        ).map(([category, controls]) => (
                            <React.Fragment key={category}>
                                <tr className="bg-gray-50">
                                    <td colSpan={daysInMonth + 1} className="border border-gray-300 px-4 py-2 font-medium">
                                        {category}
                                    </td>
                                </tr>
                                {controls.map(control => (
                                    <tr key={control.id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {control.name}
                                        </td>
                                        {daysArray.map(day => {
                                            const date = new Date(selectedYear, selectedMonth, day);
                                            const controlDay = control.days?.find(d =>
                                                new Date(d.date).getDate() === day
                                            );
                                            const status = controlDay?.status || 'not-required';

                                            let tooltipContent = `Status: ${status}`;
                                            if (status === 'completed' && controlDay?.measurements) {
                                                tooltipContent += ` - Measurements: ${
                                                    typeof controlDay.measurements === 'object'
                                                        ? Object.entries(controlDay.measurements)
                                                            .map(([key, value]) => `${key}: ${value}`)
                                                            .join(', ')
                                                        : controlDay.measurements
                                                }`;
                                            } else if (status === 'missed') {
                                                tooltipContent += ` - Reason: ${controlDay.reason || 'Not specified'}`;
                                            }

                                            return (
                                                <td
                                                    key={day}
                                                    className="border border-gray-300 p-1 text-center"
                                                >
                                                    <div
                                                        className={`w-4 h-4 mx-auto rounded-full ${getStatusColor(status)}`}
                                                        title={tooltipContent}
                                                    ></div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-gray-500 text-center py-8">
                    No reports available for the selected period.
                </div>
            )}
        </div>
    );
};

export default ReportsPage;