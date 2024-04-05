// ExperimentIdAndTimestampSection.tsx
import { useQuery } from 'react-query';

const fetchExperiment = async (experimentId: number) => {
    const response = await fetch(`http://localhost:8000/experiment/${experimentId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  };

const ExperimentIdAndTimestampSection = ({ experimentId }: { experimentId: number }) => {
  const { data, error, isLoading } = useQuery(['experiment', experimentId], () => fetchExperiment(experimentId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error has occurred: {(error instanceof Error) ? error.message : 'Unknown error'}</div>;
  }

  return (
    <div className="flex justify-between w-full p-4 text-stone-200">
        <div className="text-left font-semibold text-4xl">Experiment: {data.log_id}</div>
        <div className="text-right font-semibold text-xl">Measured: {new Date(data.start_time).toLocaleString()}</div>
    </div>
  );
};

export default ExperimentIdAndTimestampSection;