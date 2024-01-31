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
                className="flex items-center justify-center px-6 py-3 text-stone-200 bg-gradient-to-r from-green-600 to-green-800 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-green-600 transition-all duration-300 ease-in-out delay-150 font-medium"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                Start Measurement
            </button>
            {isCollecting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="animate-spin mr-3">
                            {/* Replace with your actual loading spinner */}
                            Loading...
                        </div>
                        <p>Collecting Data...</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default StartMeasurementButton;