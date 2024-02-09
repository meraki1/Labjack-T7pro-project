// ExperimentParametersSection.tsx
import '../../index.css';
import { useState } from 'react';
import { useQuery } from 'react-query';

async function fetchParameters() {
    const res = await fetch('http://localhost:8000/experimentParameters/');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

const parameterRanges: { [key: string]: [number, number] } = {
    'Sampling Rate': [0, 1000],
    'Duration of Collection': [0, 1000],
    'Measurement Interval': [0, 1000],
};

export default function ExperimentParametersSection() {
    const [parameterValues, setParameterValues] = useState(() => {
        const defaultValues: { [key: string]: number } = {};
        Object.keys(parameterRanges).forEach(param => {
            defaultValues[param] = (parameterRanges[param][0] + parameterRanges[param][1]) / 2;
        });
        return defaultValues;
    });

    const { data: parameters, status } = useQuery('parameters', fetchParameters);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error fetching data</div>;
    }

    const handleParameterChange = (param: string, value: number) => {
        setParameterValues(prevValues => ({
            ...prevValues,
            [param]: value,
        }));
    };

    return (
        <div className="text-stone-200 mt-2 w-2/5 font-sans p-2 bg-gray-100 rounded-lg shadow-lg ml-4">
            {parameters.map(({ param_type, param_type_id }: { param_type: string, param_type_id: number }, index: number) => (
                <div key={index} className="mb-2 p-2 bg-white rounded-lg shadow-md">
                    <label htmlFor={param_type} className="font-bold block mb-2 text-md text-gray-700">{param_type}</label>
                    {param_type !== 'Notes about Experiment' ? (
                        <div className="relative">
                            <input
                                type="range"
                                id={param_type}
                                name={param_type}
                                min={parameterRanges[param_type][0].toString()}
                                max={parameterRanges[param_type][1].toString()}
                                step={(param_type === 'Measurement Interval' ? 10 : 50).toString()}
                                defaultValue={((parameterRanges[param_type][0] + parameterRanges[param_type][1]) / 2).toString()}
                                className="w-full h-4 bg-cyan-200 rounded-full mb-2"
                                onChange={e => handleParameterChange(param_type, Number(e.target.value))}
                            />
                            <div className="flex justify-between text-gray-600">
                                <div>{parameterRanges[param_type][0].toString()}</div>
                                <div>Current value: {parameterValues[param_type]}</div>
                                <div>{parameterRanges[param_type][1].toString()}</div>
                            </div>
                        </div>
                    ) : (
                        <textarea id={param_type} name={param_type} rows={4} className="w-full p-2 border border-gray-200 rounded shadow-sm text-wrap text-justify text-gray-900 font-sans resize-none overflow-auto" />
                    )}
                </div>
            ))}
        </div>
    );    
}