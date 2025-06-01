import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import close from '../svg/close.svg';
import exit from '../svg/exit.svg'
 
interface LogutProps  {
  isOpen: boolean;
  onClose: () => void;

}

const Logout: React.FC<LogutProps> = ({ isOpen, onClose }) => {
const navigate = useNavigate();
    const handleLogout = () => {
        window.localStorage.clear();
        navigate("/SignIn");
      
      };
    
      useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'unset';
        }
      }
      , [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 transition-opacity flex items-start mt-20 sm:mt-1 sm:items-center justify-center z-50">
    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

    <div className="relative p-4 w-full max-w-md max-h-full">
    <div className='  flex justify-center p-4'>      
             <span
        className=" bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
        onClick={onClose}
      >
        <img src={close} alt="x" width={30} height={30} />
      </span> 
      </div> 
    
      <div className="relative bg-white rounded-lg shadow">
        <div className="p-2 md:p-5">
          <h1 className="text-center font-bold mb-5 mt-3">  Logout</h1>
          <div className="flex max-w-sm  justify-center   items-center mb-10">
              <img src={exit} alt="insufficient" />  
          </div>

            <div className='text-center text-xs mb-10'>
            You are leaving this platform, are you sure you want to log out?
            </div>
            <div className="flex mt-2 text-sm justify-between mb-3">
          <div className="flex mr-5 items-center w-full">
            <button  onClick={handleLogout} className="p-3 bg-customBlue text-white rounded-md w-full">
              Log out
            </button>
          </div>
          <div className="flex items-center w-full">
            <button
              className="p-3 bg-white border border-customBlue text-customBlue rounded-md w-full hover:bg-gray-50"
              onClick={onClose}
            >
            Back
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Logout; ;