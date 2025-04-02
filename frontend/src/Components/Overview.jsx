import React from 'react';
import '../Styles/Overview.css';
import { FaTruck, FaStopwatch, FaClock, FaExclamationCircle } from 'react-icons/fa';

const OverviewTab = () => {
  return (
    <div className="overview-container">
      <div className="overview-row">
        <div className="overview-box">
          <FaTruck className="icon" />
          <h4>Vehicle Number</h4>
          <p className="value">CD -3856</p>
        </div>
        <div className="overview-box">
          <FaStopwatch className="icon" />
          <h4>Time Duration</h4>
          <p className="value">6 hours, 7 minutes</p>
        </div>
      </div>

      <div className="overview-row">
        <div className="overview-box">
          <FaClock className="icon" />
          <h4>First Scan Time</h4>
          <p className="value">12:56 PM</p>
        </div>
        <div className="overview-box">
          <FaClock className="icon" />
          <h4>Last Scan Time</h4>
          <p className="value">06:03 PM</p>
        </div>
        <div className="overview-box">
          <FaExclamationCircle className="icon" />
          <h4>Vehicle Status</h4>
          <p className="value">Active</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
