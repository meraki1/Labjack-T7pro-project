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
        <div className="flex flex-col items-center justify-center min-h-[20vh] bg-gradient-to-r from-blue-200 via-blue-100 to-white text-gray-900 mb-8 p-4 shadow-md">
            <h1 className="text-4xl mb-4">Labjack T7 Pro Experiment</h1>
            {experimentNumber !== null && <h2>Experiment number: {experimentNumber}</h2>}
        </div>
    );
}
