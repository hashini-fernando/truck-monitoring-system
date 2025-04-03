import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from './Pages/MainDashboard';
import StationPage from './Pages/StationPage';
import Login from './Pages/Login';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import Footer from './Components/Footer';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('fleetUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('fleetUser');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('fleetUser', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('fleetUser');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <div className="auth-layout">
                <Login onLogin={handleLogin} />
              </div>
            )
          } 
        />

        {/* Protected routes */}
        <Route 
          path="/*" 
          element={
            user ? (
              <div className="app-container">
                <Header user={user} onLogout={handleLogout} />
                <div className="main-app-content">
                  <Sidebar user={user} />
                  <div className="content-area">
                    <Routes>
                      <Route path="/" element={<MainDashboard />} />
                      <Route path="/station/:id" element={<StationPage />} />
                    </Routes>
                  </div>
                </div>
                <Footer />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
