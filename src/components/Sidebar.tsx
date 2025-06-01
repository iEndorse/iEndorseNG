import React, { useState } from 'react';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <button
        className="fixed top-4 left-4 p-2 bg-blue-500 text-white rounded"
        onClick={toggleSidebar}
      >
        {isOpen ? 'Close' : 'Open'} Sidebar
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      >
        {/* Close Button */}
        <button
          className={`fixed top-1/2 transform -translate-y-1/2 p-2 bg-red-500 text-white rounded transition-transform duration-300 ease-in-out ${isOpen ? 'right-80 translate-x-0' : 'right-0 translate-x-full'}`}
          onClick={toggleSidebar}
        >
          Close
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-gray-200 text-CustomBlue w-72 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
      transition-transform duration-300 ease-in-out`}>
        <div className="p-4">
          <h2 className="text-xl font-bold">Sidebar Content</h2>
          <p>This is your sidebar content.</p>
        </div>
      </div>



    </div>
  );
}

export default Sidebar;
