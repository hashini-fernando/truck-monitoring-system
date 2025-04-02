import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import '../Styles/Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <>
     
      <button className="mobile-toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <nav>
          <ul className="sidebar-nav">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                end
                onClick={() => setIsCollapsed(false)}
              >
                Main Dashboard
              </NavLink>
            </li>
            
            {[...Array(10)].map((_, i) => (
              <li key={`station-${i+1}`}>
                <NavLink
                  to={`/station/${i + 1}`}
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setIsCollapsed(false)}
                >
                  Station {i + 1}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;