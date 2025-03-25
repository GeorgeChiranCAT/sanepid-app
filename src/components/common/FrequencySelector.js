// src/components/common/FrequencySelector.js
import React, { useState, useEffect } from 'react';

const FrequencySelector = ({ value, onChange }) => {
    const [frequencyType, setFrequencyType] = useState(
        value?.type || 'weekly'
    );

    const [config, setConfig] = useState(
        value?.config || getDefaultConfig('weekly')
    );

    // Update parent component when selection changes
    useEffect(() => {
        onChange({
            type: frequencyType,
            config: config
        });
    }, [frequencyType, config, onChange]);

    // Get default config based on frequency type
    function getDefaultConfig(type) {
        switch (type) {
            case 'daily':
                return {};
            case 'weekly':
                return { dayOfWeek: 1 }; // Monday
            case 'monthly':
                return { dayOfMonth: 1 };
            case 'yearly':
                return { month: 1, dayOfMonth: 1 };
            case 'custom':
                return { daysOfWeek: [1, 3, 5] }; // Mon, Wed, Fri
            default:
                return {};
        }
    }

    const handleFrequencyTypeChange = (e) => {
        const newType = e.target.value;
        setFrequencyType(newType);
        setConfig(getDefaultConfig(newType));
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Frequency Type</label>
                <select
                    value={frequencyType}
                    onChange={handleFrequencyTypeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="custom">Custom Days</option>
                </select>
            </div>

            {frequencyType === 'weekly' && (
                <div>
                    <label className="block text-sm font-medium mb-1">Day of Week</label>
                    <select
                        value={config.dayOfWeek}
                        onChange={(e) => setConfig({ dayOfWeek: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={0}>Sunday</option>
                        <option value={1}>Monday</option>
                        <option value={2}>Tuesday</option>
                        <option value={3}>Wednesday</option>
                        <option value={4}>Thursday</option>
                        <option value={5}>Friday</option>
                        <option value={6}>Saturday</option>
                    </select>
                </div>
            )}

            {frequencyType === 'monthly' && (
                <div>
                    <label className="block text-sm font-medium mb-1">Day of Month (1-26)</label>
                    <select
                        value={config.dayOfMonth}
                        onChange={(e) => setConfig({ dayOfMonth: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        {Array.from({ length: 26 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
            )}

            {frequencyType === 'yearly' && (
                <>
                    <div>
                        <label className="block text-sm font-medium mb-1">Month</label>
                        <select
                            value={config.month}
                            onChange={(e) => setConfig({ ...config, month: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={1}>January</option>
                            <option value={2}>February</option>
                            <option value={3}>March</option>
                            <option value={4}>April</option>
                            <option value={5}>May</option>
                            <option value={6}>June</option>
                            <option value={7}>July</option>
                            <option value={8}>August</option>
                            <option value={9}>September</option>
                            <option value={10}>October</option>
                            <option value={11}>November</option>
                            <option value={12}>December</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Day of Month</label>
                        <select
                            value={config.dayOfMonth}
                            onChange={(e) => setConfig({ ...config, dayOfMonth: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {frequencyType === 'custom' && (
                <div>
                    <label className="block text-sm font-medium mb-1">Select Days of Week</label>
                    <div className="flex flex-wrap gap-2">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                            <label key={index} className="flex items-center p-2 border rounded">
                                <input
                                    type="checkbox"
                                    checked={config.daysOfWeek?.includes(index) || false}
                                    onChange={(e) => {
                                        const newDays = [...(config.daysOfWeek || [])];
                                        if (e.target.checked) {
                                            if (!newDays.includes(index)) newDays.push(index);
                                        } else {
                                            const dayIndex = newDays.indexOf(index);
                                            if (dayIndex !== -1) newDays.splice(dayIndex, 1);
                                        }
                                        setConfig({ daysOfWeek: newDays });
                                    }}
                                    className="mr-2 h-4 w-4"
                                />
                                {day}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FrequencySelector;