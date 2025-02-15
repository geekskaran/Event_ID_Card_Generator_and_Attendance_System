# Smart ID & QR Code-Based Attendance System 📱

A modern web application built with React.js and Tailwind CSS that automates attendance tracking and ID card management using QR code scanning technology.

https://eveman.netlify.app/

## 🌟 Features

### 1. ID Card Generation & Management
- Generate professional ID cards with:
  - Name
  - Event Name
  - Date & Time
  - Phone Number
  - Auto-generated QR Code
  - Profile Photo Upload
  - Downloadable ID Card Image
  - Unique ID Generation

### 2. Real-Time QR Code Scanning
- Live camera feed for QR code scanning
- High-speed QR code detection
- Multiple scanning modes:
  - Front camera
  - Back camera support
- Instant scan verification
- Duplicate scan prevention
- Visual scanning guide
- Real-time success/error notifications

### 3. Attendance Tracking
- Real-time attendance logging
- Precise timestamp recording
- Attendance status tracking
- Daily attendance statistics
- Duplicate entry prevention
- Multi-session support

### 4. Advanced History Management
- Comprehensive filtering options:
  - Today's Records
  - Specific Date
  - Last Week
  - Last Month
  - All Records
- Chronological record display
- Export functionality to Excel
- Detailed attendance analytics

## 🚀 Technologies Used

- **Frontend Framework:** React.js
- **Styling:** Tailwind CSS
- **QR Code Generation:** qrcode.js
- **QR Code Scanning:** html5-qrcode
- **Data Export:** SheetJS (XLSX)
- **Local Storage:** Browser's LocalStorage API
- **Camera Access:** WebRTC API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with camera access
- Stable internet connection for QR code scanning

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-id-system.git
cd smart-id-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install QR code specific packages:
```bash
npm install html5-qrcode qrcode
# or
yarn add html5-qrcode qrcode
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Open http://localhost:3000 in your browser

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "html5-qrcode": "^2.3.8",
    "qrcode": "^1.5.3",
    "xlsx": "^0.18.5",
    "tailwindcss": "^3.3.0"
  }
}
```

## 🎯 Usage

### ID Card Generation:
1. Navigate to the ID Card Generator
2. Fill in required details
3. Upload profile photo
4. System automatically generates QR code
5. Click "Generate & Download"
6. Save the generated ID card

### Attendance Scanning:
1. Click "Start Scanning"
2. Position QR code within the scanning area
3. Automatic detection and verification
4. View confirmation and attendance status
5. Check scan history below

### Managing History:
1. Use filter options to view specific periods
2. Export data using the "Export" button
3. View daily attendance statistics
4. Monitor individual scan details
5. Access detailed attendance analytics

## 📁 Project Structure

```
smart-id-system/
├── src/
│   ├── components/
│   │   ├── IdCard/
│   │   │   ├── IdCardGenerator.jsx
│   │   │   ├── IdCardPreview.jsx
│   │   │   └── IdCardScanner.jsx
│   │   ├── shared/
│   │   │   ├── Alert.jsx
│   │   │   └── ExportButton.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   ├── utils/
│   │   ├── qrCodeGenerator.js
│   │   └── excelExport.js
│   ├── App.jsx
│   └── index.jsx
└── package.json
```

## 💡 Key Features of QR Code Implementation

- **Fast Scanning:** Quick and accurate QR code detection
- **Error Correction:** Built-in error correction for damaged or partially obscured codes
- **Data Capacity:** Store more information in QR codes compared to traditional barcodes
- **Omnidirectional Scanning:** Scan QR codes from any angle
- **Enhanced Security:** Support for encrypted QR code data
- **Multiple Formats:** Support various QR code formats and sizes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [html5-qrcode](https://github.com/mebjas/html5-qrcode) for QR code scanning
- [qrcode.js](https://github.com/soldair/node-qrcode) for QR code generation
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [SheetJS](https://sheetjs.com/) for Excel export functionality

## 📞 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - techgeekskaran@gmail.com

Project Link: https://eveman.netlify.app/

## 🚨 Support

For support, email techgeekskaran@gmail.com

---

Made with ❤️ by [Karan yadav]
