// ExperimentNumberSection.tsx
import { useEffect, useState } from 'react';

export default function ExperimentNumber() {
    const [experimentNumber, setExperimentNumber] = useState<number | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/experiment_number/')
            .then(response => response.json())
            .then(data => setExperimentNumber(data.experimentNumber))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <>
            {experimentNumber !== null && <h1 className="text-4xl mb-4 text-stone-200 font-sans font-bold">Experiment: {experimentNumber}</h1>}
        </>
    );
}