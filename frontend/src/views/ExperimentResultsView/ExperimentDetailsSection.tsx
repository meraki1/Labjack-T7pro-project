// ExperimentDetailsSection.tsx
import { useQuery } from 'react-query';

interface Log {
  device_name: string;
  notes: string;
}

interface Channel {
  channels_parameters: Record<string, string>;
  offset: number;
  scale: number;
}

interface Parameter {
  experiment_parameters: Record<string, string>;
}

interface ExperimentDetails {
  dataLogs: Log[];
  dataChannels: Channel[];
  dataParameters: Parameter[];
}

const fetchExperimentDetails = async (experimentId: number) => {
  const responseLogs = await fetch(`http://localhost:8000/experiment_details_logs/${experimentId}`);
  const responseChannels = await fetch(`http://localhost:8000/experiment_details_channels/${experimentId}`);
  const responseParameters = await fetch(`http://localhost:8000/experiment_details_parameters/${experimentId}`);
  
  if (!responseLogs.ok || !responseChannels.ok || !responseParameters.ok) {
    throw new Error('Network response was not ok');
  }
  
  const dataLogs = await responseLogs.json();
  const dataChannels = await responseChannels.json();
  const dataParameters = await responseParameters.json();
  
  return { dataLogs, dataChannels, dataParameters };
};

const ExperimentDetailsSection = ({ experimentId }: { experimentId: number }) => {
  const { data, error, isLoading } = useQuery<ExperimentDetails>(['experiment_details', experimentId], () => fetchExperimentDetails(experimentId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error has occurred: {(error instanceof Error) ? error.message : 'Unknown error'}</div>;
  }

  return (
    <div className="w-full p-4 text-gray-700 bg-white rounded-lg shadow-md">
      <h2 className="font-bold text-2xl mb-4">Experiment Details:</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h3 className="font-bold text-xl mb-2">Main:</h3>
          {data?.dataLogs.map((log: Log, index: number) => (
            <div key={index} className="mb-2 bg-white p-2 rounded shadow-md border-2 border-gray-200">
              <p><strong>Device:</strong> {log.device_name}</p>
            </div>
          ))}
          {data?.dataLogs.map((log: Log, index: number) => (
            <div key={index} className="mb-2 bg-white p-2 rounded shadow-md border-2 border-gray-200">
              <p><strong>Notes:</strong> {log.notes}</p>
            </div>
          ))}
          {data?.dataParameters.map((parameter: Parameter, index: number) => (
            <div key={index} className="mb-2 bg-white p-2 rounded shadow-md border-2 border-gray-200">
              {Object.entries(parameter.experiment_parameters).map(([key, value]) => (
                <div key={key}>
                  <p><strong>{key}:</strong> {value}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="col-span-2">
          <h3 className="font-bold text-xl mb-2 ">Channels:</h3>
          <div className="grid grid-cols-3 gap-2">
            {data?.dataChannels.map((channel: Channel, index: number) => (
              <div key={index} className="mb-2 bg-white p-2 rounded shadow-md border-2 border-gray-200">
                {Object.entries(channel.channels_parameters).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
                <p><strong>Offset:</strong> {channel.offset}</p>
                <p><strong>Scale:</strong> {channel.scale}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentDetailsSection;