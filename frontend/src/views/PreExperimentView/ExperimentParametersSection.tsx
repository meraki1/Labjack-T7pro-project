// ExperimentParametersSection.tsx
import '../../index.css';
import { useEffect, useState } from 'react';

const parameterRanges: { [key: string]: [number, number] } = {
    'samp_rate': [0, 1000],
    'collection_dur': [0, 1000],
    'meas_interval': [0, 1000],
};

export default function ExperimentParametersSection() {
    const [parameters, setParameters] = useState<string[]>([]);
    const [sampRate, setSampRate] = useState((parameterRanges['samp_rate'][0] + parameterRanges['samp_rate'][1]) / 2);
    const [collectionDur, setCollectionDur] = useState((parameterRanges['collection_dur'][0] + parameterRanges['collection_dur'][1]) / 2);
    const [measInterval, setMeasInterval] = useState((parameterRanges['meas_interval'][0] + parameterRanges['meas_interval'][1]) / 2);

    useEffect(() => {
        fetch('http://localhost:8000/experimentParameters/')
            .then(response => response.json())
            .then(data => setParameters(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const formatParamName = (paramName: string) => {
        switch(paramName) {
            case 'samp_rate':
                return 'Sampling rate';
            case 'collection_dur':
                return 'Duration of collection';
            case 'meas_interval':
                return 'Measurement interval';
            case 'notes':
                return 'Notes about experiment';
            default:
                return paramName;
        }
    }

    return (
        <div className="text-stone-200 mt-4 mb-4 w-2/5 font-sans p-4 bg-gray-100 rounded-lg shadow-lg">
            {parameters.map((param, index) => (
                <div key={index} className="mb-4 p-2 bg-white rounded-lg shadow-md">
                    <label htmlFor={param} className="font-bold block mb-4 text-lg text-gray-700">{formatParamName(param)}</label>
                    {param !== 'notes' ? (
                        <div className="relative">
                            <input type="range" id={param} name={param} min={parameterRanges[param][0].toString()} max={parameterRanges[param][1].toString()} step={(param === 'meas_interval' ? 10 : 50).toString()} defaultValue={((parameterRanges[param][0] + parameterRanges[param][1]) / 2).toString()} className="w-full h-4 bg-cyan-200 rounded-full mb-4" list={param+"ticks"} onChange={e => {
                                if (param === 'samp_rate') setSampRate(Number(e.target.value));
                                else if (param === 'collection_dur') setCollectionDur(Number(e.target.value));
                                else if (param === 'meas_interval') setMeasInterval(Number(e.target.value));
                            }} />
                            <div className="absolute text-gray-600 bottom-1 left-0">{parameterRanges[param][0].toString()}</div>
                            <div className="absolute text-gray-600 bottom-1 right-0">{parameterRanges[param][1].toString()}</div>
                            <datalist id={param+"ticks"}>
                                <option value={parameterRanges[param][0].toString()} label={parameterRanges[param][0].toString()} />
                                <option value={((parameterRanges[param][0] + parameterRanges[param][1]) / 2).toString()} label={((parameterRanges[param][0] + parameterRanges[param][1]) / 2).toString()} />
                                <option value={parameterRanges[param][1].toString()} label={parameterRanges[param][1].toString()} />
                            </datalist>
                            <div className='flex justify-center mb-4 text-gray-700'>Current value: {param === 'samp_rate' ? sampRate : param === 'collection_dur' ? collectionDur : measInterval}</div>
                        </div>
                    ) : (
                        <textarea id={param} name={param} rows={4} className="w-full p-2 border border-gray-200 rounded shadow-sm text-wrap text-justify text-gray-900 font-sans resize-none overflow-auto" />
                    )}
                </div>
            ))}
        </div>
    );
}