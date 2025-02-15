

// Navigation.jsx
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ScanLine, 
  ClipboardList, 
  Scan,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const navItems = [
    { 
      id: 'idcard-generator', 
      label: 'Generate ID Card',
      icon: CreditCard,
      description: 'Create and customize ID cards'
    },
    { 
      id: 'idcard-scanner', 
      label: 'Scan ID Card',
      icon: ScanLine,
      description: 'Verify and validate IDs'
    },
    { 
      id: 'entry-logger', 
      label: 'Entry Logger',
      icon: ClipboardList,
      description: 'Track and manage entries'
    },
    // { 
    //   id: 'entry-scanner', 
    //   label: 'Scan Entry',
    //   icon: Scan,
    //   description: 'Quick entry scanning'
    // },
  ];

  // Handle scroll visibility
  useEffect(() => {
    const handleResize = () => {
      const navContainer = document.getElementById('nav-container');
      if (navContainer) {
        setShowScrollButtons(
          navContainer.scrollWidth > navContainer.clientWidth
        );
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll handling
  const handleScroll = (direction) => {
    const navContainer = document.getElementById('nav-container');
    if (navContainer) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      navContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(navContainer.scrollLeft + scrollAmount);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 relative">
        {/* Scroll Buttons */}
        {showScrollButtons && (
          <>
            <button
              onClick={() => handleScroll('left')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-600 hover:text-blue-600 transition-all duration-200 ${
                scrollPosition <= 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={scrollPosition <= 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-600 hover:text-blue-600 transition-all duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Navigation Items */}
        <div
          id="nav-container"
          className="flex space-x-1 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-none px-4 py-3 my-2 rounded-lg transition-all duration-200 group ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 ${
                    activeTab === item.id
                      ? 'text-blue-600'
                      : 'text-gray-400 group-hover:text-blue-600'
                  }`} />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-gray-400 group-hover:text-gray-600">
                      {item.description}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

// Add this CSS to your global styles or component
