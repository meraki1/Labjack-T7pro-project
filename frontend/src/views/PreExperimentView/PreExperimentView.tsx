// PreExperimentView.tsx
import '../../index.css';
import DeviceSection from './DeviceSection';
import ExperimentNumber from './ExperimentNumberSection';
import ExperimentParametersSection from './ExperimentParametersSection';

export default function PreExperimentView() {
    return (
        <div className="items-start justify-start min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 text-stone-200 mb-8 p-4 shadow-md w-full font-sans">
            <ExperimentNumber />
            <DeviceSection />
            <hr className="border-t border-stone-200 w-full mt-4" />
            <ExperimentParametersSection />
            <hr className="border-t border-stone-200 w-full" />
        </div>
    );
}
