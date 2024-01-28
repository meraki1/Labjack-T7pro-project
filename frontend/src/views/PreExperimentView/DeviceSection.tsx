import { useQuery } from 'react-query';
import '../../index.css';

async function fetchDeviceName() {
    const res = await fetch('http://localhost:8000/devices/');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

export default function DeviceSection() {
    const { data: deviceData, status } = useQuery('deviceName', fetchDeviceName);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error fetching data</div>;
    }

    return (
        <div className="text-stone-200 font-sans">
            {deviceData && deviceData.device_name && <h2>Device name: {deviceData.device_name}</h2>}
        </div>
    );
}