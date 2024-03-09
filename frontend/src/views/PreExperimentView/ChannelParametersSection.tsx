// ChannelParametersSection.tsx
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import '../../index.css';

interface ParameterChannelRelationship {
    channel_id: number;
    param_type_id: number;
    device_id: number;
    channel_name: string;
    param_type: string;
    offset: number,
    scale: number
}

interface ChannelParametersSectionProps {
    selectedDeviceId: number;
    setChannelParameters: (data: ParameterChannelRelationship[]) => void; // Add this line
}

const ChannelParametersSection: React.FC<ChannelParametersSectionProps> = ({ selectedDeviceId, setChannelParameters }) => {
    const { data: relationshipData, status, refetch } = useQuery<ParameterChannelRelationship[]>(['parameterChannelRelationship', selectedDeviceId], () => fetchParameterChannelRelationship(selectedDeviceId), { enabled: !!selectedDeviceId });
    
    useEffect(() => {
        if (selectedDeviceId) {
            refetch();
        }
    }, [selectedDeviceId, refetch]);

    useEffect(() => {
        if (relationshipData) {
            setChannelParameters(relationshipData);
        }
    }, [relationshipData, setChannelParameters]);
    
    async function fetchParameterChannelRelationship(device_id: number) {
        const res = await fetch(`http://localhost:8000/relationships?device_id=${device_id}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }

    if (!selectedDeviceId) {
        return (
            <div className="text-stone-200 mt-2 w-3/5 font-sans p-2 bg-gray-100 rounded-lg shadow-lg ml-4">
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
        <div className="text-gray-700 mt-2 w-3/5 font-sans p-2 bg-gray-100 rounded-lg shadow-lg ml-4 overflow-auto grid grid-cols-3 gap-4">
            {relationshipData && relationshipData.map((relationship: ParameterChannelRelationship, index: number) => (
                <div key={index} className="mb-2 p-2 bg-white rounded-lg shadow-xl border-2 border-gray-200">
                    <label htmlFor={relationship.channel_name} className="font-bold block mb-2 text-md">Channel: {relationship.channel_name}</label>
                    <table className="table-auto text-gray-600">
                        <tbody>
                            <tr>
                                <td className="px-4 py-2 font-semibold">Parameter:</td>
                                <td className="px-4 py-2 font-semibold">{relationship.param_type}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-semibold">Offset:</td>
                                <td className="px-4 py-2">{relationship.offset}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-semibold">Scale:</td>
                                <td className="px-4 py-2">{relationship.scale}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );       
};

export default ChannelParametersSection;