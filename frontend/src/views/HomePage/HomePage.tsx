// HomePage.tsx
import Navbar from '../../components/Navbar';
import StartExperimentButton from '../../components/StartExperimentButton';
import './App.css';

export default function HomePage() {
    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950">
            <Navbar />
            <div className="w-3/4 md:w-3/5 lg:w-2/5 mb-2 justify-center">
                <img 
                    src="/assets/labjack-t7-pro-593570.png" 
                    alt="LabJack T7 Pro" 
                    className="w-full h-auto" 
                />
            </div>
            <p className="mb-6 text-center text-stone-200 w-3/4 md:w-2/5 text-lg font-sans justify-center">
            Welcome to the LabJack T7 Pro Experiments platform! 
            Here, you can easily conduct and manage your experiments using an intuitive interface and powerful features designed for professionals and enthusiasts alike. 
            </p>
            <div className="flex justify-center">
                <StartExperimentButton />
            </div>
        </div>
    );
}