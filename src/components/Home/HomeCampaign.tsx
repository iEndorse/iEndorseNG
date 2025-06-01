import React, {useEffect, useState} from "react";
import { Link, useNavigate} from "react-router-dom";
import share from '../svg/share.svg';
import endorse from '../svg/endorse.svg';
import Initials from "../Initials";
import EndorseCampaignModal from "../Modals/EndorseCampaignModal";
import PaymentMethodModal from "../Modals/PaymentMethodModal";
import InsufficientWalletBalanceModal from "../Modals/InsufficientWalletBallance";
import SummaryModal from "../Modals/SummaryModal";
import EndorsementSuccessfulModal from "../Modals/EndorsementSuccessfulModal";
import ShareCampaignModal from "../Modals/ShareCampaignModal";
import { baseURL } from "../URL";
import useFetch from "../Hooks/useFetch";
import usePost from "../Hooks/usePost";
import {toast} from "react-toastify";
import { isAuthenticated } from '../authentication/auth';
import SignInFirst from "./SignInFirst";
import { deflate } from "zlib";
import Carousel from 'react-material-ui-carousel'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeCampaign = ({item}:any, index:any) => {
  const navigate = useNavigate();
  const userData:any = window.localStorage.getItem("userData");
  const parsedUserData = JSON.parse(userData);
  const [endorseMenu, setEndorseMenu] = useState(false);
  const[signInFirstModal, setSignInFirstModal] = useState(false);
  const[loading, setLoading] = useState(false);
  const [unitsToPurchase, setUnitsToPurchase] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
 const [endorsementNote, setEndorsementNote] = useState('');  
 const [paymentMethod, setPaymentMethod] = useState("");
 const [allData, setAllData] = useState<any>({});
 const [insufficientWalletModal, setInsufficientWalletModal] = useState(false);
 const [summaryModal, setSummaryModal] = useState(false);
 const [endorsementSuccessfulModal, setEndorsementSuccessfulModal] = useState(false);
 const [shareCampaignModal, setShareCampaignModal] = useState(false);
 const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const maxLength = 100; 
 const isUserAuthenticated = isAuthenticated();

  const openEndorseMenu = () => {
    if(isUserAuthenticated){
  setEndorseMenu(true);
  }else{
    setSignInFirstModal(true);
  }
    document.body.style.overflow = 'hidden'; 
  }


  const closeEndorseMenu = () => {
    setEndorseMenu(false);
    document.body.style.overflow = 'auto'; 
  }
  const onSuccess = () => {}
  const onError = () => {}
  const openSignInPrompt = () => setSignInFirstModal(true)
  const closeSignInPrompt = () => {setSignInFirstModal(false); document.body.style.overflow = 'auto'}
  const openPaymentMethodModal = () => {setPaymentMethodModal(true);    document.body.style.overflow = 'hidden';  }
  const closePaymentMethodModal = () => {setPaymentMethodModal(false);   document.body.style.overflow = 'auto';  }
  const openInsufficientWalletModal = () => {setInsufficientWalletModal(true);  document.body.style.overflow = 'hidden';  }
  const closeInsufficientWalletModal = () => {setInsufficientWalletModal(false); document.body.style.overflow = 'auto';  }
  const opensummarymodal = () => {setSummaryModal(true); document.body.style.overflow = 'hidden';  }
  const closeSummaryModal = () => { setSummaryModal(false); document.body.style.overflow = 'auto'; }
  const openShareCampaignModal = () =>  { setShareCampaignModal(true); document.body.style.overflow = 'hidden'; }
  const closeShareCampaignModal = () =>   {setShareCampaignModal(false); document.body.style.overflow = 'auto'; }
  const openEndorsementSuccessfulModal = () => { setEndorsementSuccessfulModal(true); document.body.style.overflow = 'hidden'; }
  const closeEndorsementSuccessfulModal = () => {setEndorsementSuccessfulModal(false); setAllData({}); document.body.style.overflow = 'auto'; };
 
  const endorseWithWalletURL = `${baseURL}/Campaign/EndorseCampaignWithWallet`
  // const walletBalance = parsedUserData?.walletUnits;
  const walletURL = `${baseURL}/Wallet/WalletProfile`;

  

  const { data:ApiFeedback, loading: ApiFeedbackLoading, error, postData} = usePost(endorseWithWalletURL);
  
 const fetchWalletBalance = async () => {
    setLoading(true);

    try {
      const response = await fetch(walletURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
        },

      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData) {
        //toast("Wallet fetched")
        setWalletBalance(responseData.data.walletBalance);
      }
    } catch (err) {
      console.log("Error posting data:", err);
      //toast.error((err as Error).message);
    } finally {
      setLoading(false);

    }
  };




  const endorseWithWalletData = {
    campaignId: item.campaignId,
    numberOfUnits: unitsToPurchase,
    endorsementNote: endorsementNote
  }


  const sendToFacebook = async () => {
    const categories = ["Education", "Church",  "Politics",
      "Gaming", "Sports", "Music", "Health & Fitness",
      "Travel",     "Cooking",   "Art & Craft"
    ];
    // setCreateLoading(true); // Show loading indicator
      console.log("Sending to facebook", item)
     const apiUrl = `https://50.16.151.222:4000/endorse-campaign`;
     const formDataPayload = new FormData();
     formDataPayload.append("campaignId", item.campaignId); 
     formDataPayload.append("numberOfUnits", unitsToPurchase.toString());
     formDataPayload.append("endorsementNote", endorsementNote); 
 
     try {
       const response = await fetch(apiUrl, {
         method: "POST",
         body: formDataPayload
       });
   
       const data = await response.json(); // Parse response
   
       console.log("Response received:", data); // Log API response for debugging
   
       if (response.ok && data.succeeded) {
         console.log("Successfully Posted campaign  to Facebook");
      //   toast.success("Successfully uploaded campaign media to Facebook");
       } else {
        console.error(data.message || "An error occurred while uploading campaign media to Facebook");
       }
     } catch (error) {
       console.error("Facebook upload error:", error); // Log the error for debugging
      // toast.error("An error occurred while uploading campaign media to Facebook");
     } finally {
      // setCreateLoading(false); // Hide loading indicator
     }
   };
  


  const PayWithWallet = async () => {
    console.log("..........Paying with wallet");
    try {
      await postData(endorseWithWalletData);
        
    } catch (err) {
      console.error("Error posting data:", err);
    //  toast.error("Failed to Endorse. Please try again.");
      return;
    } finally{
      sendToFacebook();
    }
  };


  const submitEndorsement= (units:number, note: any) => {
    setUnitsToPurchase(units)
    setEndorsementNote(note)
    setAllData({...allData, unitsToPurchase: units, endorsementNote: note});
   // console.log("All ENDORSEMENT DATA>>>>>>>>", allData)
   fetchWalletBalance();
     closeEndorseMenu();
     openPaymentMethodModal();
  }


  const submitPaymentMethod = (method: any) => {
    setAllData({ ...allData, paymentMethod: method, walletBalance: walletBalance, campaignId: item.campaignId });
    setPaymentMethod(method)
    let preferredPaymentMethod = method;
    closePaymentMethodModal();
    console.log(" Prefered PAyment method:", preferredPaymentMethod)
    if (preferredPaymentMethod == "Wallet") {
      if (unitsToPurchase > walletBalance) {
        setInsufficientWalletModal(true);
      } else {
       // console.log("opening summary modal")
        opensummarymodal()
       
      }
    }
  }





  const getInitials = (fullName: string) => {
    if (fullName) {
      const names = fullName.trim().split(' ');
      // Get the first character of the first name and the first character of the last name, if available
      const initials =
        (names[0] ? names[0][0] : '') + (names.length > 1 ? names[names.length - 1][0] : '');
      return initials.toUpperCase();
    }
    return ''; // Return empty string if fullName is falsy
  };


  useEffect(() => {
    if (ApiFeedback) {
      console.log(ApiFeedback);
         closeSummaryModal()
    openEndorsementSuccessfulModal();
    sendToFacebook();
 
    }
  }, [ApiFeedback]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to endorse. Please try again.");
    }
  }, [error]);
  
console.log("cammpaign File", item?.campaignFiles)
console.log("home campagin", item)

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
 

const handleItemClick = (x:any) => {
  localStorage.setItem('listScrollPosition', window.pageYOffset.toString());
  navigate(`/viewcampaign/${x}`);
};

  return (
    <>
      
    
    <div
      key={item.campaignId}
      className="p-4 w-full  max-w-lg sm:border-gray-200 sm:border  bg-white rounded-2xl my-5 px-6 "
    >
            {/* <Link to={`/ViewCampaign/${item?.campaignId}`}> */}
           
      {/* Header Section */}
      <div className="flex items-start justify-end sm:flex-wrap">
         
        <div className="mt-1 sm:mt-0">
          <button className="bg-green-100 text-green-600 rounded-lg px-2 py-1 font-medium" style={{fontSize: '0.7rem'}}>
            {item?.campaignUnit} Points Left
          </button>
        </div>
      </div>
       <Link to ={`/userprofile/${item?.campaignOwner}`} > 
          <div className="flex items-start justify-between sm:flex-wrap">
        <div className="flex items-center gap-3">
          <div className="inline-block z-1">
            {item?.campaignOwnerImage ? (
              <img
                className="rounded-full border-2 border-white w-10 h-10 object-cover flex-shrink-0"
                style={{ boxShadow: '0 0 0 1px #0D236E' }}
                src={item?.campaignOwnerImage}
                alt="Avatar"
              />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full text-customBlue p-2">
                <Initials fullName={item?.campaignOwner} className="text-lg font-medium" />
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-xs leading-tight max-w-[130px] break-words">
              {item?.campaignOwner}
            </div>
            <div className="text-xs text-gray-600">
              <i>{item?.campaignOwnerTitle}</i>
            </div>
          </div>
        </div>
       
      </div>
      </Link>


      {/* Campaign Title & Description */}
       <div onClick={() => handleItemClick(item?.campaignId)} className="cursor-pointer">
      <div className="my-4">
        <h1 className="font-medium text-lg truncate">{item?.campaignTitle}</h1>
        <div className="mt-2">
          <p className="text-justify text-sm" style={{ whiteSpace: 'pre-line' }}>
            {isExpanded ? item?.description : `${item?.description.slice(0, maxLength)}...`}
          </p>
          {item?.description?.length > maxLength && (
            <button
              onClick={toggleReadMore}
              className="text-customBlue font-medium mt-2"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>
      </div>
     
      {/* Media Section */}
       <Carousel 
        indicators={item?.campaignFiles.length > 1} // Display indicators only if more than one file
      >
        {item?.campaignFiles.map((file: any, index: any) => (
          <div 
            key={index} 
            className="flex items-center justify-center bg-black w-full h-[300px] rounded-lg"
          >
            {file.filePath.endsWith('.mp4') ? (
              <video 
               
                className="w-full max-h-full object-cover" 
                muted 
                playsInline
                autoPlay
                loop
                controls
                style={{ borderRadius: '0.5rem' }} // Add border radius to video
              
              >
                <source src={file.filePath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img 
                src={file.filePath} 
                alt={`Campaign ${index}`} 
                className="w-full max-h-full object-contain rounded-lg" 
              />
            )}
          </div>
        ))}
              </Carousel>
      
             
    

      {/* Actions Section */}
      <div className="flex mt-4 mb-3 text-sm gap-5">
        <div
          className="flex items-center cursor-pointer"
          onClick={openShareCampaignModal}
        >
          <img src={share} width={20} height={20} className="mr-2" alt="share" />
          <span>Share</span>
        </div>
        <div
          className="flex items-center cursor-pointer"
          onClick={openEndorseMenu}
        >
          <img src={endorse} width={20} height={20} className="mr-2" alt="endorse" />
          <span>Endorse</span>
        </div>
      </div>
   
</div>





      <EndorseCampaignModal
        isOpen={endorseMenu}
        onClose={closeEndorseMenu}
        onSubmit={submitEndorsement}
      />
     
     <PaymentMethodModal
        isOpen={paymentMethodModal}
        onClose={closePaymentMethodModal}
        onSubmit={submitPaymentMethod}
      />

    <InsufficientWalletBalanceModal
        isOpen={insufficientWalletModal}
        onClose={closeInsufficientWalletModal}
        details={allData}
      />

       <SummaryModal
        isOpen={summaryModal}
        onClose={closeSummaryModal}
        onSubmit={PayWithWallet}
        details ={allData}
        ApiLoading={ApiFeedbackLoading}
      />

        <EndorsementSuccessfulModal
          isOpen={endorsementSuccessfulModal}
        onClose={closeEndorsementSuccessfulModal}
        details ={allData}
      />


      <ShareCampaignModal
        isOpen={shareCampaignModal}
        onClose={closeShareCampaignModal}
        details ={item}
      />


      <SignInFirst
        isOpen={signInFirstModal}
        onClose={closeSignInPrompt}
          />
    </>
  );
}

export default HomeCampaign  ;
