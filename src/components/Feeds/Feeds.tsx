import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { baseURL } from '../URL';
import { ThreeCircles } from 'react-loader-spinner';
import Navbar from '../NavBar/Navbar';
import FeedCampaign from './FeedCampaign';
import { Link } from 'react-router-dom';
import { refresh } from '@cloudinary/url-gen/qualifiers/artisticFilter';


const Feed: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const PAGE_SIZE = 10;

   // Replace with your actual URL

  const fetchCampaigns = async (resetData = false) => {
    setLoading(true);
    setError(null);

    try {
      const token = window.localStorage.getItem('token'); // Replace as needed
      const response = await axios.post(
        `${baseURL}/Campaign/MyFeed`,
        {}, // Body content if required, currently empty
        {
          params: {
            PageNumber: pageNumber,
            PageSize: PAGE_SIZE,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newData = Array.isArray(response.data?.data) ? response.data.data : [];
      setData(prevData => (resetData ? newData : [...prevData, ...newData]));
      setHasMore(newData.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing feed...');
    setPageNumber(1);
    setRefreshTrigger(prev => !prev); // Flip trigger
  };
  
  useEffect(() => {
    fetchCampaigns(true); // Reset data on first page load
  }, [pageNumber, refreshTrigger]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setPageNumber(prev => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

 

  const renderNoCampaigns = () => (
    <div className="flex mt-10 flex-col items-center justify-center h-[calc(100vh-100px)] text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        No Campaigns Found
      </h2>
      {/* <p className="text-gray-500 mb-4">You currently have no active campaigns.</p> */}
      <Link to="/CreateCampaign">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Create New Campaign
        </button>
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen ">
      <Navbar />
      <div className=" mt-20 flex flex-col bg-white sm:bg-gray-100 justify-center items-center">
        {/* Initial Loading */}
        {pageNumber === 1 && loading && (
          <div className="flex items-center justify-center h-screen">
                     <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-500"></div>

          </div>
        )}

        {/* No Campaigns */}
        {!loading && data.length === 0 && renderNoCampaigns()}

        {/* Campaigns List */}
        {data.map((item, index) => (
          <FeedCampaign key={index} item={item} refreshFeed={handleRefresh} />
        ))}

        {/* Loading More Campaigns */}
        {loading && data.length > 0 && (
          <div className="flex items-center justify-center mt-4">
             <div className="flex justify-center items-center ">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
          </div>
        )}

        {/* Error Handling */}
        {error && <p className="text-red-500 mt-4">Error: {error.message}</p>}

        {/* No More Items */}
        {!hasMore && data.length > 0 && (
          <div className="text-center text-gray-500 mt-4 mb-5 pb-2">No more items to load</div>
        )}
      </div>
    </div>
  );
};

export default Feed;
