// ExperimentResultsView.tsx
import { useParams } from 'react-router-dom';
import BackToHomeButton from '../../components/BackToHomePageButton';
import Navbar from '../../components/Navbar';
import DeviceUsedSection from './DeviceUsedSection';

interface ExperimentResultsViewProps {
    experimentId: string;
}

const ExperimentResultsView: React.FC<ExperimentResultsViewProps> = () => {
    const { experimentId } = useParams<{ experimentId?: string }>();
    if (!experimentId) {
        return <div>Experiment ID not found!</div>;
    }

    return (
        <div className="flex flex-col items-start min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 text-stone-200 shadow-md w-full font-sans">
            <Navbar />
            <div className="flex justify-center items-center w-full mt-2">
                <h1 className="text-2xl font-semibold">
                    Experiment Details
                </h1>
            </div>
            <h2 className=''> Experiment ID: {experimentId}</h2>
            <DeviceUsedSection experimentId={parseInt(experimentId)} />
            <hr className="border-t border-stone-200 w-full mt-2" />
            <hr className="border-t border-stone-200 w-full mt-2" />
            <div className="flex mt-4 mb-4 px-4 w-full justify-start items-start">
                <BackToHomeButton />
                {/* <BackToExperimentSelectionButton /> */}
            </div>
        </div>
    );
};

export default ExperimentResultsView;