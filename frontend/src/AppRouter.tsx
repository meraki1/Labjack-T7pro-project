import React from 'react';
import PreExperimentView from './views/PreExperimentView';
import DataCollectionView from './views/DataCollectionView';
import PostExperimentView from './views/PostExperimentView';

function App() {
  return (
    <div className="App">
      {/* Render your views here */}
      <PreExperimentView />
      <DataCollectionView />
      <PostExperimentView />
    </div>
  );
}

export default App;