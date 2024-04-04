// PreExperimentView.tsx
import { useState } from 'react';
import '../../index.css';
import DeviceSection from './DeviceSection';
import ExperimentNumber from './ExperimentNumberSection';
import ExperimentParametersSection from './ExperimentParametersSection';
import ChannelParametersSection from './ChannelParametersSection';
import StartMeasurementButton from '../../components/StartMeasurementButton';
import BackToHomeButton from '../../components/BackToHomePageButton';

export default function PreExperimentView() {
    const [selectedDeviceId, setSelectedDeviceId] = useState(0);
    const [experimentNumber, setExperimentNumber] = useState(0);
    const [experimentParameters, setExperimentParameters] = useState({});
    const [channelParameters, setChannelParameters] = useState({});

    async function handleStartMeasurement(): Promise<boolean> {
        const experimentData = {
            device_id: selectedDeviceId,
            experiment_parameters: experimentParameters,
            channel_parameters: channelParameters,
        };
    
        const dataForCollecting = {
            log_id: experimentNumber,
            channel_parameters: channelParameters,
            experiment_parameters: experimentParameters,
        };
    
        // Log the data being sent to the backend
        console.log('Sending the following experiment data to the backend:', experimentData);
        console.log('Sending the following data for collecting to the backend:', dataForCollecting);
        
        try {
            const [startExperimentResponse, experimentDataResponse] = await Promise.all([
                // Send experiment data to start the experiment
                fetch('http://localhost:8000/start_experiment/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataForCollecting),
                }).then(response => response.json()),
                // Updating the tables in the database with experiment data
                fetch('http://localhost:8000/experimentDataCreate/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(experimentData),
                }).then(response => response.json())
            ]);
    
            // Check if both requests were successful
            if (
                startExperimentResponse.message === 'Experiment data collected successfully' &&
                experimentDataResponse.message === 'Experiment data, parameters, and channels created successfully'
            ) {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
    
                return true;
            } else {
                return false;
            }
        } catch (error) {
            // Handle errors for both fetch requests
            console.error('Error:', error);
            return false; // Return false in case of an error
        }
    }   
       
    return (
        <div className="flex flex-col items-start justify-between min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 text-stone-200 shadow-md w-full font-sans">
            <div className="flex justify-between w-full mt-2    ">
            <div>
                <ExperimentNumber experimentNumber={experimentNumber} setExperimentNumber={setExperimentNumber} />
            </div>
            <div className="flex justify-between mt-2 mr-20 w-2/5">
                <DeviceSection selectedDeviceId={selectedDeviceId} setSelectedDeviceId={setSelectedDeviceId} />
            </div>
        </div>
            <hr className="border-t border-stone-200 w-full mt-2" />
            <div className="flex w-full justify-center mt-2">
                <ExperimentParametersSection setExperimentParameters={setExperimentParameters} />
                <ChannelParametersSection selectedDeviceId={selectedDeviceId} setChannelParameters={setChannelParameters} />
            </div>
            <div className="flex w-full mt-2 mb-2 px-4 justify-center">
                <StartMeasurementButton onClick={handleStartMeasurement} />
            </div>
            <hr className="border-t border-stone-200 w-full" />
            <div className="flex mt-2 mb-4 px-4 w-full items-start justify-between">
                <BackToHomeButton />           
            </div>
        </div>
    );    
}  