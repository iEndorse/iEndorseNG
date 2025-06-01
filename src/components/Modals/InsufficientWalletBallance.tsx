import React, {useEffect, useState} from 'react';
import close from '../svg/close.svg';
import insufficient from '../svg/insufficient.svg'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface InsufficientWalletBalanceModalProps  {
  isOpen: boolean;
  onClose: () => void;
  details: any
  
}

const InsufficientWalletBalanceModal: React.FC<InsufficientWalletBalanceModalProps> = ({ isOpen, onClose, details }) => {
  const unitsNeeded = details.unitsToPurchase - details.walletBalance;


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 transition-opacity flex  z-50 sm:mt-1 sm:items-center items-start mt-20  justify-center">
    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

    <div className="relative p-4 w-full max-w-md max-h-full">
    <div className='  flex justify-center p-4'>      
             <span
        className=" bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
        onClick={onClose}
      >
        <img src={close} alt="x" width={40} height={40} />
      </span> 
      </div> 
    
      <div className="relative bg-white rounded-lg shadow">
        <div className="p-2 md:p-5">
          <h1 className="text-center font-bold">  Insufficient Wallet Balance</h1>
          <div className="flex max-w-sm  justify-center  ">
              <img src={insufficient} alt="insufficient" />  
          </div>

            <div className='text-xs mb-20'>
            <p> Oops! you need to fund your wallet with   <span className='font-medium' >{unitsNeeded} </span>units to successfully endorse this campaign. 
            Fund your wallet with your card and your endorsement will be processed in no time.</p>
            </div>
            <div className="flex mt-10 text-sm justify-between mb-3">
          <div className="flex mr-5 items-center w-full">
            <Link to="/Wallet" className='w-full cursor-pointer'>  
            <button className="p-3 bg-customBlue text-white rounded-md w-full">
              Fund Walllet
            </button>
            </Link>
          </div>
          <div className="flex items-center w-full">
            <button
              className="p-3 bg-white border border-customBlue text-customBlue rounded-md w-full hover:bg-gray-50"
              onClick={onClose}
            >
              Maybe Later
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default InsufficientWalletBalanceModal; ;