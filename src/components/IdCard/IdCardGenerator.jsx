

// // IdCardGenerator.jsx
// import React, { useState } from 'react';
// import { useLocalStorage } from '../../hooks/useLocalStorage';
// import { QRCodeSVG } from 'qrcode.react';
// import html2canvas from 'html2canvas';

// const IdCardGenerator = () => {
//   const [cards, setCards] = useLocalStorage('idCards', []);
//   const [formData, setFormData] = useState({
//     name: '',
//     eventName: '',
//     phoneNumber: '',
//     email: '',
//     designation: '',
//     department: '',
//     validUntil: '',
//     emergencyContact: '',
//     bloodGroup: '',
//   });
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [notification, setNotification] = useState({ show: false, message: '', type: '' });

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const showNotification = (message, type = 'success') => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => {
//       setNotification({ show: false, message: '', type: '' });
//     }, 3000);
//   };

//   const generateUniqueId = () => {
//     return 'ID' + Date.now().toString(36) + Math.random().toString(36).substr(2);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const uniqueId = generateUniqueId();
//     const newCard = {
//       ...formData,
//       id: uniqueId,
//       profilePhoto,
//       createdAt: new Date().toISOString(),
//     };
//     setCards([...cards, newCard]);
//     setShowPreview(true);

//     // Download ID Card as image
//     const cardElement = document.getElementById('id-card-preview');
//     if (cardElement) {
//       try {
//         const canvas = await html2canvas(cardElement);
//         const imageUrl = canvas.toDataURL('image/png');
//         const downloadLink = document.createElement('a');
//         downloadLink.href = imageUrl;
//         downloadLink.download = `id-card-${formData.name}.png`;
//         downloadLink.click();
        
//         showNotification('ID Card successfully generated and downloaded!');

//         // Reset form after short delay
//         setTimeout(() => {
//           setFormData({
//             name: '',
//             eventName: '',
//             phoneNumber: '',
//             email: '',
//             designation: '',
//             department: '',
//             validUntil: '',
//             emergencyContact: '',
//             bloodGroup: '',
//           });
//           setProfilePhoto(null);
//           setShowPreview(false);
//         }, 2000);
//       } catch (error) {
//         console.error('Error generating ID card:', error);
//         showNotification('Error generating ID card', 'error');
//       }
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ID Card Preview Component
//   const IdCardPreview = ({ data, photo }) => {
//     const qrData = JSON.stringify({
//       id: data.id,
//       name: data.name,
//       eventName: data.eventName,
//       designation: data.designation,
//       department: data.department,
//       email: data.email,
//       phone: data.phoneNumber,
//     });

//     return (
//       <div id="id-card-preview" className="w-96 bg-white rounded-xl overflow-hidden shadow-2xl">
//         {/* Header */}
//         <div className="bg-blue-600 text-white p-4 text-center">
//           <h3 className="text-xl font-bold">EVENT ID CARD</h3>
//           <p className="text-sm">{data.eventName}</p>
//         </div>

//         {/* Profile Section */}
//         <div className="p-6">
//           <div className="flex justify-between items-start">
//             <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-600">
//               {photo ? (
//                 <img src={photo} alt="Profile" className="w-full h-full object-cover" />
//               ) : (
//                 <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                   <span className="text-gray-400">No photo</span>
//                 </div>
//               )}
//             </div>
//             <div className="ml-4 flex-1">
//               <h4 className="text-xl font-bold text-gray-800">{data.name}</h4>
//               <p className="text-gray-600">{data.designation}</p>
//               <p className="text-sm text-gray-500">{data.department}</p>
//             </div>
//           </div>

//           {/* Details */}
//           <div className="mt-4 space-y-2">
//             <div className="grid grid-cols-2 gap-2 text-sm">
//               <div>
//                 <p className="text-gray-500">Email</p>
//                 <p className="font-medium">{data.email}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Phone</p>
//                 <p className="font-medium">{data.phoneNumber}</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-2 text-sm">
//               <div>
//                 <p className="text-gray-500">Blood Group</p>
//                 <p className="font-medium">{data.bloodGroup}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Valid Until</p>
//                 <p className="font-medium">{data.validUntil}</p>
//               </div>
//             </div>
//           </div>

//           {/* QR Code */}
//           <div className="mt-4 flex justify-center">
//             <QRCodeSVG
//               value={qrData}
//               size={128}
//               level="H"
//               includeMargin={true}
//               className="border-2 border-gray-200 rounded-lg p-2"
//             />
//           </div>

//           {/* Emergency Contact */}
//           <div className="mt-4 text-sm text-center">
//             <p className="text-gray-500">Emergency Contact</p>
//             <p className="font-medium">{data.emergencyContact}</p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t">
//           <p>ID: {data.id}</p>
//           <p>If found, please return to event organizers</p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       {notification.show && (
//         <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
//           notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
//         } text-white`}>
//           {notification.message}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-semibold mb-6">Generate ID Card</h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Photo Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
//               <div className="flex items-center space-x-4">
//                 <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
//                   {profilePhoto ? (
//                     <img src={profilePhoto} alt="Profile Preview" className="w-full h-full object-cover" />
//                   ) : (
//                     <span className="text-gray-400">No photo</span>
//                   )}
//                 </div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                   className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 />
//               </div>
//             </div>

//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Event Name</label>
//                 <input
//                   type="text"
//                   name="eventName"
//                   value={formData.eventName}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Designation</label>
//                 <input
//                   type="text"
//                   name="designation"
//                   value={formData.designation}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Department</label>
//                 <input
//                   type="text"
//                   name="department"
//                   value={formData.department}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                 <input
//                   type="tel"
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Additional Information */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Blood Group</label>
//                 <input
//                   type="text"
//                   name="bloodGroup"
//                   value={formData.bloodGroup}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Valid Until</label>
//                 <input
//                   type="date"
//                   name="validUntil"
//                   value={formData.validUntil}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
//                 <input
//                   type="tel"
//                   name="emergencyContact"
//                   value={formData.emergencyContact}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//             >
//               Generate & Download ID Card
//             </button>
//           </form>
//         </div>

//         <div className="lg:sticky lg:top-4">
//           {(formData.name || profilePhoto) && (
//             <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
//               <h3 className="text-lg font-medium mb-4">ID Card Preview</h3>
//               <div className="flex justify-center">
//                 <IdCardPreview data={formData} photo={profilePhoto} />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IdCardGenerator;

import React, { useState , useRef , useCallback , useEffect  } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { 
  Camera, 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  Calendar, 
  Heart, 
  AlertCircle,
  Download,
  Upload,
  CheckCircle,
  XCircle
} from 'lucide-react';

const IdCardGenerator = () => {
    // Use refs for form input elements to maintain focus
    const formRefs = {
      name: useRef(),
      eventName: useRef(),
      phoneNumber: useRef(),
      email: useRef(),
      designation: useRef(),
      department: useRef(),
      validUntil: useRef(),
      emergencyContact: useRef(),
      bloodGroup: useRef(),
    };




    const [cards, setCards] = useLocalStorage('idCards', []);
    const [formData, setFormData] = useState({
      name: '',
      eventName: '',
      phoneNumber: '',
      email: '',
      designation: '',
      department: '',
      validUntil: '',
      emergencyContact: '',
      bloodGroup: '',
    });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [lastFocusedInput, setLastFocusedInput] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isDragging, setIsDragging] = useState(false);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const processImageFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  }, []);

  const generateUniqueId = () => {
    return 'ID' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const uniqueId = 'ID' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const newCard = {
      ...formData,
      id: uniqueId,
      profilePhoto,
      createdAt: new Date().toISOString(),
    };

    setCards(prev => [...prev, newCard]);
    setShowPreview(true);

    try {
      const cardElement = document.getElementById('id-card-preview');
      if (cardElement) {
        const canvas = await html2canvas(cardElement);
        const imageUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = imageUrl;
        downloadLink.download = `id-card-${formData.name}.png`;
        downloadLink.click();
        
        showNotification('ID Card successfully generated and downloaded!');

        // Reset form after successful download
        setTimeout(() => {
          setFormData({
            name: '',
            eventName: '',
            phoneNumber: '',
            email: '',
            designation: '',
            department: '',
            validUntil: '',
            emergencyContact: '',
            bloodGroup: '',
          });
          setProfilePhoto(null);
          setShowPreview(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error generating ID card:', error);
      showNotification('Error generating ID card', 'error');
    }
  }, [formData, profilePhoto, setCards]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Store the currently focused input
    setLastFocusedInput(name);
  }, []);


  const InputField = useCallback(({ label, name, type = 'text', icon: Icon, ...props }) => {
    const inputRef = useRef(null);
  
    useEffect(() => {
      // Restore focus if this was the last focused input
      if (lastFocusedInput === name && inputRef.current) {
        inputRef.current.focus();
        // Position cursor at the end of input
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }, [lastFocusedInput, name]);
  
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => setLastFocusedInput(name)}
            className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            {...props}
          />
        </div>
      </div>
    );
  }, [formData, handleChange, lastFocusedInput]);

  const IdCardPreview = ({ data, photo }) => {
    const qrData = JSON.stringify({
      id: data.id,
      name: data.name,
      eventName: data.eventName,
      designation: data.designation,
      department: data.department,
      email: data.email,
      phone: data.phoneNumber,
    });

    return (
      <div id="id-card-preview" className="w-96 bg-white rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-102">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold tracking-tight">EVENT ID CARD</h3>
            <p className="text-blue-100 mt-1">{data.eventName}</p>
          </div>
          <div className="absolute inset-0 bg-white opacity-10 transform rotate-45 translate-x-1/2"></div>
        </div>

        {/* Profile Section */}
        <div className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-blue-600 shadow-lg transform -translate-y-6">
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-4 flex-1 mt-2">
              <h4 className="text-xl font-bold text-gray-800">{data.name || 'Your Name'}</h4>
              <p className="text-blue-600 font-medium">{data.designation || 'Designation'}</p>
              <p className="text-sm text-gray-500">{data.department || 'Department'}</p>
            </div>
          </div>

          {/* Details with Icons */}
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600 truncate">{data.email || 'email@example.com'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">{data.phoneNumber || '+1234567890'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-600">{data.bloodGroup || 'A+'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">{data.validUntil || 'Valid until'}</span>
              </div>
            </div>
          </div>

          {/* QR Code with Style */}
          <div className="mt-6 flex justify-center">
            <div className="p-2 bg-white rounded-lg shadow-md">
              <QRCodeSVG
                value={qrData}
                size={120}
                level="H"
                includeMargin={true}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-4 text-center p-2 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-600">
                Emergency: {data.emergencyContact || 'Emergency contact'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t">
          <p className="text-xs text-gray-500 font-medium">ID: {data.id || 'Generated ID'}</p>
          <p className="text-xs text-gray-400 mt-1">If found, please return to event organizers</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          } text-white flex items-center space-x-2`}>
            {notification.type === 'error' ? (
              <XCircle className="h-5 w-5" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            <p>{notification.message}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
              <h2 className="text-2xl font-bold text-white">Generate ID Card</h2>
              <p className="text-blue-100 mt-1">Fill in the details to create a professional ID card</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Photo Upload Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-colors duration-200 ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-200"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Photo
                      </label>
                      <p className="mt-2 text-sm text-gray-500">
                        Drag and drop an image here, or click to select
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Full Name" name="name" icon={Users} required />
                <InputField label="Event Name" name="eventName" icon={Building2} required />
                <InputField label="Designation" name="designation" icon={Users} required />
                <InputField label="Department" name="department" icon={Building2} required />
                <InputField label="Phone Number" name="phoneNumber" type="tel" icon={Phone} required />
                {/* <InputField label="Email" name="email" type="email" icon={Mail} /> */}
                <InputField label="Blood Group" name="bloodGroup" icon={Heart} required />
                {/* <InputField label="Valid Until" name="validUntil" type="date" icon={Calendar} /> */}
                <InputField
                  label="Emergency Contact"
                  name="emergencyContact"
                  type="tel"
                  icon={AlertCircle}
                  required
                  className="md:col-span-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 text-base font-medium"
              >
                <Download className="h-5 w-5" />
                <span>Generate & Download ID Card</span>
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-4 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Live Preview</h3>
                  <p className="text-sm text-gray-500">See how your ID card will look</p>
                </div>
                {showPreview && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Ready to download
                  </span>
                )}
              </div>

              <div className="flex justify-center items-center min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <IdCardPreview data={formData} photo={profilePhoto} />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">Preview Tips</h4>
                      <ul className="mt-2 text-sm text-blue-700 space-y-1">
                        <li>• ID card will be downloaded as a PNG image</li>
                        <li>• QR code contains all essential information</li>
                        <li>• Make sure all details are correct before generating</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Cards Section */}
            {cards.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Generated Cards</h3>
                <div className="space-y-3">
                  {cards.slice(-3).reverse().map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          {card.profilePhoto ? (
                            <img
                              src={card.profilePhoto}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{card.name}</p>
                          <p className="text-sm text-gray-500">{card.eventName}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCardGenerator;