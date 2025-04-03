import React from 'react';
import '../Styles/Tabs.css';

const Tabs = ({ activeTab, setActiveTab, title }) => {
  return (
    <div>
      <h2 style={{ marginBottom: '10px' }}>{title} - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
      <div className="tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'report' ? 'active' : ''}
          onClick={() => setActiveTab('report')}
        >
          Report
        </button>
        <button
          className={activeTab === 'trends' ? 'active' : ''}
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </button>

        <button
          className={activeTab === 'qrgenerate' ? 'active' : ''}
          onClick={() => setActiveTab('qrgenerate')}
        >
          QR Generate
        </button>
      </div>
    </div>
  );
};

export default Tabs;
