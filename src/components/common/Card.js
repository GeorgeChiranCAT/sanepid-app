import React from 'react';

const Card = ({
                  children,
                  title = '',
                  subtitle = '',
                  className = '',
                  titleClassName = '',
                  subtitleClassName = '',
                  bodyClassName = '',
                  footer = null,
                  footerClassName = '',
                  ...props
              }) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm ${className}`} {...props}>
            {(title || subtitle) && (
                <div className="p-4 border-b">
                    {title && <h3 className={`text-lg font-medium ${titleClassName}`}>{title}</h3>}
                    {subtitle && <p className={`text-sm text-gray-500 mt-1 ${subtitleClassName}`}>{subtitle}</p>}
                </div>
            )}
            <div className={`p-4 ${bodyClassName}`}>
                {children}
            </div>
            {footer && (
                <div className={`p-4 border-t ${footerClassName}`}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;