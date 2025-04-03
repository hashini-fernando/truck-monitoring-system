import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Tabs from '../Components/Tabs';
import Overview from '../Components/Overview';

import StationReportTab from '../Components/StationReportTab';
import StationTrendTab from '../Components/StationTrendTab';
import QrGenerate from '../Components/QrGenerate';

const StationPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} title={`Station ${id}`} />

      {activeTab === 'overview' && <Overview />}
      {activeTab === 'report' && <StationReportTab />}
      {activeTab === 'trends' && <StationTrendTab />}
      {activeTab === 'qrgenerate' && <QrGenerate />}
    </div>
  );
};

export default StationPage;
