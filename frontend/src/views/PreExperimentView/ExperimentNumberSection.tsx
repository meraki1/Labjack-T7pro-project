// ExperimentNumberSection.tsx
import { useQuery } from 'react-query';

async function fetchExperimentNumber() {
    const res = await fetch('http://localhost:8000/experiment_number/');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

export default function ExperimentNumber() {
    const { data: experimentData, status } = useQuery('experimentNumber', fetchExperimentNumber);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error fetching data</div>;
    }

    return (
        <>
            {experimentData && experimentData.experimentNumber !== null && <h1 className="text-4xl mb-4 text-stone-200 font-sans font-bold">Experiment: {experimentData.experimentNumber}</h1>}
        </>
    );
}