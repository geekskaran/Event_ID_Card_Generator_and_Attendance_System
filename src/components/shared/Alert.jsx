// components/shared/Alert.jsx
import React from 'react';

export const Alert = ({ variant = 'default', children, className = '' }) => {
  const baseStyles = 'p-4 rounded-md mb-4';
  const variants = {
    default: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    destructive: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => {
  return <div className="text-sm font-medium">{children}</div>;
};