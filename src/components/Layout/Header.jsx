// Header.jsx
import React from 'react';
import { BarChart2, Shield, Clock } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.05] to-transparent" />
      
      <div className="relative">
        {/* Top bar with quick stats */}
        <div className="border-b border-white/10">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-blue-100">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">System Status:</span>
                  <span className="font-medium text-green-400">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security Level:</span>
                  <span className="font-medium">Enhanced</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-4 w-4" />
                <span>Total Entries: </span>
                <span className="font-medium">247</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main header content */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Smart ID & Barcode Entry System
              </h1>
              <p className="mt-2 text-blue-100 text-sm md:text-base max-w-2xl">
                Streamline your entry management with our advanced identification and tracking solution
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-xs text-blue-100">Last Sync</div>
                <div className="text-sm font-medium text-white">Few mins ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;