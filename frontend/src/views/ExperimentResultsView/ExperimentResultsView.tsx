// ExperimentResultsView.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import BackToHomeButton from '../../components/BackToHomePageButton';
import BackToExperimentSelectionButton from '../../components/BackToExperimentSelectionButton';
import Navbar from '../../components/Navbar';
import ExperimentIdAndTimestampSection from './ExperimentIdAndTimestampSection';
import ExperimentSampleDropdownSection from './ExperimentSampleDropdownSection';
import ExperimentDetailsSection from './ExperimentDetailsSection';
import ExperimentVisualSampleSection from './ExperimentVisualSampleSection';
import SampleDetailsSection from './SampleDetailsSection';

interface ExperimentResultsViewProps {
    experimentId: string;
}

const ExperimentResultsView: React.FC<ExperimentResultsViewProps> = () => {
    const { experimentId } = useParams<{ experimentId?: string }>();
    const [selectedSample, setSelectedSample] = useState<number | null>(null);
    
    if (!experimentId) {
        return <div>Experiment ID not found!</div>;
    }

    return (
        <div className="flex flex-col items-start min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 text-stone-200 shadow-md w-full font-sans">
            <Navbar />
            <div className="flex w-full mt-4">
                <ExperimentIdAndTimestampSection experimentId={Number(experimentId)} />
            </div>
            <hr className="border-t border-stone-200 w-full mt-4" />
            <div className='flex w-full p-4 mt-4'>
                <ExperimentDetailsSection experimentId={Number(experimentId)} />
            </div>
            <h2 className="text-2xl font-bold mb-4 mt-8 px-4">Experiment Samples</h2>
            <div className='flex justify-between'>
                <ExperimentSampleDropdownSection experimentId={Number(experimentId)} setSelectedSample={setSelectedSample} />
            </div>
            {selectedSample && (
            <div className="w-full p-4">
                <SampleDetailsSection experimentId={Number(experimentId)} sampleId={selectedSample} />
            </div>
            )}
            {selectedSample && (
            <div className="w-full p-4">
                <ExperimentVisualSampleSection experimentId={Number(experimentId)} sampleId={selectedSample} />
            </div>     
            )}
            <hr className="border-t border-stone-200 w-full mt-4" />
            <div className="flex mt-4 mb-4 px-4 w-full items-start justify-between">
                    <BackToHomeButton />   
                    <BackToExperimentSelectionButton />           
            </div>
        </div>
    );
};

export default ExperimentResultsView;