// ExperimentParametersSection.tsx
import '../../index.css';
import { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { useQuery } from 'react-query';

interface Parameter {
    param_type: string;
    param_type_id: number;
    minValue: number;
    maxValue: number;
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

const parameterRanges: { [key: string]: [number, number] } = {
    'Sampling Rate': [0, 1000],
    'Duration of Collection': [0, 100],
    'Measurement Interval': [0, 10],
};

const ExperimentParametersSection: React.FC<ExperimentParametersSectionProps> = ({ setExperimentParameters }) => {
    const [notes, setNotes] = useState('');
    const [parameterValues, setParameterValues] = useState<{ [key: number]: { value: number | string, parameter_name: string } }>({});
    const { data: parameters, status } = useQuery('parameters', fetchParameters);

    const notesParameter = parameters?.find(param => param.param_type === 'Notes about Experiment');

    useEffect(() => {
        if (parameters) {
            const initialParameterValues: { [key: number]: { value: number | string, parameter_name: string } } = {};
            parameters.forEach((param: Parameter) => {
                if (param.param_type !== 'Notes about Experiment') {
                    const [minValue, maxValue] = parameterRanges[param.param_type];
                    const middleValue = (minValue + maxValue) / 2; 
                    const defaultValue = middleValue;
                    initialParameterValues[param.param_type_id] = { value: defaultValue, parameter_name: param.param_type };
                }
            });
            
            if (notesParameter) {
                setExperimentParameters(prevParameters => ({
                    ...prevParameters,
                    [notesParameter.param_type_id]: { value: notes || 'No notes for this experiment', parameter_name: notesParameter.param_type },
                    ...initialParameterValues,
                }));
            } else {
                setExperimentParameters(prevParameters => ({
                    ...prevParameters,
                    ...initialParameterValues,
                }));
            }
            
            setParameterValues(initialParameterValues);
        }
    }, [parameters, notes, setExperimentParameters, notesParameter]);
    

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error fetching data</div>;
    }

    const handleParameterChange = (paramId: number, value: number) => {
        setParameterValues(prevValues => ({
            ...prevValues,
            [paramId]: { value: value, parameter_name: parameters?.find(param => param.param_type_id === paramId)?.param_type || '' },
        }));
    };    

    return (
        <div className="text-stone-200 mt-2 w-1/3 font-sans p-2 bg-gray-100 rounded-lg shadow-lg ml-4">
            {parameters?.map(({ param_type, param_type_id }: Parameter) => {
                if (param_type !== 'Notes about Experiment') {
                    const [minValue, maxValue] = parameterRanges[param_type];
                    const defaultValue = parameterValues[param_type_id]?.value ?? (minValue + maxValue) / 2; // Use stored value or middle value
                    const stepSize = (maxValue - minValue) / 20; // Use stored step size or calculated step size
                    return (
                        <div key={param_type_id} className="mb-2 p-2 bg-white rounded-lg shadow-md">
                            <label htmlFor={param_type} className="font-bold block mb-2 text-md text-gray-700">{param_type}</label>
                            <div className="relative">
                                <input
                                    type="range"
                                    id={param_type}
                                    name={param_type}
                                    min={minValue.toString()}
                                    max={maxValue.toString()}
                                    step={stepSize.toString()} // Use calculated step size
                                    defaultValue={defaultValue.toString()}
                                    className="w-full h-4 bg-cyan-200 rounded-full mb-2"
                                    onChange={e => handleParameterChange(param_type_id, Number(e.target.value))}
                                />
                                <div className="flex justify-between text-gray-600">
                                    <div>{minValue}</div>
                                    <div>Current value: {parameterValues[param_type_id]?.value}</div>
                                    <div>{maxValue}</div>
                                </div>
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