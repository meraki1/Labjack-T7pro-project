// ViewDetailsButton.tsx
import React from 'react';

interface ViewDetailsButtonProps {
    onClick: () => void;
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-5 w-5 mr-2">
                <path d="M12 320h48v192H12zm92-64h48v256h-48zm92-128h48v384h-48zm92-192h48v576h-48zm92 96h48v480h-48zm92 96h48v384h-48zm92 64h48v320h-48z"/>
            </svg>
            View Details
        </button>
    );
};

export default ViewDetailsButton;
