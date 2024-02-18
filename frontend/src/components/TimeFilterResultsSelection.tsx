// TimeFilter.tsx
import React from 'react';

interface TimeFilterProps {
    startTime: string;
    endTime: string;
    onStartTimeChange: (startTime: string) => void;
    onEndTimeChange: (endTime: string) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ startTime, endTime, onStartTimeChange, onEndTimeChange }) => {
    return (
        <div className="flex justify-between mb-4">
            <input
                type="datetime-local"
                value={startTime}
                onChange={e => onStartTimeChange(e.target.value)}
                className="p-2 border border-gray-300 rounded text-cyan-950" 
            />
            <input
                type="datetime-local"
                value={endTime}
                onChange={e => onEndTimeChange(e.target.value)}
                className="p-2 border border-gray-300 rounded text-cyan-950"
            />
        </div>
    );
};

export default TimeFilter;
