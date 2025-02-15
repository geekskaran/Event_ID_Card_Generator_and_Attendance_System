



// components/shared/ExportButton.jsx
import React from 'react';
import { exportToExcel } from '../../utils/excelExport';

export const ExportButton = ({ data, filename }) => {
  const handleExport = () => {
    exportToExcel(data, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    >
      Export to Excel
    </button>
  );
};

export default ExportButton;