import React, { useEffect, useState } from 'react';
import '../Styles/Report.css';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StationReportTab = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [filters, setFilters] = useState({
    vehicleNo: '',
    firstScanTime: '',
    lastScanTime: '',
    duration: ''
  });

  const formatTime = (time) => {
    return time ? new Date(time).toLocaleTimeString('en-GB', { hour12: false }) : '';
  };

  const validateDuration = (duration) => {
    if (duration === '') return true;
    const regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    return regex.test(duration);
  };

  const fetchRecords = async (filterParams = {}, isSearch = false) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filterParams).toString();
      const response = await fetch(`http://localhost:8000/hh.php?stationId=${id}&${query}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'error') {
        toast.error(data.message || 'Failed to fetch records.');
        setRecords([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.error('Expected array but got:', data);
        toast.error('Unexpected response format from server.');
        setRecords([]);
        return;
      }

      if (data.length === 0) {
        if (isSearch) {
          toast.info('No records found for the given search criteria.');
        } else {
          toast.info('No recent records found.');
        }
      }

      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to fetch records.');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      toast.error('Invalid station ID!');
      return;
    }
    fetchRecords();
  }, [id]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDurationBlur = () => {
    if (filters.duration !== '' && !validateDuration(filters.duration)) {
      toast.warning('Please enter duration in HH:MM:SS format (e.g., 02:30:45)');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!filters.vehicleNo && !filters.firstScanTime && !filters.lastScanTime && !filters.duration) {
      toast.error('At least one filter must be filled!');
      return;
    }

    if (filters.duration !== '' && !validateDuration(filters.duration)) {
      toast.error('Invalid duration format. Please use HH:MM:SS (e.g., 02:30:45)');
      return;
    }
    
    fetchRecords(filters, true);
    setFilters({ vehicleNo: '', firstScanTime: '', lastScanTime: '', duration: '' });
  };

  return (
    <div className="report-container">
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

      <div className="summary-card">
            <h3 style={{ color: 'white' }}>
                Total Lorries Dispatched: <span style={{ marginRight: '510px' }}>{records.length}</span>
                <span style={{ fontSize: '0.9em'}}>Ongoing shift - 8.00 AM to 8.00 PM</span>
              </h3>
            </div>
      
      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="filter-row">
          <div className="form-group">
            <input 
              name="vehicleNo" 
              placeholder="Vehicle No" 
              value={filters.vehicleNo}
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <input 
              type="datetime-local" 
              name="firstScanTime" 
              value={filters.firstScanTime}
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <input 
              type="datetime-local" 
              name="lastScanTime" 
              value={filters.lastScanTime}
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <input 
              name="duration" 
              placeholder="Duration (HH:MM:SS)" 
              value={filters.duration}
              onChange={handleChange}
              onBlur={handleDurationBlur}
            />
          </div>
        </div>
        
        <div className="button-row">
          <button type="submit" className="search-btn">Search</button>
          <button 
            type="button" 
            onClick={() => {
              setFilters({
                vehicleNo: '',
                firstScanTime: '',
                lastScanTime: '',
                duration: ''
              });
              fetchRecords();
            }} 
            className="reset-btn"
          >
            Reset
          </button>
        </div>
      </form>

    

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading records...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Lorry ID</th>
                <th>Parking Time</th>
                <th>Loading Time</th>
                <th>Total Time at Dock</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((rec, index) => (
                  <tr key={index}>
                    <td data-label="Lorry ID">{rec.vehicle_no}</td>
                    <td data-label="Parking Time">{formatTime(rec.first_scan_time)}</td>
                    <td data-label="Loading Time">{formatTime(rec.last_scan_time)}</td>
                    <td data-label="Total Time">{rec.duration || '00:00:00'}</td>
                  </tr>
                ))
              ) : (
                <tr className="no-records">
                  <td colSpan="4">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

};

export default StationReportTab;