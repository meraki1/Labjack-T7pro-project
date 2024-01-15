import { useState, useEffect } from 'react';

interface Device {
    device_id: number;
    device_name: string;
}

interface Channel {
    channel_id: number;
    channel_name: string;
}

const DeviceSetup = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [parameters, setParameters] = useState<string[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<number>();
    const [selectedParameters, setSelectedParameters] = useState<{ [key: number]: string }>({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const devicesResponse = await fetch('http://localhost:8000/devices');
                const devicesData = await devicesResponse.json();
                setDevices(devicesData);

                const channelsResponse = await fetch('http://localhost:8000/channels');
                const channelsData = await channelsResponse.json();
                setChannels(channelsData);

                const parametersResponse = await fetch('http://localhost:8000/relationships');
                const parametersData = await parametersResponse.json();
                setParameters(parametersData);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const handleParameterChange = (channelId: number, parameter: string) => {
        setSelectedParameters(prevState => ({ ...prevState, [channelId]: parameter }));

        const parameterValues = Object.values({ ...selectedParameters, [channelId]: parameter });
        const hasDuplicate = parameterValues.some((item, index) => parameterValues.indexOf(item) !== index);

        if (hasDuplicate) {
            setError('Error: Duplicate parameters are not allowed.');
        } else {
            setError('');
        }
    };

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
                    onChange={e => setSelectedDevice(Number(e.target.value))}
                    className="p-2 rounded border border-gray-300 text-gray-900 flex-grow"
                >
                    <option value="">Select a device</option>
                    {devices.map(device => (
                        <option key={device.device_id} value={device.device_id}>{device.device_name}</option>
                    ))}
                </select>
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-md"
                >
                    Save Relationship
                </button>
            </div>
            <table className="mt-6 w-1/2 text-center mx-auto table-fixed">
                <thead>
                    <tr>
                        <th className="w-1/2 overflow-hidden overflow-ellipsis">Channel Name</th>
                        <th className="w-1/2">Parameter</th>
                    </tr>
                </thead>
                <tbody>
                    {channels.map(channel => (
                        <tr key={channel.channel_id}>
                            <td className="overflow-hidden overflow-ellipsis">{channel.channel_name}</td>
                            <td>
                                <select 
                                    value={selectedParameters[channel.channel_id] || ''} 
                                    onChange={e => handleParameterChange(channel.channel_id, e.target.value)}
                                    className="p-1 rounded border border-gray-300 text-gray-900 mb-2 mt-2"
                                >
                                    <option value="">Select a parameter</option>
                                    {Object.entries(parameters).map(([key, value], index) => (
                                        <option key={index} value={key}>{value}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
};

export default DeviceSetup;