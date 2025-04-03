import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../Components/Header';
import '../Styles/Login.css';
import Footer from '../Components/Footer';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === '1234') {
      const userData = {
        username,
        role: 'admin'
      };
      onLogin(userData);
      toast.success('Login successful!');
      setTimeout(() => navigate('/'), 1000);
    } else {
      toast.error('Invalid credentials!');
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        <div className="login-card">
          <div className="login-header">
            <h2>Fleet Management System</h2>
            <p>Please sign in to continue</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            
            <button type="submit" className="login-btn">Sign In</button>
          </form>
        </div>
        
      </div>
      <Footer />
    </div>

  );
};

export default Login;