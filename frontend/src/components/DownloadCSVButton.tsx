// DownloadCSVButton.tsx
import React from 'react';

interface DownloadCSVButtonProps {
  experimentId: number;
  sampleId: number | null;
}

const DownloadCSVButton: React.FC<DownloadCSVButtonProps> = ({ experimentId, sampleId }: DownloadCSVButtonProps) => {
    
    if (sampleId === null) {
    return (
      <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed" disabled>
        Download CSV
      </button>
    );
  }

  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      <a href={`http://localhost:8000/experiment_visual_sample_csv/${experimentId}/${sampleId}`} download>
        Download CSV
      </a>
    </button>
  );
};

export default DownloadCSVButton;