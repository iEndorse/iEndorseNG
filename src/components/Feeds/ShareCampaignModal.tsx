 import React, { useState } from 'react';
 import danger from './svg/danger.svg';
import x from '../svg/x.svg';
import tiktok from '../svg/tiktok.svg';
import facebook from '../svg/facebook.svg';
import instagram from '../svg/instagram.svg';
import close from '../svg/close.svg';
import link from '../svg/link.svg';
import copy from '../svg/copy.svg';

 
interface ShareCampaignModalProps { 
  isOpen: boolean;
  onClose: () => void;
  details :any
  
}

 const ShareCampaignModal: React.FC<ShareCampaignModalProps> = ({ isOpen, onClose, details }) => {
    return (
        <div>
            <div className={`fixed inset-0 transition-opacity ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
     
        <div className="relative z-10 flex-col items-center justify-center max-h-screen">
        <div className='  flex justify-center p-4'>      
             <span
        className=" bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
        onClick={onClose}
      >
        <img src={close} alt="x" width={40} height={40} />
      </span> 
      </div> 
    
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg mx-1 p-10">
            
            <h1 className="my-3 font-bold text-center">Share Campaign</h1>
            <div className="flex justify-center my-5">
              <div>
                <img src={copy} alt="copy" className="mx-4" width={40} height={40} />
              </div>
              <div>
                <img src={instagram} alt="instagram" className="mx-4" width={40} height={40} />
              </div>
              <div>
                <img src={x} alt="x" className="mx-4" width={40} height={40} />
              </div>
              <div>
                <img src={facebook} alt="fb" className="mx-4" width={40} height={40} />
              </div>
              <div>
                <img src={tiktok} alt="tiktok" className="mx-4" width={40} height={40} />
              </div>
            </div>
          </div>
        </div>
      </div> 
        </div>
    )
 }

 export default ShareCampaignModal