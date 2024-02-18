// ExperimentResultsView.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackToHomeButton from '../../components/BackToHomePageButton';
import ViewDetailsButton from '../../components/ViewDetailsButton';

// Define the type for experiment details
interface ExperimentDetails {
    experiment_id: number;
    // Add more fields as needed
}

const ExperimentResultsView = () => {
    const { experimentId } = useParams<{ experimentId: string }>();
    const [experimentDetails, setExperimentDetails] = useState<ExperimentDetails | null>(null); // State to hold experiment details

    // Fetch experiment details based on experimentId
    useEffect(() => {
        const fetchExperimentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/experiment/${experimentId}/details`);
                if (!response.ok) {
                    throw new Error('Failed to fetch experiment details');
                }
                const data: ExperimentDetails = await response.json();
                setExperimentDetails(data);
            } catch (error) {
                console.error('Error fetching experiment details:', error);
            }
        };
        fetchExperimentDetails();
    }, [experimentId]);

    return (
        <div className="flex flex-col items-start justify-center min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 text-stone-200 shadow-md w-full font-sans">
            <div className="flex justify-between w-full mt-2">
                {/* Section to display experiment details */}
                <div className="flex items-center">
                    <h2 className="text-2xl font-semibold">Experiment Details</h2>
                    <ViewDetailsButton experimentId={Number(experimentId)} />
                </div>
                {/* Add any other details or controls here */}
            </div>
            <hr className="border-t border-stone-200 w-full mt-2" />
            {/* Display experiment details */}
            {experimentDetails && (
                <div className="px-4 mt-2">
                    <h3 className="text-lg font-semibold mb-2">Experiment ID: {experimentDetails.experiment_id}</h3>
                    {/* Add more experiment details here */}
                </div>
            )}
            <hr className="border-t border-stone-200 w-full mt-2" />
            <div className="flex mt-4 mb-4 px-4 w-full justify-start items-start">
                <BackToHomeButton />
            </div>
        </div>
    );
};

export default ExperimentResultsView;