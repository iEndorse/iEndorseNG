import React, {useEffect, useState} from 'react';
import close from '../svg/close.svg';

interface PromoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: string) => void;
}

const PromoteModal: React.FC<PromoteModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [promotionType, setPromotionType] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  const handleSelectPromotionType = (type: string) => {
    setPromotionType(type);
    setError(""); // Clear error when user makes a selection
  };
  
  const handleSubmit = () => {
    if (promotionType === "") {
      setError("Please select a promotion type");
      return;
    }
    onSubmit(promotionType);
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 transition-opacity flex sm:items-center justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className='flex justify-center p-4'>      
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
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
            
            <div className="flex-col max-w-sm space-y-2 justify-center mb-4">
              <div className="flex items-center ps-4 border border-gray-200 rounded-lg">
                <input
                  onChange={() => handleSelectPromotionType("PurchaseUnits")}
                  id="bordered-radio-1"
                  type="radio"
                  value="PurchaseUnit"
                  name="bordered-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-10 cursor-pointer border-gray-300 focus:ring-0 focus:outline-none"
                  checked={promotionType === "PurchaseUnits"}
                />
                <label
                  htmlFor="bordered-radio-1"
                  className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                >
                  Purchase Unit
                </label>
              </div>

              <div className="flex items-center ps-4 border border-gray-200 rounded">
                <input
                  onChange={() => handleSelectPromotionType("Subscription")}
                  id="bordered-radio-2"
                  value="Subscribe"
                  type="radio"
                  name="bordered-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer focus:ring-blue-500 focus:ring-2"
                  checked={promotionType === "Subscription"}
                />
                <label
                  htmlFor="bordered-radio-2"
                  className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                >
                  Subscribe
                </label>
              </div>
            </div>
            
            {/* Error message display */}
            {error && (
              <div className="mb-4 text-center text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={handleSubmit}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoteModal;