// EditDeviceButton.tsx
import React from 'react';

interface EditButtonProps {
    handleUpdateDevice: (deviceId: number) => void;
    deviceId: number;
}

const EditDeviceButton: React.FC<EditButtonProps> = ({ handleUpdateDevice, deviceId }) => {
    return (
        <button 
            onClick={() => handleUpdateDevice(deviceId)} 
            className="flex items-center m-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-all duration-300"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Device Name
        </button>
    );
};

export default EditDeviceButton;