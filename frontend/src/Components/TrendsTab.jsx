import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/Report.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const TrendsTab = () => {
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
  // Add this function to your component, right after the handleSubmit function
const handleReset = () => {
  setFilters({ ...initialFilters });
  fetchRecords(); // This will fetch records without any filters
};

// Then update your reset button in the JSX to use this function:
<button type="button" onClick={handleReset} className="reset-btn">Reset</button>

  const [filters, setFilters] = useState({ ...initialFilters });
  

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
      
      // Validate duration if provided
      if (filters.duration !== '' && !validateDuration(filters.duration)) {
        toast.error('Invalid duration format. Please use HH:MM:SS (e.g., 02:30:45)');
        return;
      }
    fetchRecords(filters, true);
    setFilters({ ...initialFilters });
  };
//different colors for high hours
  const getBarColor = (hours) => {
    if (hours > 6) return 'rgba(255, 99, 132, 0.8)'; 
    if (hours > 3) return 'rgba(75, 192, 192, 0.8)'; 
    return 'rgba(255, 165, 0, 0.8)'; 
  };

  const chartData = {
    labels: records.map(record => {
      const date = new Date(record.first_scan_time);
      const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateString = date.toLocaleDateString();
      return `${timeString}\n${dateString}`;
    }),
    datasets: [
      {
        label: 'Total Time at Dock (hours)',
        data: records.map(record => {
          const [hours, minutes] = record.duration.split(':').map(Number);
          return hours + minutes / 60;
        }),
        backgroundColor: records.map(record => {
          const [hours, minutes] = record.duration.split(':').map(Number);
          return getBarColor(hours + minutes / 60);
        }),
        barThickness: 30,
       
        vehicleNos: records.map(record => record.vehicle_no),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Count of Trucks',
        color: 'white',
        font: {
          size: 16,
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: 'white',
        formatter: (value, context) => {
          const vehicleNo = context.dataset.vehicleNos[context.dataIndex]; 
          return `${value.toFixed(1)}h\n(${vehicleNo})`; 
        },
        font: {
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const record = records[tooltipItem.dataIndex]; 
            return `${record.duration} (${record.vehicle_no})`; 
          }
        }
      }
      
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time (8 AM - 8 PM)',
          color: 'white',
        },
        ticks: {
          color: 'white',
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          callback: function(value) {
            const label = this.getLabelForValue(value);
            return label.split('\\n');
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        
      },
    },
  };

  return (
    <div className="trends-container">
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
              pattern="^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$"
              title="Please enter duration in HH:MM:SS format (e.g., 02:30:45)"
            />
          </div>
        </div>
        
        <div className="button-row">
          <button type="submit" className="search-btn">Search</button>
          <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
        </div>
      </form>

      <div className="summary-card">
        <h3>Total Lorries Dispatched: <span>{records.length}</span></h3>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading records...</p>
        </div>
      ) : (
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );


};

export default TrendsTab;
