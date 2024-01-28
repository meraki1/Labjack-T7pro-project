import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';

interface Device {
    device_id: number;
    device_name: string;
}

const fetchDevices = async () => {
    const response = await fetch('http://localhost:8000/devices');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const addDevice = async (newDeviceName: string) => {
    const response = await fetch('http://localhost:8000/devices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_name: newDeviceName }),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
};

const updateDevice = async ({ id, newName }: { id: number; newName: string }) => {
    const response = await fetch(`http://localhost:8000/devices/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_name: newName }),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const DeviceComponent = () => {
    const queryClient = useQueryClient();
    const { data: devices, isError, isLoading } = useQuery<Device[]>('devices', fetchDevices);
    const [deviceName, setDeviceName] = useState("");

    const addMutation = useMutation(addDevice, {
        onSuccess: () => {
            queryClient.invalidateQueries('devices');
        },
    });

    const updateMutation = useMutation(updateDevice, {
        onSuccess: () => {
            queryClient.invalidateQueries('devices');
        },
    });

    const handleAddDevice = () => {
        addMutation.mutate(deviceName);
        setDeviceName("");
    };

    const handleUpdateDevice = (id: number) => {
        const newName = prompt("Enter new device name");
        if (newName) {
            updateMutation.mutate({ id, newName });
        }
    };

    if (isLoading) return 'Loading...';
    if (isError) return 'An error has occurred: ' + addMutation.error;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 font-sans text-stone-200 w-full">
            <h1 className="text-4xl mb-2 mt-2 font-semibold">Devices</h1>
            <hr className="border-t border-stone-200 w-full mt-4 text-gray-900" />
            <div className="flex mt-4 space-x-4">
                <input
                value={deviceName}
                onChange={e => setDeviceName(e.target.value)} 
                    placeholder="Add new device" 
                    className="p-2 rounded border border-gray-300 text-gray-900 flex-grow"
                />
                <button 
                    onClick={handleAddDevice} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Device
                </button>
            </div>
            <table className="mt-8 w-1/2 text-center mx-auto table-fixed">
                <thead>
                    <tr>
                        <th className="w-1/4 overflow-hidden overflow-ellipsis">Device ID</th>
                        <th className="w-1/2 overflow-hidden overflow-ellipsis">Device Name</th>
                        <th className="w-1/4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {devices && devices.map(device => (
                        <tr key={device.device_id}>
                            <td className="overflow-hidden overflow-ellipsis">{device.device_id}</td>
                            <td className="overflow-hidden overflow-ellipsis">{device.device_name}</td>
                            <td>
                                <button 
                                    onClick={() => handleUpdateDevice(device.device_id)} 
                                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr className="border-stone-200 w-full mt-80 mb-4" />
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

export default DeviceComponent;