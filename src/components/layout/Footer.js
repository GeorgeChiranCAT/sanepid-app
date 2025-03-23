import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 py-4 mt-auto">
            <div className="container mx-auto text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Sanepid App. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;