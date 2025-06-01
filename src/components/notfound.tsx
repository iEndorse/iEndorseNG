import React from 'react';
import { HomeIcon, ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-8">Page Not Found</h2>
        <p className="text-blue-200 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex justify-center space-x-4">
            
          <button onClick={() => window.history.back()}  className="flex items-center px-6 py-3 bg-white text-blue-900 rounded-lg font-medium hover:bg-blue-100 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>
      
            <Link to={'/'}>
          <button className="flex items-center px-6 py-3 bg-white text-blue-900 rounded-lg font-medium hover:bg-blue-100 transition-colors">
            <HomeIcon className="w-5 h-5 mr-2" />
            Home
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;