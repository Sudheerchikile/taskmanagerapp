import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import TaskForm from './components/TaskComponent';
import TasksChart from './components/MetricsComponent';
import Navbar from './components/Header';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <div className="App">
        <Routes>
          <Route path="/" element={<TaskForm />} />
          <Route path="/metrics" element={<TasksChart />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

