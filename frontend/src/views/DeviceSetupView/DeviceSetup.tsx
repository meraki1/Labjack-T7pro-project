import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';

interface Device {
    device_id: number;
    device_name: string;
}

interface Channel {
    channel_id: number;
    channel_name: string;
}

interface Parameter {
    param_type_id: number;
    param_type: string;
}

const fetchDevices = async () => {
    const response = await fetch('http://localhost:8000/devices');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const fetchChannels = async () => {
    const response = await fetch('http://localhost:8000/channels');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const fetchChannelParameters = async () => {
    const response = await fetch('http://localhost:8000/channelsParameters');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const createRelationships = async (relationships: { channel_id: number; param_type_id: number; device_id: number }[]) => {
    const response = await fetch('http://localhost:8000/relationships', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(relationships),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const DeviceSetup = () => {
    const { data: devices, isError: devicesError, isLoading: devicesLoading } = useQuery<Device[]>('devices', fetchDevices);
    const { data: channels, isError: channelsError, isLoading: channelsLoading } = useQuery<Channel[]>('channels', fetchChannels);
    const { data: parameters, isError: parametersError, isLoading: parametersLoading } = useQuery<Parameter[]>('channel parameters', fetchChannelParameters);
    const [selectedDevice, setSelectedDevice] = useState<string>();
    const [selectedChannelParameters, setSelectedChannelParameters] = useState<{ [key: number]: number }>({});
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const createRelationshipsMutation = useMutation(createRelationships, {
        onSuccess: () => {
            setMessage('Device info updated successfully');
            setTimeout(() => setMessage(''), 5000);
        },
        onError: () => {
            setMessage('An error occurred while updating the device info');
            setTimeout(() => setMessage(''), 5000);
        }
    });    

    const handleParameterChange = (channelId: number, parameterId: number) => {
        setSelectedChannelParameters(prevState => ({
            ...prevState,
            [channelId]: parameterId
        }));
    
        const parameterValues = Object.values({ ...selectedChannelParameters, [channelId]: parameterId });
        const hasDuplicate = parameterValues.some((item, index) => parameterValues.indexOf(item) !== index);
    
        if (hasDuplicate) {
            setError('Error: Duplicate parameters are not allowed.');
        } else {
            setError('');
        }
    };

    const handleSaveDeviceInfo = () => {
        if (selectedDevice) {
            const relationships = Object.entries(selectedChannelParameters)
                .filter(([channelId, parameterId]) => channelId && parameterId)
                .map(([channelId, parameterId]) => ({
                    channel_id: Number(channelId),
                    param_type_id: Number(parameterId),
                    device_id: Number(selectedDevice),
                }));
    
            createRelationshipsMutation.mutate(relationships);
        } else {
            console.error('No device selected');
        }
    };      

    if (devicesLoading || channelsLoading || parametersLoading) return 'Loading...';
    if (devicesError || channelsError || parametersError) return 'An error has occurred';

    return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 font-sans text-stone-200">
            <h1 className="text-4xl mb-2 mt-2 font-sans font-semibold">Device Setup</h1>
            <hr className="border-t border-stone-200 w-full mt-4 text-gray-900" />
            {error && (
                <div className="text-red-500 mt-2">
                    {error}
                </div>
            )}
            <div className="flex mt-4 space-x-4">
                <select 
                    value={selectedDevice} 
                    onChange={e => setSelectedDevice(e.target.value)}
                    className="p-2 rounded border border-gray-300 text-gray-900 flex-grow"
                >
                    <option value="">Select a device</option>
                    {devices && devices.map(device => (
                        <option key={device.device_id} value={device.device_id}>{device.device_name}</option>
                    ))}
                </select>
            </div>
            <table className="mt-6 w-1/2 text-center mx-auto table-fixed">
                <thead>
                    <tr>
                        <th className="w-1/2 overflow-hidden overflow-ellipsis">Channel Name</th>
                        <th className="w-1/2">Parameter</th>
                    </tr>
                </thead>
                <tbody>
                    {channels && channels.map(channel => (
                        <tr key={channel.channel_id}>
                            <td className="overflow-hidden overflow-ellipsis">{channel.channel_name}</td>
                            <td>
                                <select 
                                    value={selectedChannelParameters[channel.channel_id] || ''} 
                                    onChange={e => handleParameterChange(channel.channel_id, Number(e.target.value))}
                                    className="p-1 rounded border border-gray-300 text-gray-900 mb-2 mt-2"
                                >
                                    <option value="">Select a parameter</option>
                                    {parameters && parameters.map((parameter, index) => (
                                        <option key={index} value={parameter.param_type_id}>{parameter.param_type}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex mt-4 space-x-4">
                <button
                    onClick={handleSaveDeviceInfo} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-md"
                >
                    Save Device Info
                </button>
            </div>
            {message && (
                <div className="text-green-500 mt-2">
                    {message}
                </div>
            )}
            <hr className="border-t border-stone-200 w-full mt-4 mb-4" />
            <div className="mt-auto mb-4">
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

export default DeviceSetup;