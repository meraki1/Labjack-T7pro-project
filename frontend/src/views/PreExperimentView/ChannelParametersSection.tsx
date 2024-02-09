// ChannelParametersSection.tsx
import { useQuery } from 'react-query';
import '../../index.css';

interface ParameterChannelRelationship {
    channel_id: number;
    param_type_id: number;
    device_id: number;
    channel_name: string;
    param_type: string;
}

async function fetchParameterChannelRelationship(device_id: string) {
    const res = await fetch(`http://localhost:8000/relationships?device_id=${device_id}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

export default function ChannelParametersSection({ selectedDeviceId }: { selectedDeviceId: string }) {
    const { data: relationshipData, status } = useQuery<ParameterChannelRelationship[]>(['parameterChannelRelationship', selectedDeviceId], () => fetchParameterChannelRelationship(selectedDeviceId), { enabled: !!selectedDeviceId });

    if (!selectedDeviceId) {
        return (
            <div className="text-stone-200 mt-2 w-2/5 font-sans p-2 bg-gray-100 rounded-lg shadow-lg ml-4">
                <div className="mb-2 p-2 bg-white rounded-lg shadow-md">
                    <p className="font-bold block mb-2 text-md text-gray-700">Select a device to display channel to parameter relationship</p>
                </div>
            </div>
        );
    }

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error fetching data</div>;
    }

    return (
        <div className="text-stone-200 mt-2 w-2/5 font-sans p-2 bg-gray-100 rounded-lg shadow-lg ml-4 overflow-auto">
            {relationshipData && relationshipData.map((relationship: ParameterChannelRelationship, index: number) => (
                <div key={index} className="mb-2 p-2 bg-white rounded-lg shadow-md">
                    <label htmlFor={relationship.channel_name} className="font-bold block mb-2 text-md text-gray-700">Channel: {relationship.channel_name}</label>
                    <p className="text-blue-600 font-semibold">Parameter: {relationship.param_type}</p>
                </div>
            ))}
        </div>
    );    
}