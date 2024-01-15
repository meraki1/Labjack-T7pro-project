import { useEffect, useState } from 'react';
import '../../index.css';

export default function DeviceSection() {
    const [deviceName, setDeviceName] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/devices/')
            .then(response => response.json())
            .then(data => setDeviceName(data.device_name))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="text-stone-200 font-sans">
            {deviceName && <h2>Device name: {deviceName}</h2>}
        </div>
    );
}