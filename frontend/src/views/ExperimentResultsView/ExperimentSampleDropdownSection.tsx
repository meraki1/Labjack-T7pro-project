// ExperimentSampleDropdownSection.tsx
import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';

interface Sample {
    id: number;
    file_name: string;
    start_time: string;
    end_time: string;
    experiment_log_id: number;
    sample_number: number;
}

const fetchExperimentSamples = async (experimentId: number) => {
  const response = await fetch(`http://localhost:8000/experiment_samples/${experimentId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

const ExperimentSampleDropdownSection = ({ experimentId, setSelectedSample }: { experimentId: number, setSelectedSample: (sampleId: number) => void }) => {
  const { data, error, isLoading } = useQuery(['experiment_samples', experimentId], () => fetchExperimentSamples(experimentId));
  const [selectedSample, setSelectedSampleLocal] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const firstSampleId = data[0].id;
      setSelectedSampleLocal(firstSampleId);
      setSelectedSample(firstSampleId);
    }
  }, [data, setSelectedSample]);

  const handleSampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sampleId = Number(e.target.value);
    setSelectedSampleLocal(sampleId);
    setSelectedSample(sampleId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error has occurred: {(error instanceof Error) ? error.message : 'Unknown error'}</div>;
  }

  return (
    <div className="w-full mt-4 ml-4 flex items-center">
      <label className="text-stone-200 text-lg font-medium mr-2" htmlFor="sample-select">
        Select a Sample:
      </label>
      <div className="relative flex-grow">
        <select 
          className="block appearance-none w-full bg-white text border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
          id="sample-select"
          value={selectedSample || ''}
          onChange={handleSampleChange}
        >
          {data.map((sample: Sample) => (
            <option key={sample.id} value={sample.id}>
              {sample.file_name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-6-5h12l-6 5z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default ExperimentSampleDropdownSection;