import React, { useState, useEffect } from 'react';
import danger from './svg/danger.svg';
import x from '../svg/x.svg';
import tiktok from '../svg/tiktok.svg';
import facebook from '../svg/facebook.svg';
import instagram from '../svg/instagram.svg';
import close from '../svg/close.svg';
import link from '../svg/link.svg';
import copy from '../svg/copy.svg';
import { isAuthenticated } from '../authentication/auth';
import { baseURL } from '../URL';

interface ShareCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: any;
}

const ShareCampaignModal: React.FC<ShareCampaignModalProps> = ({ isOpen, onClose, details }) => {
  const [copied, setCopied] = useState(false);
  const isUserAuthenticated = isAuthenticated();
  const [textToCopy , setTextToCopy] = useState('');

  const [copySuccess, setCopySuccess] = useState('');
  // const textToCopy = `https://iendorse.ng/ViewCampaign/${details?.campaignId}`;

 
  const shareCampaignUrl = `${baseURL}/Campaign/ShareCampaign`;
  const shareCampaign = async () => {
    try {
      const response = await fetch(shareCampaignUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ campaignId: details?.campaignId }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.succeeded) {
          isAuthenticated() ? setTextToCopy(data.data.authLink) : setTextToCopy(data.data.anonymousLink);
        }
      } else {
        console.error('Failed to share campaign');
      }
    } catch (error) {
      console.error('Error sharing campaign:', error);
    }
  };


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
   
  }, [copied]);

  const shareOnTwitter = (campaignId: number, campaignTitle: string, campaignDescription: string) => {
    const tweetText = `${campaignTitle} - ${campaignDescription.slice(0, 30)}...`;
    const campaignUrl = textToCopy
    
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(campaignUrl)}`;
    
    window.open(twitterShareUrl, '_blank');
  };

  const shareOnFacebook = (campaignId: number) => {
    const campaignUrl = textToCopy
    
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`;
    
    window.open(facebookShareUrl, '_blank');
  };

  const shareOnLinkedIn = (campaignId: number, campaignTitle: string, campaignDescription: string) => {
    const campaignUrl = `https://iendorse.ng/ViewCampaign/${campaignId}`;
    
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}&title=${encodeURIComponent(campaignTitle)}&summary=${encodeURIComponent(campaignDescription.slice(0, 30))}`; 
    
    window.open(linkedInShareUrl, '_blank');
  };
  
  useEffect(() => {
    if (isOpen) {
      shareCampaign();
    }
  }, [isOpen]);
  

  return (
    <div className={`fixed z-50 inset-0 transition-opacity ${isOpen ? 'flex' : 'hidden'} items-start mt-20 sm:mt-1 sm:items-center justify-center`}>
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
      
      <div className="relative z-10 flex-col items-center justify-center max-h-full">
        <div className="flex justify-center p-4">
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="x" width={40} height={40} />
          </span>
        </div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-lg mx-1 p-10">
          <h1 className="my-3 font-bold text-center">Share Campaign</h1>
          <div className="h-3 flex justify-center ml-2">
            {copied && (
              <span className="text-green-500    mb-4 font-medium">
                Copied!
              </span>
            )}
          </div>

          <div className="flex justify-center my-5">
            <div onClick={handleCopy}>
              <img src={copy} alt="copy" className="mx-4" width={40} height={40} />
            </div>
            {/* <div onClick={() => shareOnLinkedIn(details.campaignId, details.campaignTitle, details.description)}>
              <img src="https://res.cloudinary.com/dgso4wgqt/image/upload/v1745071247/329_linkedin_1_ynib9q.jpg" alt="linkedin" className="mx-4" width={72} height={40} />
            </div> */}
            <div onClick={() => shareOnTwitter(details.campaignId, details.campaignTitle, details.description)}>
              <img src={x} alt="x" className="mx-4" width={40} height={40} />
            </div>
            <div>
              <img onClick={() => shareOnFacebook(details.campaignId)} src={facebook} alt="fb" className="mx-4" width={40} height={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCampaignModal;