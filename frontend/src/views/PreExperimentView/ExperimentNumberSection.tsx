// ExperimentNumberSection.tsx
import { useQuery } from 'react-query';
import { useEffect } from 'react';

interface ExperimentNumberProps {
    experimentNumber: number;
    setExperimentNumber: (number: number) => void;
}

async function fetchExperimentNumber() {
    const res = await fetch('http://localhost:8000/experiment_number/');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

export default function ExperimentNumber({ experimentNumber, setExperimentNumber }: ExperimentNumberProps) {
    const { data: experimentData, status } = useQuery('experimentNumber', fetchExperimentNumber);

    useEffect(() => {
        if (experimentData && experimentData.experimentNumber !== null) {
            setExperimentNumber(experimentData.experimentNumber);
        }
    }, [experimentData, setExperimentNumber]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error fetching data</div>;
    }

    return (
        <div className="flex items-center ml-4">
            {experimentData && experimentData.experimentNumber !== null && <h1 className="text-4xl mb-2 text-stone-200 font-semibold">Experiment: {experimentData.experimentNumber}</h1>}
        </div>
    );
}