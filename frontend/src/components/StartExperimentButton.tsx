// StartExperimentButton.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const StartExperimentButton: React.FC = () => {
    return (
        <Link 
            to="/pre-experiment"
            className="flex items-center justify-center px-6 py-4 text-stone-200 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-full hover:-translate-y-1 hover:scale-110 transition-all duration-300 ease-in-out delay-150 font-medium"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="h-4 w-4 mr-2">
                <path d="M424.4 214.7L72.4 7.7C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 40.3l352-207c31.4-18.5 31.5-64.1 .4-82.6z"/>
            </svg>
            Start experiment
        </Link>
    );
};

export default StartExperimentButton;
