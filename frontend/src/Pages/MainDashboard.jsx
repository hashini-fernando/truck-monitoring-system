import React, { useState } from 'react';
import Tabs from '../Components/Tabs';
import Overview from '../Components/Overview';
import ReportTab from '../Components/ReportTab';
import TrendsTab from '../Components/TrendsTab';
import QrGenerate from '../Components/QrGenerate';


const MainDashboard = () => { 
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} title="Main Dashboard" />

      {activeTab === 'overview' && <Overview />}
      {activeTab === 'report' && <ReportTab />}
      {activeTab === 'trends' && <TrendsTab />}
      {activeTab === 'qrgenerate' && <QrGenerate />}
    </div>
  );
};

export default MainDashboard;
