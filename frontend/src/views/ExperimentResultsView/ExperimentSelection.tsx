// ExperimentSelection.tsx
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../../components/Navbar';
import BackToHomeButton from '../../components/BackToHomePageButton';
import ViewDetailsButton from '../../components/ViewDetailsButton';
import Pagination from '../../components/PaginationResultsSelection';
import TimeFilter from '../../components/TimeFilterResultsSelection'; 

interface Experiment {
    experiment_id: number;
    start_time: string; 
    folder_name: string;
}

const ExperimentSelection: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<keyof Experiment | ''>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [startTimeFilter, setStartTimeFilter] = useState<{ start: string; end: string }>({ start: '', end: '' });

    const itemsPerPage = 5; // Adjust as needed

    const { data: experiments, isLoading, isError } = useQuery('experiments', async () => {
        const response = await fetch('http://localhost:8000/experiments');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });

    const navigate = useNavigate(); // useNavigate hook

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching experiments</div>;

    const handleViewExperiment = (experimentId: number) => {
        navigate(`/experiment-results/${experimentId}`);
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const sortedExperiments = [...experiments].sort((a, b) => {
        if (sortField) {
            const fieldA = a[sortField];
            const fieldB = b[sortField];

            let comparison = 0;
            if (fieldA > fieldB) {
                comparison = 1;
            } else if (fieldA < fieldB) {
                comparison = -1;
            }

            return sortDirection === 'desc' ? comparison * -1 : comparison;
        }

        return 0;
    });

    const filteredExperiments = sortedExperiments.filter(experiment => {
        const experimentStartTime = new Date(experiment.start_time).getTime();
        const filterStartTime = startTimeFilter.start ? new Date(startTimeFilter.start).getTime() : 0;
        const filterEndTime = startTimeFilter.end ? new Date(startTimeFilter.end).getTime() : Date.now();

        return experimentStartTime >= filterStartTime && experimentStartTime <= filterEndTime;
    });

    const experimentsToShow = filteredExperiments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-cyan-950 via-sky-800 to-sky-950 font-sans text-stone-200 w-full">
            <Navbar />
            <h1 className="text-4xl mb-2 mt-2 font-semibold">Experiment Selection</h1>
            <hr className="border-t border-stone-200 w-full mt-4 text-gray-900" />
            <div className="mt-8 w-2/3 mx-auto">
                <TimeFilter
                    startTime={startTimeFilter.start}
                    endTime={startTimeFilter.end}
                    onStartTimeChange={startTime => setStartTimeFilter({ ...startTimeFilter, start: startTime })}
                    onEndTimeChange={endTime => setStartTimeFilter({ ...startTimeFilter, end: endTime })}
                />
                <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg">
                    <thead>
                        <tr>
                            <th className="p-2 border border-gray-300 bg-gray-200 text-cyan-950 text-center">
                                <button onClick={() => {
                                    setSortField('experiment_id');
                                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                }}>
                                    Experiment ID {sortField === 'experiment_id' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                                </button>
                            </th>
                            <th className="p-2 border border-gray-300 bg-gray-200 text-cyan-950 text-center">
                                <button onClick={() => {
                                    setSortField('start_time');
                                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                }}>
                                    Start Time {sortField === 'start_time' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                                </button>
                            </th>
                            <th className="p-2 border border-gray-300 bg-gray-200 text-cyan-950 text-center">
                                <button onClick={() => {
                                    setSortField('folder_name');
                                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                }}>
                                    Folder Name {sortField === 'folder_name' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                                </button>
                            </th>
                            <th className="p-2 border border-gray-300 bg-gray-200 text-cyan-950 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {experimentsToShow.map((experiment: Experiment, index: number) => (
                            <tr key={experiment.experiment_id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className="p-2 border border-gray-300 text-cyan-950 text-center">{experiment.experiment_id}</td>
                                <td className="p-2 border border-gray-300 text-cyan-950 text-center">{formatTimestamp(experiment.start_time)}</td>
                                <td className="p-2 border border-gray-300 text-cyan-950 text-center">{experiment.folder_name}</td>
                                <td className="p-2 border border-gray-300 text-cyan-950 flex justify-center">
                                    <ViewDetailsButton onClick={() => handleViewExperiment(experiment.experiment_id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mb-4">
            <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredExperiments.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                />
            </div>
            <hr className="border-stone-200 w-full mt-auto" />
            <div className="flex mt-4 mb-4 px-4 w-full justify-start items-start">
                <BackToHomeButton />
            </div>
        </div>
    );
};

export default ExperimentSelection;