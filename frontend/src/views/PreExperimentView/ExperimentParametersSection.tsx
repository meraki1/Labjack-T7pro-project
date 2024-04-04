// ExperimentParametersSection.tsx
import '../../index.css';
import { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { useQuery } from 'react-query';

interface Parameter {
    param_type: string;
    param_type_id: number;
}

interface ExperimentParametersSectionProps {
    setExperimentParameters: Dispatch<SetStateAction<{ [key: number]: { value: number | string, parameter_name: string } }>>;
}

async function fetchParameters(): Promise<Parameter[]> {
    const res = await fetch('http://localhost:8000/experimentParameters/');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

const parameterInputTypes: { [key: string]: string } = {
    'Sampling Rate': 'Hz',
    'Duration of Collection': 'ms',
    'Measurement Interval': 'ms',
};

const ExperimentParametersSection: React.FC<ExperimentParametersSectionProps> = ({ setExperimentParameters }) => {
    const [notes, setNotes] = useState('');
    const { data: parameters, status } = useQuery('parameters', fetchParameters);

    const notesParameter = parameters?.find(param => param.param_type === 'Notes about Experiment');

    useEffect(() => {
        if (parameters && notesParameter) {
            setExperimentParameters(prevParameters => ({
                ...prevParameters,
                [notesParameter.param_type_id]: { value: notes || 'No notes for this experiment', parameter_name: notesParameter.param_type },
            }));
        }
    }, [parameters, notes, setExperimentParameters, notesParameter]);
    
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error fetching data</div>;
    }

    const handleParameterChange = (paramId: number, value: string) => {
        setExperimentParameters(prevParameters => ({
            ...prevParameters,
            [paramId]: { value, parameter_name: parameters?.find(param => param.param_type_id === paramId)?.param_type || '' },
        }));
    };    

    return (
        <div className="text-stone-200 mt-2 w-1/3 font-sans p-2 bg-gray-100 rounded-lg shadow-lg ml-4">
            {parameters?.map(({ param_type, param_type_id }: Parameter) => {
                if (param_type !== 'Notes about Experiment') {
                    const inputType = parameterInputTypes[param_type] || '';
                    return (
                        <div key={param_type_id} className="mb-2 p-2 bg-white rounded-lg shadow-md">
                            <label htmlFor={param_type} className="font-bold block mb-2 text-md text-gray-700">{param_type}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id={param_type}
                                    name={param_type}
                                    placeholder={`Enter ${param_type} (${inputType})`}
                                    className="w-full p-2 border border-gray-200 rounded shadow-sm text-wrap text-justify text-gray-900 font-sans"
                                    onChange={e => handleParameterChange(param_type_id, e.target.value)}
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            })}
            {notesParameter && (
                <div key={notesParameter.param_type_id} className="mb-2 p-2 bg-white rounded-lg shadow-md">
                    <label htmlFor={notesParameter.param_type} className="font-bold block mb-2 text-md text-gray-700">{notesParameter.param_type}</label>
                    <textarea
                        id={notesParameter ? notesParameter.param_type_id.toString() : ''}
                        name={notesParameter ? notesParameter.param_type : ''}
                        rows={4}
                        className="w-full p-2 border border-gray-200 rounded shadow-sm text-wrap text-justify text-gray-900 font-sans resize-none overflow-auto"
                        placeholder={notes || 'No notes for this experiment.'}
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => e.target.placeholder = notes || 'No notes for this experiment.'}
                        onChange={e => setNotes(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};

export default ExperimentParametersSection;