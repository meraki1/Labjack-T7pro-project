// ExperimentResultsView.tsx
import { useParams } from 'react-router-dom';
import BackToHomeButton from '../../components/BackToHomePageButton';
import BackToExperimentSelectionButton from '../../components/BackToExperimentSelectionButton';
import Navbar from '../../components/Navbar';
import ExperimentIdAndTimestampSection from './ExperimentIdAndTimestampSection';
import ExperimentSampleDropdownSection from './ExperimentSampleDropdownSection';

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
            <div className="flex w-full mt-2">
                <ExperimentIdAndTimestampSection experimentId={Number(experimentId)} />
            </div>
            <hr className="border-t border-stone-200 w-full mt-2" />
            <div className='flex mb-4'>
                <ExperimentSampleDropdownSection experimentId={Number(experimentId)} />
            </div>
            <div>
                {/* <ExperimentDetailsSection /> */}
            </div>
            <div>
                {/* <ExperimentVisualSampleSection /> */}
            </div>
            <hr className="border-t border-stone-200 w-full mt-2" />
            <div className="flex mt-4 mb-4 px-4 w-full items-start justify-between">
                    <BackToHomeButton />   
                    <BackToExperimentSelectionButton />           
            </div>
        </div>
    );
};

export default ExperimentResultsView;