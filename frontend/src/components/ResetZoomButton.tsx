// ResetZoomButton.tsx
import React from 'react';

interface ResetZoomButtonProps {
    onClick: () => void;
}

const ResetZoomButton: React.FC<ResetZoomButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Reset Zoom
    </button>
  );
};

export default ResetZoomButton;