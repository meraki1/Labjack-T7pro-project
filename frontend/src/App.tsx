import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PreExperimentView from './views/PreExperimentView';
import DataCollectionView from './views/DataCollectionView';
import PostExperimentView from './views/PostExperimentView';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header title="LabJack T7 Pro Experiments" />
      <Switch>
        <Route path="/pre-experiment">
          <PreExperimentView />
        </Route>
        <Route path="/data-collection">
          <DataCollectionView />
        </Route>
        <Route path="/post-experiment">
          <PostExperimentView />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
