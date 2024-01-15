// DeviceButton.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const DeviceButton: React.FC = () => {
    return (
        <Link 
            to="/devices"
            className="flex items-start justify-center px-6 py-3 text-stone-200 bg-gradient-to-r from-red-600 to-red-800 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-yellow-600 transition-all duration-300 ease-in-out delay-150 font-medium"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
            Device
        </Link>
    );
};

export default DeviceButton;