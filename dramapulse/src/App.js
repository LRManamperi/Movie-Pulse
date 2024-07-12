import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import DramaList from './components/DramaList';
import DramaDetails from './components/DramaDetails';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<DramaList />} />
          <Route path="/drama/:id" element={<DramaDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
