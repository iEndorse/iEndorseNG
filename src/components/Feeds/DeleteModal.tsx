import React, {useEffect, useState} from 'react';
import close from '../svg/close.svg';
import redTrash from '../svg/redTrash.svg'
import { toast } from 'react-toastify';
import { baseURL } from '../URL';
import { LineWave } from 'react-loader-spinner';
import { Backdrop, CircularProgress } from '@mui/material';

interface DeleteModalProps { 
  isOpen: boolean;
  onClose: () => void;
  details :any
  onCloseMenu : () => void
  
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, details, onCloseMenu }) => {
    const [isLoading, setIsLoading] = useState(false);
    const deleteURL = `${baseURL}/Campaign/DeleteCampaign?campaignId=${details.campaignId}`;

    const deleteCampaign = async () => {
        setIsLoading(true); // Show loading state
    
       
        try {
          const response = await fetch(deleteURL, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${window.localStorage.getItem("token")}`, // Add token if needed
            },
           
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log("API response:", data);
            // Optionally show success message
            window.location.reload();
            toast.success('Campaign deleted successfully', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
           
            
          } else {
            console.error("Failed to submit complaint:", response.statusText);
            toast.error("Failed to delete campaign. Please try again.",{position:'top-center'});
          }
        } catch (error) {
          console.error("An error occured:", error);
          toast.error("An error occurred. Please try again later.");
        } finally {
          setIsLoading(false); 
          onClose()
          onCloseMenu()
        }
      };
    
  

 
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 transition-opacity  flex items-center mt-20 sm:mt-1 sm:items-center  justify-center">
    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
    <Backdrop
              sx={{ color: '#dc0000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
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
        <div className=" md:p-5 mx-2">
          <h1 className="text-center font-bold my-1 border-b pb-3 pt-1">   Delete Campaign</h1>
          <div className="flex  justify-center my-3 p-3 ">
              <img src={redTrash} alt="greenCheck"  width={80} height={80} />  
          </div>

            <div className='text-center  mb-10 p-3'>
            <p>
            You campaign will no longer be viewed, do you wish to delete this campaign  
            </p>
            </div>
         
          <div className="flex pb-2  items-center ">
          <button
              disabled={isLoading}
              onClick={() => deleteCampaign()}
              className={`${isLoading ? 'bg-gray-500' : 'bg-customBlue'} mr-2 w-full text-white    hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                font-medium rounded-lg text-sm px-2.5 py-2.5 text-center `} 
              
            >
             Delete 
            </button>
            <button
              onClick={() => onClose()}
              className={`ml-2 w-full border border-customBlue text-customBlue hover:bg-gray-50 focus:ring-4 focus:outline-none
               focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center` }
            >
             Cancel
            </button>
        </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default DeleteModal; ;