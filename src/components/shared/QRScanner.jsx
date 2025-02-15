// QRScanner.jsx
import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, onError, isScanning }) => {
  const [scanner, setScanner] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    setScanner(html5QrCode);

    return () => {
      if (html5QrCode && isRunning) {
        html5QrCode.stop()
          .catch(err => console.error('Failed to stop camera:', err))
          .finally(() => setIsRunning(false));
      }
    };
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      if (!scanner || isRunning) return;

      try {
        const qrConfig = {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
        };

        await scanner.start(
          { facingMode: "environment" },
          qrConfig,
          async (decodedText) => {
            try {
              let data;
              try {
                data = JSON.parse(decodedText);
              } catch (e) {
                data = { id: decodedText };
              }
              if (scanner.getState() === Html5Qrcode.STATE_RUNNING) {
                await scanner.pause();
              }
              onScan(data);
              setTimeout(() => {
                if (isScanning && scanner.getState() === Html5Qrcode.STATE_PAUSED) {
                  scanner.resume();
                }
              }, 2000);
            } catch (err) {
              console.error('QR Processing error:', err);
              onError('Invalid QR code format');
            }
          },
          (errorMessage) => {
            if (!errorMessage.includes("NotFoundException")) {
              console.log(`QR Scanning issue: ${errorMessage}`);
            }
          }
        );
        setIsRunning(true);
      } catch (err) {
        onError('Failed to start camera. Please check permissions.');
        console.error('Camera start error:', err);
        setIsRunning(false);
      }
    };

    const stopScanner = async () => {
      if (!scanner || !isRunning) return;

      try {
        await scanner.stop();
        setIsRunning(false);
      } catch (err) {
        console.error('Failed to stop camera:', err);
      }
    };

    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }
  }, [isScanning, scanner, onScan, onError, isRunning]);

  return (
    <div className="qr-scanner-wrapper relative">
      <div 
        id="qr-reader" 
        className="w-full max-w-lg mx-auto rounded-lg overflow-hidden bg-black"
        style={{ minHeight: '350px' }}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-64 h-64 border-2 border-blue-500 border-dashed rounded-lg"></div>
      </div>
      <style>{`
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 0.5rem;
        }
        #qr-reader {
          border: none !important;
          position: relative;
        }
        #qr-reader button {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;

// Update the style section in IdCardScanner.jsx
// Replace the <style jsx> with regular <style>
<style>{`
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

  .hover\\:bg-gray-50:hover {
    background-color: rgba(249, 250, 251, 1);
  }

  .transition-colors {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
`}</style>