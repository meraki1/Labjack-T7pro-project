import { Routes, Route } from 'react-router-dom';
import HomePage from './views/HomePage/HomePage';
import PreExperimentView from './views/PreExperimentView/PreExperimentView';

const RoutesComponent = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/pre-experiment" element={<PreExperimentView />} />
    {/* Add more routes as needed */}
  </Routes>
);

export default RoutesComponent;


