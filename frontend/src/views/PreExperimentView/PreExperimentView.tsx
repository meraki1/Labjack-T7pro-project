// PreExperimentView.tsx
import { useEffect, useState } from 'react';

export default function PreExperimentView() {
    const [experimentNumber, setExperimentNumber] = useState<number | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/experiment_number/')
            .then(response => response.json())
            .then(data => setExperimentNumber(data.experimentNumber))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Labjack T7 Pro Experiment</h1>
            {experimentNumber !== null && <h2>Experiment number: {experimentNumber}</h2>}
        </div>
    );
}
