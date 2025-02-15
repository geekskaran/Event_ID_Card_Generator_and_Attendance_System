import React, { useState, useRef, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { 
  Camera, 
  Download, 
  Trash2, 
  Scan, 
  StopCircle, 
  Camera as CameraIcon,
  RotateCcw,
  FileText,
  Clock
} from 'lucide-react';

const EntryScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [scanMode, setScanMode] = useState('plate');
  const [processing, setProcessing] = useState(false);
  const [worker, setWorker] = useState(null);

  // Worker initialization and cleanup code remains the same...
  useEffect(() => {
    const initWorker = async () => {
      const newWorker = await createWorker('eng');
      setWorker(newWorker);
    };
    initWorker();
    return () => {
      if (worker) worker.terminate();
      stopCamera();
    };
  }, []);

  // Camera and scanning functions remain the same...
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || !worker) return;

    setProcessing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const { data: { text } } = await worker.recognize(canvas);
      const cleanedText = text.replace(/\s+/g, '').toUpperCase();
      
      if (cleanedText) {
        handleScanComplete(cleanedText);
      }
    } catch (err) {
      console.error('OCR Error:', err);
    }
    
    setProcessing(false);
  };

  const handleScanComplete = (result) => {
    setScannedData(result);
    const entryRecord = {
      id: `SCAN-${Date.now()}`,
      identifier: result,
      type: scanMode,
      timestamp: new Date().toISOString(),
    };
    setEntries(prev => [...prev, entryRecord]);
  };

  const handleManualEntry = (e) => {
    e.preventDefault();
    const manualData = e.target.manualInput.value;
    if (manualData) {
      handleScanComplete(manualData);
      e.target.manualInput.value = '';
    }
  };

  const handleExport = () => {
    const exportData = entries.map(entry => ({
      identifier: entry.identifier,
      type: entry.type,
      timestamp: entry.timestamp
    }));

    const csvContent = "data:text/csv;charset=utf-8," + 
      "Identifier,Type,Timestamp\n" +
      exportData.map(row => 
        `${row.identifier},${row.type},${row.timestamp}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `scanned_entries_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Scan className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Entry Scanner</h1>
                <p className="text-sm text-gray-500">Scan and manage entry records</p>
              </div>
            </div>
            
            {/* Mode Selector */}
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setScanMode('plate')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  scanMode === 'plate'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                License Plate
              </button>
              <button
                onClick={() => setScanMode('barcode')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  scanMode === 'barcode'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Barcode
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              {!scanning ? (
                <button
                  onClick={startCamera}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <CameraIcon className="h-5 w-5" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={stopCamera}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <StopCircle className="h-5 w-5" />
                    <span>Stop Camera</span>
                  </button>
                  {scanMode === 'plate' && (
                    <button
                      onClick={captureImage}
                      disabled={processing}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Camera className="h-5 w-5" />
                      <span>{processing ? 'Processing...' : 'Capture & Scan'}</span>
                    </button>
                  )}
                </div>
              )}

              {scanning && (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              <form onSubmit={handleManualEntry} className="flex gap-2">
                <input
                  type="text"
                  name="manualInput"
                  placeholder={`Enter ${scanMode === 'barcode' ? 'barcode' : 'license plate'} manually`}
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                />
                <button
                  type="submit"
                  className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Enter
                </button>
              </form>

              {scannedData && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <FileText className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Successfully Scanned!</h3>
                      <p className="mt-1 text-sm text-green-600">
                        {scanMode === 'barcode' ? 'Barcode' : 'License Plate'}: {scannedData}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Entries Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">Recent Scans</h2>
              </div>
              {entries.length > 0 && (
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {entries.length === 0 ? (
                <div className="text-center py-6">
                  <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No entries yet. Start scanning to see records here.</p>
                </div>
              ) : (
                entries.slice().reverse().map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {entry.identifier}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {entry.type}
                      </span>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryScanner;