// BarcodeScanner.jsx
import React, { useRef, useEffect, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onScan, onError, onInit }) => {
  const scannerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const mediaStreamRef = useRef(null);

  const stopMediaTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
  };

  const cleanup = () => {
    if (isInitialized) {
      try {
        Quagga.stop();
        stopMediaTracks();
        setIsInitialized(false);
      } catch (err) {
        console.error('Error stopping Quagga:', err);
      }
    }
  };

  useEffect(() => {
    if (scannerRef.current && !isInitialized) {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: { min: 450 },
            height: { min: 300 },
            aspectRatio: { min: 1, max: 2 }
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader"]
        },
        locate: true
      }, function(err) {
        if (err) {
          if (onError) onError(err);
          return;
        }
        // Store media stream reference for cleanup
        const videoTrack = Quagga.CameraAccess.getActiveTrack();
        if (videoTrack) {
          mediaStreamRef.current = new MediaStream([videoTrack]);
        }
        setIsInitialized(true);
        if (onInit) onInit();
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        if (result && result.codeResult && result.codeResult.code) {
          onScan(result.codeResult.code);
        }
      });
    }

    // Cleanup function
    return () => {
      cleanup();
    };
  }, [onScan, onError, onInit, isInitialized]);

  // Add explicit cleanup method when component is unmounted or scanning is stopped
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div
      ref={scannerRef}
      className="w-full h-64 bg-black relative rounded-lg overflow-hidden"
    />
  );
};

export default BarcodeScanner