// DeviceSection.tsx
import { useQuery } from 'react-query';
import '../../index.css';

interface Device {
    device_id: string;
    device_name: string;
}

interface DeviceSectionProps {
    selectedDeviceId: string;
    setSelectedDeviceId: (deviceId: string) => void;
}

async function fetchDeviceNames() {
    const res = await fetch('http://localhost:8000/devices/');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

export default function DeviceSection({ selectedDeviceId, setSelectedDeviceId }: DeviceSectionProps) {
    const { data: deviceData, status } = useQuery<Device[]>('deviceNames', fetchDeviceNames);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error' || !deviceData) {
        return <div>Error fetching data</div>;
    }

    return (
        <div className="flex items-center justify-center space-x-4 text-stone-200 font-normal ml-4 mr-20">
            <h2 className="text-lg font-semibold">Select a Device:</h2>
            <select 
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="p-1 rounded border border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-500"
            >
                <option value="">Please select a device</option>
                {deviceData.map((device: Device) => (
                    <option key={device.device_id} value={device.device_id}>{device.device_name}</option>
                ))}
            </select>
        </div>
    );
}