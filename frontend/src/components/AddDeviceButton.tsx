// AddDeviceButton.tsx
import React from 'react';

interface AddDeviceButtonProps {
    handleAddDevice: () => void;
}

const AddDeviceButton: React.FC<AddDeviceButtonProps> = ({ handleAddDevice }) => {
    return (
        <button 
            onClick={handleAddDevice} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
            <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" className="mr-2">
                <path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/>
            </svg>
            Add Device
        </button>
    );
};

export default AddDeviceButton;
