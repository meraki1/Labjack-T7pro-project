// StartMeasurementButton.tsx
import React, { useState } from 'react';

interface StartMeasurementButtonProps {
    onClick: () => Promise<boolean>; 
}

const StartMeasurementButton: React.FC<StartMeasurementButtonProps> = ({ onClick }) => {
    const [isCollecting, setIsCollecting] = useState(false);
    const [message, setMessage] = useState('');

    const handleClick = async () => {
        setIsCollecting(true);
        try {
            const success = await onClick(); 
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
                className="relative flex items-center justify-center px-6 py-2 bg-gradient-to-r from-red-600 to-red-800 rounded-lg text-white font-semibold shadow-md hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                disabled={isCollecting} // Disable the button while collecting data
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className={`h-6 w-6 mr-2 ${isCollecting ? 'text-transparent' : 'text-white'}`}>
                    <path d="M224 32C106 32 0 64.3 0 101.3v309.3C0 447.7 106 480 224 480s224-32.3 224-69.3V101.3C448 64.3 342 32 224 32zm192 378.7c0 10.7-64 37.3-192 37.3S32 421.3 32 410.7V384c71.4 21.4 148.6 32 192 32s120.6-10.6 192-32v26.7zm0-69.3c0 10.7-64 37.3-192 37.3S32 352 32 341.3v-96c71.4 21.4 148.6 32 192 32s120.6-10.6 192-32v96zm0-128c0 10.7-64 37.3-192 37.3S32 224 32 213.3v-96C103.4 138.7 180.6 149.3 224 149.3s120.6-10.6 192-32v96z"/>
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