import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Header.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="navbar navbar-light fleet-header">
      <div className="header-left">
        <h1>UNILEVER FLEET FLOW</h1>
      </div>
      
      <div className="header-right">

      <p className="header-timestamp">{formattedDate}</p>
        {user && (
          <div className="user-info">
            <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
            <span className="username">{user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        )}
       
      </div>
    </header>
  );
};

export default Header;