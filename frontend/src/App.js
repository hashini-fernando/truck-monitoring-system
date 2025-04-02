import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainDashboard from './Pages/MainDashboard';
import StationPage from './Pages/StationPage';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import Footer from './Components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-app-content">
          <Sidebar />
          
          <div className="content-area">
            <Routes>
              <Route path="/" element={<MainDashboard />} />
              <Route path="/station/:id" element={<StationPage />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;