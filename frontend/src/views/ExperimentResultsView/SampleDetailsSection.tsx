// SampleDetailsSection.tsx
import { useQuery } from 'react-query';

const fetchSampleStats = async (experimentId: number, sampleId: number) => {
  const response = await fetch(`http://localhost:8000/experiment_sample_stats/${experimentId}/${sampleId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

function formatDuration(duration: string) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+(\.\d+)?S)?/);
  if (!match) {
    return 'Invalid duration format';
  }
  const hours = match[1] ? match[1].slice(0, -1) + ' hours ' : '';
  const minutes = match[2] ? match[2].slice(0, -1) + ' minutes ' : '';
  const seconds = match[3] ? parseFloat(match[3].slice(0, -1)).toFixed(2) + ' seconds' : '';
  return hours + minutes + seconds;
}

const SampleDetailsSection = ({ experimentId, sampleId }: { experimentId: number, sampleId: number }) => {
  const { data, error, isLoading } = useQuery(['sample_stats', experimentId, sampleId], () => fetchSampleStats(experimentId, sampleId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error has occurred: {(error instanceof Error) ? error.message : 'Unknown error'}</div>;
  }

  const startTime = new Date(data.start_time).toLocaleString();
  const endTime = new Date(data.end_time).toLocaleString();
  const formattedDuration = formatDuration(data.duration);

  return (
    <div className="w-full p-4 text-gray-700 bg-white rounded-lg shadow-md">
      <h2 className="font-bold text-2xl mb-4">Sample Details:</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="font-bold text-xl mb-2">Timestamp details:</h3>
          <div className="mb-2 bg-white p-2 rounded shadow-md border-2 border-gray-200">
            <p><strong>Start Time:</strong> {startTime}</p>
          </div>
          <div className="mb-2 bg-white p-2 rounded shadow-md border-2 border-gray-200">
            <p><strong>End Time:</strong> {endTime}</p>
          </div>
          <div className="mb-2 bg-white p-2 rounded shadow-md border-2 border-gray-200">
            <p><strong>Duration:</strong> {formattedDuration}</p>
          </div>
        </div>
        <div className="col-span-2">
        <h3 className="font-bold text-xl mb-2">Channels Statistics:</h3>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(data.summary_stats).map(([key, value]) => (
                typeof value === 'object' && value !== null ? (
                  <div key={key} className="mb-2 bg-white p-2 rounded shadow-md border-2 border-gray-200">
                    <p><strong>{key}:</strong></p>
                    {Object.entries(value).map(([statKey, statValue]) => (
                      <p key={statKey}>{statKey}: {Number(statValue).toFixed(2)}</p>
                    ))}
                  </div>
                ) : null
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDetailsSection;