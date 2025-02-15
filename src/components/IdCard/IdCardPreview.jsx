

// IdCardPreview.jsx
import React from 'react';
import { generateBarcode } from '../../utils/barcodeGenerator';
import JsBarcode from 'jsbarcode';

const IdCardPreview = ({ data, profilePhoto }) => {
  const barcodeId = generateBarcode();

  React.useEffect(() => {
    // Generate barcode using JsBarcode
    try {
      JsBarcode("#barcode", barcodeId, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true
      });
    } catch (error) {
      console.error('Error generating barcode:', error);
    }
  }, [barcodeId]);

  return (
    <div id="id-card-preview" className="bg-white p-6 rounded-lg shadow">
      <div className="border-2 border-gray-200 p-4 rounded-lg">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold">{data.eventName || 'Event Name'}</h3>
          <p className="text-sm text-gray-500">ID Card</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-center mb-4">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full border-2 border-gray-200 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No photo</span>
              </div>
            )}
          </div>
          <div className="text-center">
            <h4 className="text-lg font-semibold">{data.name || 'Name'}</h4>
            <p className="text-sm text-gray-600">{data.email || 'Email'}</p>
            <p className="text-sm text-gray-600">{data.phoneNumber || 'Phone'}</p>
          </div>
          <div className="mt-4 text-center">
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-xs text-gray-600">ID: {barcodeId}</p>
              <svg id="barcode" className="w-full h-16 my-2"></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCardPreview;