// Navbar.tsx
import React from 'react';

const Navbar: React.FC = () => {
    return (
        <div className="bg-orange-700 text-stone-200 top-0 py-2 flex justify-between w-full px-6 shadow-lg">
            <h1 className="text-lg font-semibold">Data Collecting Experiments</h1>
            <ul className="flex gap-10 text-m">
                <li><a href="/devices" className="px-2 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg hover:bg-orange-200 focus:bg-orange-200 focus:outline-none focus:shadow-outline hover:text-cyan-950 transition-all duration-300 ease-in-out delay-150">Devices</a></li>
                <li><a href="/set-up-device" className="px-2 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg hover:bg-orange-200 focus:bg-orange-200 focus:outline-none focus:shadow-outline hover:text-cyan-950 transition-all duration-300 ease-in-out delay-150">Set up Device</a></li>
                <li><a href="/experiment-selection" className="px-2 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg hover:bg-orange-200 focus:bg-orange-200 focus:outline-none focus:shadow-outline hover:text-cyan-950 transition-all duration-300 ease-in-out delay-150">View Experiment Results</a></li>
            </ul>
        </div>
    );
};

export default Navbar;