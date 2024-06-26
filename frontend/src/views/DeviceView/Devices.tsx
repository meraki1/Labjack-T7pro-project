import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import BackToHomeButton from '../../components/BackToHomePageButton';
import EditDeviceButton from '../../components/EditDeviceButton';
import AddDeviceButton from '../../components/AddDeviceButton';


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
            <Navbar />
            <h1 className="text-4xl mb-2 mt-2 font-semibold">Devices</h1>
            <hr className="border-t border-stone-200 w-full mt-4 text-gray-900" />
            <div className="flex mt-4 space-x-4">
                <input
                    value={deviceName}
                    onChange={e => setDeviceName(e.target.value)} 
                    placeholder="Add new device" 
                    className="p-2 rounded border border-gray-300 text-gray-900 flex-grow"
                />
                <AddDeviceButton handleAddDevice={handleAddDevice} />
            </div>
            <table className="mt-8 scroll-mb-3.5 w-1/2 text-center mx-auto table-fixed border-collapse border border-gray-300 bg-white shadow-lg">
                <thead>
                    <tr>
                        <th className="w-1/4 overflow-hidden overflow-ellipsis border border-gray-300 p-2 bg-gray-200 text-cyan-950">Device ID</th>
                        <th className="w-1/2 overflow-hidden overflow-ellipsis border border-gray-300 p-2 bg-gray-200 text-cyan-950">Device Name</th>
                        <th className="w-1/4 border border-gray-300 p-2 bg-gray-200 text-cyan-950">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {devices && devices.map(device => (
                        <tr key={device.device_id}>
                            <td className="overflow-hidden overflow-ellipsis border border-gray-300 p-3 text-cyan-950">{device.device_id}</td>
                            <td className="overflow-hidden overflow-ellipsis border border-gray-300 p-3 text-cyan-950">{device.device_name}</td>
                            <td>
                                <EditDeviceButton handleUpdateDevice={handleUpdateDevice} deviceId={device.device_id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr className="border-stone-200 w-full mt-auto" />
            <div className="flex mt-4 mb-4 px-4 w-full justify-start items-start">
                <BackToHomeButton />
            </div>
        </div>
    );
};

export default DeviceComponent;