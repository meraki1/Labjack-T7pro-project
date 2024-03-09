// DeviceUsedSection.tsx
import React from 'react';
import { useQuery } from 'react-query';

interface DeviceUsedSectionProps {
    experimentId: number;
}

const DeviceUsedSection: React.FC<DeviceUsedSectionProps> = ({ experimentId }) => {
    const { data: deviceUsed, status } = useQuery(['device', experimentId], async () => {
        const res = await fetch(`http://localhost:8000/device?experiment_id=${experimentId}`);
        if (!res.ok) {
            throw new Error('Failed to fetch device used');
        }
        return res.json();
    });

    if (status === 'loading') return <div>Loading device used...</div>;
    if (status === 'error') return <div>Error fetching device used</div>;

    return <p>Device used: {deviceUsed?.device_name || 'Unknown'}</p>;
};

export default DeviceUsedSection;