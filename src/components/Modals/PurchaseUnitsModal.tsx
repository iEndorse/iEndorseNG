import React, { useState, useEffect } from 'react';
import close from '../svg/close.svg';
import { toast } from "react-toastify";
 

interface PurchaseUnitProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (units: number) => void;
}

const PurchaseUnitsModal: React.FC<PurchaseUnitProps> = ({ isOpen, onClose, onSubmit }) => {
  const [numberOfUnits, setNumberOfUnits] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      setNumberOfUnits(0);
    } else {
      setNumberOfUnits(value);
    }
  };

  
  const handleSubmit = () => {
    if ((numberOfUnits <= 0) ) {
      setError('Please enter a valid number of units.'); 
      toast("Please enter a valid number of units.");
    } else {
      setError('');
      onSubmit(numberOfUnits);
    }
  };

  // useEffect(() => {
  //     if (isOpen) {
  //       // Save the current scroll position
  //       const scrollY = window.scrollY;
        
  //       // Add styles to prevent scrolling and maintain position
  //       document.body.style.position = 'fixed';
  //       document.body.style.top = `-${scrollY}px`;
  //       document.body.style.width = '100%';
  //     } else {
  //       // Get the scroll position from the body's top property
  //       const scrollY = document.body.style.top;
        
  //       // Remove the styles
  //       document.body.style.position = '';
  //       document.body.style.top = '';
  //       document.body.style.width = '';
        
  //       // Restore scroll position
  //       window.scrollTo(0, parseInt(scrollY || '0') * -1);
  //     }
  
  //     // Cleanup function
  //     return () => {
  //       document.body.style.position = '';
  //       document.body.style.top = '';
  //       document.body.style.width = '';
  //     };
  //   }, [isOpen]);
  

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
            <h1 className="text-center font-bold">Promote Your Campaign</h1>
            <p className="p-1 text-sm text-center font-sans mb-4">
              Purchase units from your wallet or subscribe to a plan to be able to share and get a wider reach for your campaign.
            </p>

            <div className="flex-col max-w-sm space-y-2 justify-center mb-40 ">
            {error && <p className="text-red-500 text-xs my-2">{error}</p>}
                <input
                  onChange={handleChange}
                  id="units"
                  className="w-full py-2 px-3 text-sm  rounded-md  border text-gray-900"
                  placeholder="Number of units"
                />
                <div>  
                    <span className='bg-blue-50 text-blue-500 px-2 text-xs rounded-full py-2 mt-6' > 1000 naira equals 1 unit </span>
                 
                    </div>

              
            </div>
        
            <button
              onClick={handleSubmit}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseUnitsModal;
