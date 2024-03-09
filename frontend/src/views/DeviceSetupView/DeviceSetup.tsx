import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import BackToHomeButton from '../../components/BackToHomePageButton';
import SaveDeviceInfoButton from '../../components/SaveDeviceInfoButton';

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

interface Offset {
    [key: string]: number | undefined;
}

interface Scale {
    [key: string]: number | undefined;
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

const createRelationships = async (relationships: { channel_id: number; param_type_id: number; device_id: number; offset:number; scale:number }[]) => {
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
    const [offset, setOffset] = useState<Offset>({});
    const [scale, setScale] = useState<Scale>({});
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
        const nonDefaultValues = parameterValues.filter(value => value !== undefined && value !== null && value !== 0); // Exclude default value (0)
        const hasDuplicateNonDefaultValues = new Set(nonDefaultValues).size !== nonDefaultValues.length;
    
        if (hasDuplicateNonDefaultValues) {
            setError('Error: Duplicate non-default parameters are not allowed.');
        } else {
            setError('');
        }

        setOffset(prevState => ({
            ...prevState,
            [channelId]: undefined,
        }));

        setScale(prevState => ({
            ...prevState,
            [channelId]: undefined,
        }));
    };

    const handleOffsetChange = (channelId: number, value: string) => {
        setOffset(prevState => ({
            ...prevState,
            [channelId]: parseFloat(value),
        }));
    };

    const handleScaleChange = (channelId: number, value: string) => {
        setScale(prevState => ({
            ...prevState,
            [channelId]: parseFloat(value),
        }));
    };

    const handleSaveDeviceInfo = () => {
        if (selectedDevice) {
            const relationships = Object.entries(selectedChannelParameters)
                .filter(([channelId, parameterId]) => channelId && parameterId)
                .map(([channelId, parameterId]) => ({
                    channel_id: Number(channelId),
                    param_type_id: Number(parameterId),
                    device_id: Number(selectedDevice),
                    offset: offset[channelId] || 0,
                    scale: scale[channelId] || 1,
                }));
    
            createRelationshipsMutation.mutate(relationships);
        } else {
            console.error('No device selected');
        }
    };      

    if (devicesLoading || channelsLoading || parametersLoading) return 'Loading...';
    if (devicesError || channelsError || parametersError) return 'An error has occurred';

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 font-sans text-stone-200 w-full">
            <Navbar />
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
            <table className="mt-6 w-3/5 text-center mx-auto table-fixed border-collapse border border-gray-300 bg-white shadow-lg">
                <thead>
                    <tr>
                        <th className="w-1/2 overflow-hidden overflow-ellipsis border border-gray-300 p-2 bg-gray-200 text-cyan-950">Channel</th>
                        <th className="w-1/2 border border-gray-300 p-2 bg-gray-200 text-cyan-950">Parameter</th>
                        <th className="w-1/2 border border-gray-300 p-2 bg-gray-200 text-cyan-950">Offset</th>
                        <th className="w-1/2 border border-gray-300 p-2 bg-gray-200 text-cyan-950">Scale</th>
                    </tr>
                </thead>
                <tbody>
                    {channels && channels.map(channel => (
                        <tr key={channel.channel_id}>
                            <td className="overflow-hidden overflow-ellipsis border border-gray-300 p-2 text-cyan-950">{channel.channel_name}</td>
                            <td className="border border-gray-300 p-2 text-cyan-950">
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
                            <td className="border border-gray-300 p-2 text-cyan-950">
                                <input 
                                    type="number" 
                                    value={offset[channel.channel_id]?.toLocaleString('en-US') || ''}
                                    onChange={e => handleOffsetChange(channel.channel_id, e.target.value)}
                                    placeholder="Offset" 
                                    disabled={!selectedChannelParameters[channel.channel_id]}
                                    className="p-1 rounded border border-gray-300 text-gray-900 mb-2 mt-2"
                                />
                            </td>
                            <td className="border border-gray-300 p-2 text-cyan-950">
                                <input 
                                    type="number" 
                                    value={scale[channel.channel_id]?.toLocaleString('en-US') || ''} 
                                    onChange={e => handleScaleChange(channel.channel_id, e.target.value)}
                                    placeholder="Scale" 
                                    disabled={!selectedChannelParameters[channel.channel_id]}
                                    className="p-1 rounded border border-gray-300 text-gray-900 mb-2 mt-2"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex mt-4 space-x-4">
                <SaveDeviceInfoButton handleSaveDeviceInfo={handleSaveDeviceInfo} />
            </div>
            {message && (
                <div className="text-green-500 mt-2">
                    {message}
                </div>
            )}
            <hr className="border-t border-stone-200 w-full mt-4 mb-4" />
            <div className="flex mb-4 px-4 w-full justify-start items-start">
                <BackToHomeButton />
            </div>
        </div>
    );    
}

export default DeviceSetup;