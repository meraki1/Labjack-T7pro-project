// HomePage.tsx
import StartExperimentButton from '../../components/StartExperimentButton';
import './App.css';

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen h-14 bg-gradient-to-r from-blue-500 to-blue-400 text-white">
            <h1 className="text-6xl mb-6 text-white font-semibold">LabJack T7 Pro Experiments</h1>
            <div className="w-3/4 md:w-3/5 lg:w-2/5 mb-6 border-2 border-blue-200 rounded-lg overflow-hidden shadow-2xl">
                <img 
                    src="/assets/LABJACK_T7_01.png" 
                    alt="LabJack T7 Pro" 
                    width={800}
                    height={500} 
                />
            </div>
            <p className="mb-6 text-center text-white w-3/4 md:w-2/5 text-lg">
                Dobrodošli na platformu LabJack T7 Pro Experiments! 
                Ovdje možete s lakoćom provoditi svoje eksperimente i upravljati njima,
                koristeći intuitivno sučelje i moćne značajke dizajnirane za profesionalce i entuzijaste.
            </p>
            <StartExperimentButton />
        </div>
    );
}