// StartExperimentButton.tsx
import React from 'react';
import Link from 'next/link';

export default function StartExperimentButton() {
    return (
        <Link href="/PreExperimentView" legacyBehavior>
            <a className="flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 transition-all duration-300 ease-in-out delay-150">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                Start Experiment
            </a>
        </Link>
    );
}