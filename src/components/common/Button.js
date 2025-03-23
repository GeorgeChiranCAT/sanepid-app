// src/components/common/Button.js
import React from 'react';

const Button = ({
                    children,
                    type = 'button',
                    variant = 'primary',
                    size = 'md',
                    className = '',
                    disabled = false,
                    onClick = () => {},
                    ...props
                }) => {
    // Variant styles
    const variantStyles = {
        primary: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 text-gray-800',
        success: 'bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white',
        danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-white',
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };

    const baseStyles = 'rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return (
        <button
            type={type}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;