// StartMeasurementButton.tsx
import React, { useState } from 'react';
import '../index.css';

interface StartMeasurementButtonProps {
    onClick: () => void;
}

const StartMeasurementButton: React.FC<StartMeasurementButtonProps> = ({ onClick }) => {
    const [isCollecting, setIsCollecting] = useState(false);

    const handleClick = () => {
        setIsCollecting(true);
        onClick();
        // After data collection is done, set isCollecting back to false
        // This is just a placeholder, replace it with your actual data collection logic
        setTimeout(() => {
            setIsCollecting(false);
        }, 5000);
    };

    return (
        <>
            <button 
                onClick={handleClick}
                className="relative flex items-center justify-center px-7 py-3 bg-gradient-to-r from-red-600 to-red-800 rounded-lg text-white font-medium shadow-md hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`h-6 w-6 mr-2 ${isCollecting ? 'text-transparent' : 'text-white'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                {isCollecting ? 'Collecting Data...' : 'Start Measurement'}
                {isCollecting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-12 h-12 border-t-4 border-b-4 border-red-500 rounded-full animate-spin"></div>
                    </div>
                )}
            </button>
        </>
    );
}

export default StartMeasurementButton;