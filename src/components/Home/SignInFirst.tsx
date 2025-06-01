import React, { useEffect, useState } from 'react';
import close from '../svg/close.svg';
import { useNavigate } from 'react-router-dom';

interface SignInFirstProps {
  isOpen: boolean;
  onClose: () => void;
 
}

const SignInFirst: React.FC<SignInFirstProps> = ({ isOpen, onClose }) => {
 const navigate = useNavigate();
const SignIn = () =>{
  window.location.href = '/SignIn';
  onClose()
}
   useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 transition-opacity flex items-start mt-20 sm:mt-1 sm:items-center justify-center z-50">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="flex justify-center p-4">
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="x" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5">
             

            <div className="flex-col max-w-sm space-y-2 justify-center ">
             <div className='text-center p-2'>
                You need to sign in to enable you to endorse this campaign
             </div>

              

            <button
              onClick={SignIn}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignInFirst
