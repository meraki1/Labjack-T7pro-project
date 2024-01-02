import React, { useEffect, useState } from 'react';
import './Header.css'; // Import the CSS file
import fetchFromAPI from '../api'; // Import the fetchFromAPI function

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [experimentNumber, setExperimentNumber] = useState<number | null>(null);

  useEffect(() => {
    fetchExperimentNumber();
  }, []);

  const fetchExperimentNumber = async () => {
    try {
      // Use fetchFromAPI function here
      const data = await fetchFromAPI('/experiments/experiment_number');

      // If there's no log_id in the table, the backend should return 0
      setExperimentNumber(data.experimentNumber);
    } catch (error) {
      console.error('Failed to fetch experiment number:', error);
    }
  };

  return (
    <header className="header">
      <h1 className="title">Labjack T7 Pro Experiments</h1>
      {experimentNumber !== null && <p className="experiment-number">Experiment Number: {experimentNumber}</p>}
    </header>
  );
};

export default Header;
