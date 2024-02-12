// StartMeasurementButton.tsx

import React, { useState } from 'react';

interface StartMeasurementButtonProps {
    onClick: () => Promise<boolean>; // Change the type of onClick to return a Promise<boolean>
}

const StartMeasurementButton: React.FC<StartMeasurementButtonProps> = ({ onClick }) => {
    const [isCollecting, setIsCollecting] = useState(false);
    const [message, setMessage] = useState('');

    const handleClick = async () => {
        setIsCollecting(true);
        try {
            const success = await onClick(); // Wait for onClick to complete
            if (success) {
                setMessage('Data collected successfully');
            } else {
                setMessage('Failed to collect experiment data');
            }
        } catch (error) {
            setMessage(`Error: ${error}`);
        } finally {
            setIsCollecting(false);
        }
    };

    return (
        <>
            <button
                onClick={handleClick}
                className="relative flex items-center justify-center px-7 py-3 bg-gradient-to-r from-red-600 to-red-800 rounded-lg text-white font-semibold shadow-md hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                disabled={isCollecting} // Disable the button while collecting data
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    className={`h-6 w-6 mr-2 ${isCollecting ? 'text-transparent' : 'text-white'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-lg">{isCollecting ? 'Collecting Data...' : 'Start Measurement'}</span>
                {isCollecting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 font-semibold">
                        <div className="w-12 h-12 border-t-4 border-b-4 border-red-500 rounded-full animate-spin"></div>
                    </div>
                )}
            </button>
            {message && (
                <div className={`ml-4 mb-1 mt-1 p-2 text-lg font-semibold rounded-lg shadow-md ${message.includes('Error') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {message}
                </div>
            )}
        </>
    );
}

export default StartMeasurementButton;