// BackToExperimentSelectionButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackToExperimentSelectionButton: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToExperimentSelection = () => {
        navigate('/experiment-selection');
    };

    return (
        <button 
            onClick={handleBackToExperimentSelection} 
            className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600 shadow-md flex items-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" stroke="currentColor" width="20" height="20" className="mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>  
            Back to Experiment Selection
        </button>
    );
};

export default BackToExperimentSelectionButton;