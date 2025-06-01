import React from 'react';
import {useState} from 'react';
import { Link } from 'react-router-dom';
import close from '../svg/close.svg';
import chart from '../svg/chart.svg';
import edit from '../svg/edit.svg';
import trash from '../svg/trash.svg';
import DeleteModal from './DeleteModal';

interface CampaignMenuProps {
  isOpen: boolean;
  onClose: () => void;
  details: any;
}

const CampaignMenu: React.FC<CampaignMenuProps> = ({ isOpen, onClose, details }) => {
  const [deleteModal, setDeleteModal] = useState(false);

  if (!isOpen) return null;

  const openDeleteModal = () => setDeleteModal(true);
  const closeDeleteModal = () => setDeleteModal(false);

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center mt-20 sm:mt-1 sm:items-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
      <div className="relative p-4 w-full max-w-xs sm:max-w-md">
        <div className="flex justify-center p-2">
          <span
            className="bg-transparent border-0 text-black text-xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="Close" width={30} height={30} />
          </span>
        </div>

        <div className="bg-white py-10 rounded-lg shadow-lg p-4 flex flex-wrap justify-center gap-2">
          <Link to={`Analytics/${details?.campaignId}`}>
            <div className="flex-col flex justify-center items-center p-4 border bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 w-20 h-20">
              <img src={chart} alt="Analytics" className="w-8 h-8 mb-1" />
              <p className="text-customBlue font-medium text-sm">Analytics</p>
            </div>
          </Link>

          {/* <div className="flex-col flex justify-center items-center p-4 border bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 w-20 h-20">
            <img src={edit} alt="Edit" className="w-8 h-8 mb-1" />
            <p className="text-green-500 font-medium text-sm">Edit</p>
          </div> */}

          <div
            onClick={openDeleteModal}
            className="flex-col flex justify-center items-center p-4 border bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 w-20 h-20"
          >
            <img src={trash} alt="Delete" className="w-8 h-8 mb-1" />
            <p className="text-red-500 font-medium text-sm">Delete</p>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModal}
        onClose={closeDeleteModal}
        details={details}
        onCloseMenu={onClose}
      />
    </div>
  );
};

export default CampaignMenu;


