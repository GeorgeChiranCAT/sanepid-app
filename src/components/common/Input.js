import React from 'react';

const Input = ({
                   id,
                   label = '',
                   type = 'text',
                   error = '',
                   className = '',
                   labelClassName = '',
                   inputClassName = '',
                   errorClassName = '',
                   helperText = '',
                   helperTextClassName = '',
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
            <input
                id={id}
                type={type}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    error ? 'border-red-300' : 'border-gray-300'
                } ${inputClassName}`}
                {...props}
            />
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

export default Input;