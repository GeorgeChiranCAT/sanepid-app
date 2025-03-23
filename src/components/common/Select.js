import React from 'react';

const Select = ({
                    id,
                    label = '',
                    options = [],
                    error = '',
                    className = '',
                    labelClassName = '',
                    selectClassName = '',
                    errorClassName = '',
                    helperText = '',
                    helperTextClassName = '',
                    placeholder = 'Select an option',
                    ...props
                }) => {
    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
                >
                    {label}
                </label>
            )}
            <select
                id={id}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    error ? 'border-red-300' : 'border-gray-300'
                } ${selectClassName}`}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {helperText && !error && (
                <p className={`mt-1 text-sm text-gray-500 ${helperTextClassName}`}>
                    {helperText}
                </p>
            )}
            {error && (
                <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;