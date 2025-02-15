// IdCardScanner.jsx
import React, { useState, useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { exportToExcel } from '../../utils/excelExport';
import QRScanner from '../shared/QRScanner';

const SuccessNotification = ({ message }) => (
  <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
    <div className="flex items-center space-x-2">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>{message}</span>
    </div>
  </div>
);

const IdCardScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [attendance, setAttendance] = useLocalStorage('attendance', []);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('today');
  const [scannedUser, setScannedUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  }, []);

  const handleScan = useCallback((data) => {
    const today = new Date().toDateString();
    const alreadyScannedToday = attendance.some(record => 
      record.id === data.id && 
      new Date(record.timestamp).toDateString() === today
    );

    if (alreadyScannedToday) {
      showNotification('This ID has already been scanned today!', 'error');
      return;
    }

    const attendanceRecord = {
      ...data,
      timestamp: new Date().toISOString(),
      status: 'present'
    };

    setAttendance(prev => {
      const newAttendance = [...prev, attendanceRecord];
      return newAttendance.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    });
    
    setScannedUser(data);
    setShowSuccess(true);
    
    try {
      const audio = new Audio('/success.mp3');
      audio.play();
    } catch (err) {
      console.log('Audio not supported');
    }

    setTimeout(() => {
      setShowSuccess(false);
      setScannedUser(null);
    }, 3000);
  }, [attendance, setAttendance, showNotification]);

  const handleError = useCallback((error) => {
    console.error('Scanner error:', error);
    showNotification(error, 'error');
  }, [showNotification]);

  const handleExport = () => {
    const filteredData = getFilteredAttendance();
    const formattedData = filteredData.map(record => ({
      ID: record.id,
      Name: record.name || 'N/A',
      Event: record.eventName || 'N/A',
      Time: new Date(record.timestamp).toLocaleString(),
      Status: record.status
    }));
    exportToExcel(formattedData, 'attendance-report');
    showNotification('Attendance report exported successfully!');
  };

  const getFilteredAttendance = () => {
    const now = new Date();
    const today = new Date().setHours(0, 0, 0, 0);
    
    return attendance.filter(record => {
      const recordDate = new Date(record.timestamp);
      switch (filterType) {
        case 'today':
          return recordDate.setHours(0, 0, 0, 0) === today;
        case 'date':
          return recordDate.toISOString().split('T')[0] === selectedDate;
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return recordDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return recordDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {showSuccess && (
        <SuccessNotification message="✅ Attendance recorded successfully!" />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">ID Card Scanner</h2>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Today's Count: {
                    attendance.filter(record => 
                      new Date(record.timestamp).toDateString() === new Date().toDateString()
                    ).length
                  }
                </div>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Export
                </button>
              </div>
            </div>

            {notification.show && (
              <div 
                className={`mb-4 p-4 rounded-md ${
                  notification.type === 'error' 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {notification.message}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => setScanning(!scanning)}
                className={`w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  scanning 
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {scanning ? 'Stop Scanning' : 'Start Scanning'}
              </button>

              <div className={`transition-all duration-300 ${scanning ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                <QRScanner 
                  onScan={handleScan} 
                  onError={handleError}
                  isScanning={scanning}
                />
              </div>

              {scannedUser && (
                <div className="mt-6 animate-fade-in">
                  <h3 className="text-lg font-medium mb-3">Last Scanned User</h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="text-lg font-semibold text-green-800">{scannedUser.name || scannedUser.id}</h4>
                    {scannedUser.eventName && (
                      <p className="text-green-600">{scannedUser.eventName}</p>
                    )}
                    <p className="text-sm text-green-600 mt-2">
                      Scanned at: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Table Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
          
          <div className="flex gap-4 mb-6">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="date">Specific Date</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="all">All Records</option>
            </select>

            {filterType === 'date' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>

          <div className="space-y-4">
            {getFilteredAttendance().length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No attendance records found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredAttendance().map((record, index) => (
                      <tr 
                        key={record.id + record.timestamp} 
                        className={`${index === 0 ? 'bg-green-50 animate-fade-in' : ''} hover:bg-gray-50 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(record.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.eventName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === 'present' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .hover\:bg-gray-50:hover {
          background-color: rgba(249, 250, 251, 1);
        }

        .transition-colors {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </div>
  );
};

export default IdCardScanner;