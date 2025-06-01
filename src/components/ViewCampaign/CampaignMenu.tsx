import React from 'react';
import { Link } from 'react-router-dom';
import close from '../svg/close.svg';
import chart from '../svg/chart.svg';
import edit from '../svg/edit.svg';
import trash from '../svg/trash.svg';

interface CampaignMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CampaignMenu: React.FC<CampaignMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 transition-opacity flex items-center justify-center">
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
    
        <div className="bg-white rounded-lg shadow flex items-center justify-center pt-20 pb-44">
          <div className="flex-col justify-center items-center p-6 border w-28 flex-initial bg-gray-100 rounded-md m-2">
            <div className="flex justify-center">
              <img src={chart} alt="chart" />
            </div>
            <div className="flex justify-center">
              <Link to="/Analytics">
                <p className="text-customBlue font-medium">Analytics</p>
              </Link>
            </div>
          </div>
          <div className="flex-col justify-center items-center w-28 flex-initial p-6 border bg-gray-100 rounded-md m-2">
            <div className="flex justify-center">
              <img src={edit} alt="edit" />
            </div>
            <div className="flex justify-center">
              <p className="text-green-500 font-medium">Edit</p>
            </div>
          </div>
          <div className="flex-col justify-center items-center w-28 flex-initial p-6 border bg-gray-100 rounded-md m-2">
            <div className="flex justify-center">
              <img src={trash} alt="trash" />
            </div>
            <div className="flex justify-center">
              <p className="text-red-500 font-medium">Delete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignMenu;