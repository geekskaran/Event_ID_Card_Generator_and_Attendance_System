// EntryLogger.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { exportToExcel, formatDataForExport } from '../../utils/excelExport';

const EntryLogger = () => {
  const [entries, setEntries] = useLocalStorage('entries', []);
  const [formData, setFormData] = useState({
    type: 'vehicle',
    identifier: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      ...formData,
      id: `ENTRY-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setEntries([...entries, newEntry]);
    setFormData({
      type: 'vehicle',
      identifier: '',
      description: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleExport = () => {
    const formattedData = formatDataForExport(entries, 'Entry Log');
    exportToExcel(formattedData, 'entry-logs');
  };

  const handleDelete = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Log New Entry</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Entry Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="vehicle">Vehicle</option>
                  <option value="visitor">Visitor</option>
                  <option value="package">Package</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {formData.type === 'vehicle' ? 'Vehicle Number' : 'Identifier'}
                </label>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Log Entry
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Entries</h2>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Export
            </button>
          </div>
          <div className="space-y-4">
            {entries.slice().reverse().map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{entry.identifier}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm">{entry.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryLogger;
