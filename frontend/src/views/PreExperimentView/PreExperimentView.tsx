// PreExperimentView.tsx
import { useState } from 'react';
import '../../index.css';
import DeviceSection from './DeviceSection';
import ExperimentNumber from './ExperimentNumberSection';
import ExperimentParametersSection from './ExperimentParametersSection';
import ChannelParametersSection from './ChannelParametersSection';
import StartMeasurementButton from '../../components/StartMeasurementButton';

export default function PreExperimentView() {
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [experimentNumber, setExperimentNumber] = useState(0);

    function handleStartMeasurement() {
        // Replace with your actual backend API call
        fetch('http://localhost:8000/start_measurement/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deviceId: selectedDeviceId,
                experimentNumber: experimentNumber,
                // Include other parameters here
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response data
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
    return (
        <div className="flex flex-col items-start justify-center min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 text-stone-200 shadow-md w-full font-sans">
            <div className="flex justify-between w-full mt-2">
            <div>
                <ExperimentNumber experimentNumber={experimentNumber} setExperimentNumber={setExperimentNumber} />
            </div>
            <div className="flex justify-between mt-2 w-5/12">
                <DeviceSection selectedDeviceId={selectedDeviceId} setSelectedDeviceId={setSelectedDeviceId} />
            </div>
        </div>
            <hr className="border-t border-stone-200 w-full mt-2" />
            <div className="flex w-full justify-center mt-2">
                <ExperimentParametersSection />
                <ChannelParametersSection selectedDeviceId={selectedDeviceId} />
            </div>
            <div className="flex w-full mt-3 mb-3 justify-center">
                <StartMeasurementButton onClick={handleStartMeasurement} />
            </div>
            <hr className="border-t border-stone-200 w-full" />
            <div className="flex mt-4 mb-4 px-4 w-full justify-start items-start">
                <button 
                    onClick={() => window.location.href='/'} 
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 shadow-md"
                >
                    Back to Home Page
                </button>                
            </div>
        </div>
    );    
}