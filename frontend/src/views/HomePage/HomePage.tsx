// HomePage.tsx
import StartExperimentButton from '../../components/StartExperimentButton';
import './App.css';

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen h-14 bg-gradient-to-b from-cyan-950 via-cyan-800 to-sky-950">
            <h1 className="text-5xl mb-2 text-stone-200 font-sans">LabJack T7 Pro Experiments</h1>
            <div className="w-3/4 md:w-3/5 lg:w-2/5 mb-2 ">
                <img 
                    src="/assets/labjack-t7-pro-593570.png" 
                    alt="LabJack T7 Pro" 
                    className="w-full h-auto" 
                />
            </div>
            <p className="mb-6 text-center text-stone-200 w-3/4 md:w-2/5 text-lg font-sans">
                Dobrodošli na platformu LabJack T7 Pro Experiments! 
                Ovdje možete s lakoćom provoditi svoje eksperimente i upravljati njima,
                koristeći intuitivno sučelje i moćne značajke dizajnirane za profesionalce i entuzijaste.
            </p>
            <StartExperimentButton />
        </div>
    );
}