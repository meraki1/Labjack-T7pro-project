// PreExperimentView.tsx
import { useEffect, useState } from 'react';
import '../../index.css';

export default function PreExperimentView() {
    const [experimentNumber, setExperimentNumber] = useState<number | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/experiment_number/')
            .then(response => response.json())
            .then(data => setExperimentNumber(data.experimentNumber))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="flex flex-col items-start justify-start min-h-screen bg-gradient-to-b from-cyan-950 via-cyan-800 to-sky-950 text-stone-200 mb-8 p-4 shadow-md">
            <h1 className="text-4xl mb-4 text-stone-200 font-sans">Labjack T7 Pro Experiment</h1>
            {experimentNumber !== null && <h2 className="text-stone-200">Experiment number: {experimentNumber}</h2>}
            <hr className="border-t border-stone-200 w-full mt-4" />
        </div>
    );
}