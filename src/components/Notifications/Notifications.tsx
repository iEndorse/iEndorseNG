// Notifications.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import { baseURL } from '../URL';
import { toast } from 'react-toastify';
import NotificationsList from './NotificationsLists';
import EndorsementsList from './EndorsementsLists';

const Notifications = () => {
  const [isNotifications, setIsNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [otherNotifications, setOtherNotifications] = useState<any[]>([]);
  const [endorsements, setEndorsements] = useState<any[]>([]);

  const showNotifications = () => setIsNotifications(true);
  const showEndorsements = () => setIsNotifications(false);

  const othersUrl = `${baseURL}/EndorseNotification/GetOtherNotifications`;
  const endorsementsUrl = `${baseURL}/EndorseNotification/GetEndorseNotifications`;

  const loadOthertNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(othersUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const responseData = await response.json();
      setTotalRecords(responseData.totalRecords);
      setOtherNotifications(responseData?.data || []);
    } catch (err) {
      //toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadEndorsements = async () => {
    setLoading(true);
    try {
      const response = await fetch(endorsementsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const responseData = await response.json();
      setTotalRecords(responseData.totalRecords);
      setEndorsements(responseData?.data || []);
    } catch (err) {
     // toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOthertNotifications();
  }, []);

  useEffect(() => {
    loadEndorsements();
  }, []);



  return (
    <div className='bg-gray-100 min-h-screen'>
      <Navbar />

      <div className="flex bg-gray-100 justify-center mt-20">
        <div className="flex flex-col mt-10 mx-3">
          <div className="flex text-sm justify-between mb-3  bg-white rounded-lg py-3 px-10">
            <div className="flex mr-5 items-center w-full">
              <button
                className={`px-6 py-2 ${isNotifications ? 'bg-customBlue text-white' : 'bg-white text-gray-800'} rounded-md w-full`}
                onClick={showNotifications}
              >
                Notifications
              </button>
            </div>
            <div className="flex items-center w-full">
              <button
                className={`px-6 py-2 ${!isNotifications ? 'bg-customBlue text-white' : 'bg-white text-gray-800'} rounded-md w-full`}
                onClick={showEndorsements}
              >
                Endorsements
              </button>
            </div>
          </div>

          {/* Notifications */}
          {isNotifications ? (
           <NotificationsList otherNotifications={otherNotifications} />
          ) : (
            <EndorsementsList  endorsements={endorsements} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
