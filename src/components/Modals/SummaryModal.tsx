import React, {useEffect, useState} from 'react';
import close from '../svg/close.svg';
import paystack from '../svg/paystack.svg'
import paypal from '../svg/paypal.svg'
import flutterwave from '../svg/flutterwave.svg'
import stripe from '../svg/stripe.svg'
import { toast } from 'react-toastify';
import { LineWave } from 'react-loader-spinner';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  details: any
  ApiLoading: any
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose,onSubmit, details, ApiLoading }) => {
  
  

  if (!isOpen) return null;
  return (
    <div className="z-50 fixed inset-0 transition-opacity flex items-center justify-center">
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
          <div className="p-4 md:p-5">
            <h1 className="text-center font-bold"> Summary</h1>

            <div className="flex-col max-w-sm space-y-2 justify-center mt-8 mb-28">
               <div className='border-b    pb-2 flex justify-between'>
                   <span className=''> Wallet Balance </span>
                   <span className='font-medium' > {details?.walletBalance} units</span>
               </div>

               <div className='border-b    pb-2 flex justify-between'>
                   <span className=''> Amount Payable</span>
                   <span className='font-medium' > {details?.unitsToPurchase} units</span>
               </div>

               <div className='    pb-2 flex justify-between'>
                   <span className=''>  Total Fee </span>
                   <span className='font-medium' > {details?.unitsToPurchase} units</span>
               </div>
                 
            
                 
            </div>
            
            <button
              disabled={ApiLoading}
              onClick={() => onSubmit()}
              className="w-full   flex text-white items-center  justify-center bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center"
            >
            <span>{ApiLoading ? "" : "Proceed to Pay " }  </span>
            {ApiLoading && (
                  <LineWave
                    visible={true}
                    height="40"
                    width="40"
                    color="#fff"
                    ariaLabel="line-wave-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    firstLineColor=""
                    middleLineColor=""
                    lastLineColor=""
                  />
            )
          }

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;