// barcodeGenerator.js
export const generateBarcode = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `ID${timestamp}${random}`;
  };
  
  export const generateQRCode = (data) => {
    // Using a QR code library like qrcode.js, you would generate
    // a QR code here. For now, we'll return a placeholder
    return `QR-${data}`;
  };
 