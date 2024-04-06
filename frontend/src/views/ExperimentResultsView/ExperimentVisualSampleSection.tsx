// ExperimentVisualSampleSection.tsx
import { useQuery } from 'react-query';
import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import DownloadCSVButton from '../../components/DownloadCSVButton';

type DataRow = {
    time: string;
    [key: string]: number | string;
    AIN0: number;
    AIN1: number;
    AIN2: number;
    AIN3: number;
    AIN4: number;
};

type Channel = 'AIN0' | 'AIN1' | 'AIN2' | 'AIN3' | 'AIN4';

const fetchExperimentVisualSample = async (experimentId: number, sampleId: number) => {
  const response = await fetch(`http://localhost:8000/experiment_visual_sample/${experimentId}/${sampleId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

const ExperimentVisualSampleSection = ({ experimentId, sampleId }: { experimentId: number, sampleId: number}) => {
    const { data, error, isLoading } = useQuery(['experiment_visual_sample', experimentId, sampleId], () => fetchExperimentVisualSample(experimentId, sampleId));
    const chartComponentRef = useRef(null);

    const [selectedChannels, setSelectedChannels] = useState({
        AIN0: true,
        AIN1: true,
        AIN2: true,
        AIN3: true,
        AIN4: true,
      });
    
      const handleCheckboxChange = (channel: Channel) => {
        setSelectedChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
      };

    useEffect(() => {
    }, [data]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>An error has occurred: {(error instanceof Error) ? error.message : 'Unknown error'}</div>;
    }

    const chartData = {
        labels: data.map((row: DataRow) => new Date(row.time)),
        datasets: Object.keys(selectedChannels).filter(channel => selectedChannels[channel as keyof typeof selectedChannels]).map((channel, i) => ({          label: channel,
          data: data.map((row: DataRow) => row[channel]),
          fill: false,
          borderColor: `hsl(${i * 72}, 100%, 50%)`,
          tension: 0.1
        }))
      };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        tooltip: {
            mode: 'index' as const,
            intersect: false
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x',
            intersect: false
        }
        },
        scales: {
            x: {
            display: false
            }
        }
    };
    
    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedChannels(prev => {
        const newValue = event.target.checked;
        const newChannels = { ...prev };
        for (const channel in newChannels) {
          newChannels[channel as keyof typeof selectedChannels] = newValue;
        }
        return newChannels;
      });
    };
  
    const allSelected = Object.values(selectedChannels).every(value => value);
  
    return (
      <div className="w-full p-4 text-gray-700 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-2xl mb-4">Sample Chart:</h2>
          <DownloadCSVButton experimentId={experimentId} sampleId={sampleId} />
        </div>
        <div className="flex flex-wrap mb-4 justify-between items-center">
          <div className="flex flex-wrap">
            <div className="mr-2 mb-2 flex items-center">
              <input
                type="checkbox"
                id="selectAll"
                checked={allSelected}
                onChange={handleSelectAllChange}
                className="mr-1"
              />
              <label htmlFor="selectAll" className="text-sm">Select All</label>
            </div>
            {Object.keys(selectedChannels).map((channel) => (
              <div key={channel} className="mr-2 mb-2 flex items-center">
                <input
                  type="checkbox"
                  id={channel}
                  checked={selectedChannels[channel as keyof typeof selectedChannels]}
                  onChange={() => handleCheckboxChange(channel as Channel)}
                  className="mr-1"
                />
                <label htmlFor={channel} className="text-sm">{channel}</label>
              </div>
            ))}
          </div>
        </div>
        <div style={{height: '400px'}}>
          <Line data={chartData} options={options} ref={chartComponentRef} />
        </div>
      </div>
    );
  };
  
  export default ExperimentVisualSampleSection;