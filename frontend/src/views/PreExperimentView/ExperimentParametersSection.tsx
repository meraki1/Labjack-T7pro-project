// ExperimentParametersSection.tsx
import '../../index.css';
import { useState } from 'react';
import { useQuery } from 'react-query';

const parameterRanges: { [key: string]: [number, number] } = {
    'Sampling Rate': [0, 1000],
    'Duration of Collection': [0, 1000],
    'Measurement Interval': [0, 1000],
};

async function fetchParameters() {
    const res = await fetch('http://localhost:8000/experimentParameters/');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

export default function ExperimentParametersSection() {
    const [sampRate, setSampRate] = useState((parameterRanges['Sampling Rate'][0] + parameterRanges['Sampling Rate'][1]) / 2);
    const [collectionDur, setCollectionDur] = useState((parameterRanges['Duration of Collection'][0] + parameterRanges['Duration of Collection'][1]) / 2);
    const [measInterval, setMeasInterval] = useState((parameterRanges['Measurement Interval'][0] + parameterRanges['Measurement Interval'][1]) / 2);

    const { data: parameters, status } = useQuery('parameters', fetchParameters);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error fetching data</div>;
    }

    return (
        <div className="text-stone-200 mt-4 mb-4 w-2/5 font-sans p-4 bg-gray-100 rounded-lg shadow-lg">
            {parameters.map((param: string, index: number) => (
                <div key={index} className="mb-4 p-2 bg-white rounded-lg shadow-md">
                    <label htmlFor={param} className="font-bold block mb-4 text-lg text-gray-700">{param}</label>
                    {param !== 'Notes about Experiment' ? (
                        <div className="relative">
                            <input type="range" id={param} name={param} min={parameterRanges[param][0].toString()} max={parameterRanges[param][1].toString()} step={(param === 'Measurement Interval' ? 10 : 50).toString()} defaultValue={((parameterRanges[param][0] + parameterRanges[param][1]) / 2).toString()} className="w-full h-4 bg-cyan-200 rounded-full mb-4" list={param+"ticks"} onChange={e => {
                                if (param === 'Sampling Rate') setSampRate(Number(e.target.value));
                                else if (param === 'Duration of Collection') setCollectionDur(Number(e.target.value));
                                else if (param === 'Measurement Interval') setMeasInterval(Number(e.target.value));
                            }} />
                            <div className="absolute text-gray-600 bottom-1 left-0">{parameterRanges[param][0].toString()}</div>
                            <div className="absolute text-gray-600 bottom-1 right-0">{parameterRanges[param][1].toString()}</div>
                            <datalist id={param+"ticks"}>
                                <option value={parameterRanges[param][0].toString()} label={parameterRanges[param][0].toString()} />
                                <option value={((parameterRanges[param][0] + parameterRanges[param][1]) / 2).toString()} label={((parameterRanges[param][0] + parameterRanges[param][1]) / 2).toString()} />
                                <option value={parameterRanges[param][1].toString()} label={parameterRanges[param][1].toString()} />
                            </datalist>
                            <div className='flex justify-center mb-4 text-gray-700'>Current value: {param === 'Sampling Rate' ? sampRate : param === 'Duration of Collection' ? collectionDur : measInterval}</div>
                        </div>
                    ) : (
                        <textarea id={param} name={param} rows={4} className="w-full p-2 border border-gray-200 rounded shadow-sm text-wrap text-justify text-gray-900 font-sans resize-none overflow-auto" />
                    )}
                </div>
            ))}
        </div>
    );
}