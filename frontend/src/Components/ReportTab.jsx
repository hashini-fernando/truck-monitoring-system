import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/Report.css';

const ReportTab = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const initialFilters = {
    stationNo: '',
    vehicleNo: '',
    firstScanTime: '',
    lastScanTime: '',
    duration: ''
  };

  const [filters, setFilters] = useState({...initialFilters});

  const validateDuration = (duration) => {
    if (duration === '') return true;
    const regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    return regex.test(duration);
  };

  const fetchRecords = async (filterParams = {}, isSearch = false) => {
    setLoading(true);

    try {
      const query = new URLSearchParams(filterParams).toString();
      const response = await fetch(`http://localhost:8000/getAllRecords.php?${query}`);
      const data = await response.json();
      setRecords(data);
      
      if (data.length === 0) {
        if (isSearch) {
          toast.info('No records match your search criteria');
        } else if (isInitialLoad) {
          toast.info('No recent records found');
        }
      } else if (isSearch) {
        toast.success(`Found ${data.length} matching records`);
      }

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDurationBlur = () => {
    if (filters.duration !== '' && !validateDuration(filters.duration)) {
      toast.warning('Please enter duration in HH:MM:SS format (e.g., 02:30:45)');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isAnyFieldFilled = Object.entries(filters).some(
      ([key, value]) => value !== '' && key !== 'duration'
    );
    
    if (!isAnyFieldFilled && filters.duration === '') {
      toast.warning('Please fill at least one search field');
      return;
    }
    
    if (filters.duration !== '' && !validateDuration(filters.duration)) {
      toast.error('Invalid duration format. Please use HH:MM:SS (e.g., 02:30:45)');
      return;
    }
    
    fetchRecords(filters, true);
  };

  const handleReset = () => {
    setFilters({...initialFilters});
    fetchRecords();
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
              name="stationNo" 
              placeholder="Station No" 
              value={filters.stationNo}
              onChange={handleChange} 
            />
          </div>
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
          <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
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
                <th>Station ID</th>
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
                    <td data-label="Station ID">{rec.station_no}</td>
                    <td data-label="Lorry ID">{rec.vehicle_no}</td>
                    <td data-label="Parking Time">{rec.first_scan_time}</td>
                    <td data-label="Loading Time">{rec.last_scan_time}</td>
                    <td data-label="Total Time">{rec.duration || '00:00:00'}</td>
                  </tr>
                ))
              ) : (
                <tr className="no-records">
                  <td colSpan="5">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportTab;