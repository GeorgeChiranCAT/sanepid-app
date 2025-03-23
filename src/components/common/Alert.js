import React from 'react';

const Alert = ({
                   children,
                   type = 'info',
                   title = '',
                   className = '',
                   onClose = null,
                   ...props
               }) => {
    // Alert type styles
    const alertStyles = {
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        success: 'bg-green-50 text-green-800 border-green-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        error: 'bg-red-50 text-red-800 border-red-200',
    };

    return (
        <div
            className={`border rounded-md p-4 ${alertStyles[type]} ${className}`}
            role="alert"
            {...props}
        >
            {title && <div className="font-medium mb-1">{title}</div>}
            <div className="flex items-start">
                <div className="flex-grow">{children}</div>
                {onClose && (
                    <button
                        type="button"
                        className="ml-3 -mt-1 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;