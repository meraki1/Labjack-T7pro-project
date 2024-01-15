import { Routes, Route } from 'react-router-dom';
import HomePage from './views/HomePage/HomePage';
import PreExperimentView from './views/PreExperimentView/PreExperimentView';
import Devices from './views/DeviceView/Devices';
import DeviceSetup from './views/DeviceSetupView/DeviceSetup';


const RoutesComponent = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/pre-experiment" element={<PreExperimentView />} />
    <Route path="/devices" element={<Devices />} />
    <Route path="/set-up-device" element={<DeviceSetup />} />
    {/* Add more routes as needed */}
  </Routes>
);

export default RoutesComponent;