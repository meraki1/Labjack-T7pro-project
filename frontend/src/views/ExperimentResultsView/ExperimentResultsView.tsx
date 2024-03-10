// ExperimentResultsView.tsx
import { useParams } from 'react-router-dom';
import BackToHomeButton from '../../components/BackToHomePageButton';
import BackToExperimentSelectionButton from '../../components/BackToExperimentSelectionButton';
import Navbar from '../../components/Navbar';

interface ExperimentResultsViewProps {
    experimentId: string;
}

const ExperimentResultsView: React.FC<ExperimentResultsViewProps> = () => {
    const { experimentId } = useParams<{ experimentId?: string }>();
    if (!experimentId) {
        return <div>Experiment ID not found!</div>;
    }

    return (
        <div className="flex flex-col items-start justify-between min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 text-stone-200 shadow-md w-full font-sans">
            <Navbar />
            <div className="flex justify-center items-center w-full mt-2">
                <h1 className="">
                     {/* <ExperimentIDandTimestampSection /> */}
                     {/* <ExperimentSampleDropdownSection /> */}
                </h1>
            </div>
            <hr className="border-t border-stone-200 w-full mt-2" />
                {/* <ExperimentDetailsSection /> */}
                {/* <ExperimentVisualSampleSection /> */}
            <hr className="border-t border-stone-200 w-full mt-2" />
            <div className="flex mt-4 px-4 w-full items-start justify-between">
                    <BackToHomeButton />   
                    <BackToExperimentSelectionButton />           
            </div>
        </div>
    );
};

export default ExperimentResultsView;