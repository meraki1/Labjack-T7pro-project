// SaveDeviceInfoButton.tsx
import React from 'react';

interface SaveDeviceInfoButtonProps {
    handleSaveDeviceInfo: () => void;
}

const SaveDeviceInfoButton: React.FC<SaveDeviceInfoButtonProps> = ({ handleSaveDeviceInfo }) => {
    return (
        <button
            onClick={handleSaveDeviceInfo} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-md flex items-center"
        >
            <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="1em" height="1em" className="mr-2">
                <path fill="currentColor" d="M320.5 372.7c-11.3 0-20.5-9.2-20.5-20.5v-85.7h-85.7c-11.3 0-20.5-9.2-20.5-20.5s9.2-20.5 20.5-20.5h85.7v-85.7c0-11.3 9.2-20.5 20.5-20.5s20.5 9.2 20.5 20.5v85.7h85.7c11.3 0 20.5 9.2 20.5 20.5s-9.2 20.5-20.5 20.5h-85.7v85.7c0 11.3-9.2 20.5-20.5 20.5zm309.5 99.8c0 22.2-18 40.5-40.5 40.5H50.5c-22.2 0-40.5-18-40.5-40.5V273c0-22.2 18-40.5 40.5-40.5h30.7c11.3 0 20.5 9.2 20.5 20.5s-9.2 20.5-20.5 20.5h-30.7c-5.5 0-10 4.5-10 10v199.5c0 5.5 4.5 10 10 10h539c5.5 0 10-4.5 10-10V273c0-5.5-4.5-10-10-10h-30.7c-11.3 0-20.5-9.2-20.5-20.5s9.2-20.5 20.5-20.5h30.7c22.5 0 40.5 18 40.5 40.5v199.5z"/>
            </svg>
            Save Device Info
        </button>
    );
};

export default SaveDeviceInfoButton;