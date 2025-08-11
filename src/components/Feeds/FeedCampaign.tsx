import React, { useEffect, useState } from "react";

import { toast } from "sonner";
import CampaignMenu from "./CampaignMenu";
import PromoteModal from "./PromoteModal";
import link from '../svg/link.svg';
import threeDots from '../svg/threeDots.svg';
import SubscriptionModal from "./SubscriptionModal";
import PurchaseUnitsModal from "./PurchaseUnitsModal";
import PaymentMethodModal from "./PaymentMethodModal";
import useFetch from "../Hooks/useFetch";
import { baseURL } from "../URL";
import InsufficientWalletBalanceModal from "./InsufficientWalletBallance";
import SummaryModal from "./SummaryModal";
import usePost from "../Hooks/usePost";
import PromotionSuccessfulModal from "./PromotionSuccessfulModal";
import ShareCampaignModal from "../Modals/ShareCampaignModal";
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import ConfirmSubscription from "./ConfirmSubscription";
import SubSummaryModal from "./SubSummaryModal";
import SubSuccessfulModal from "./SubStatusModal";
import SubStatusModal from "./SubStatusModal";




interface ApiResponse {
  data: any;
  loading: boolean;
  error: Error | null;
  postData: (body: any) => Promise<void>;
}

interface CarouselProps {
  children: React.ReactNode[];
  showArrows?: boolean;
  showIndicators?: boolean;
}

const FeedCampaign = ({ item , refreshFeed}: { item: any; refreshFeed: () => void}) => {
  const [campaignMenuOpen, setCampaignMenuOpen] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const[promoting, setPromoting] = useState(false)
  const [paymmentDetails, setPaymentDetails] = useState<object>({})
  const[confirmSubModal, setConfirmSubModal] = useState(false) 
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showPurchaseUnitsModal, setPurchaseUnitsModal] = useState(false);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [insufficientWalletModal, setInsufficientWalletModal] = useState(false);
  const [summaryModal, setSummaryModal] = useState(false);
  const [promotionSuccessfulModal, setPromotionSuccessfulModal] = useState(false);
  const [subSummaryModal, setSubSummaryModal] = useState(false);
  const [shareCampaignModal, setShareCampaignModal] = useState(false);
  const [subStatusModal, setSubStatusModal] = useState(false);
  const [promotionType, setPromotionType] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [unitsToPurchase, setUnitsToPurchase] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [allData, setAllData] = useState<any>({});
  const onSuccess = () => {}
  const onError = () => {}
  const openCampaignMenu = () => { setCampaignMenuOpen(true);  document.body.style.overflow = 'hidden'; };
  const closeCampaignMenu = () => {setCampaignMenuOpen(false); document.body.style.overflow = 'auto'; };
  const openPromoteModal = () => {setShowPromoteModal(true); document.body.style.overflow = 'hidden'; };
  const closePromoteModal = () => {setShowPromoteModal(false); document.body.style.overflow = 'auto'; };
  const openSubscriptionModal = () => { setShowSubscriptionModal(true);  };
  const closeSubscriptionModal = () =>{  setShowSubscriptionModal(false)  };
  const openPurchaseUnitsModal = () => { setPurchaseUnitsModal(true); document.body.style.overflow = 'hidden'; };
  const closePurchaseUnitsModal = () => {setPurchaseUnitsModal(false); document.body.style.overflow = 'auto'; };
  const openPaymentMethodModal = () => setPaymentMethodModal(true);
  const closePaymentMethodModal = () => setPaymentMethodModal(false);
  const openInsufficientWalletModal = () => setInsufficientWalletModal(true);
  const closeInsufficientWalletModal = () => setInsufficientWalletModal(false);
  const opensummarymodal = () => setSummaryModal(true);
  const closeSummaryModal = () => setSummaryModal(false);
  const openSubSummaryModal = () => setSubSummaryModal(true);
  const closeSubSummaryModal = () => setSubSummaryModal(false);
  const openConfirmSubscription = () => setConfirmSubModal(true);
  const closeConfirmSubscription = () => {setConfirmSubModal(false); setAllData({})};
  const openPromotionSuccessfulModal = () => setPromotionSuccessfulModal(true);
  const closePromotionSuccessfulModal = () => {setPromotionSuccessfulModal(false); setAllData({})};
  const openSubStatusModal = () => setSubStatusModal(true);
  const closeSubStatusModal = () => {setSubStatusModal(false); setAllData({})};
  const openShareCampaignModal = () => setShareCampaignModal(true);
  const closeShareCampaignModal = () =>   setShareCampaignModal(false);
   const [isExpanded, setIsExpanded] = useState(false);
    const toggleReadMore = () => setIsExpanded(!isExpanded);
    const maxLength = 100; 

const campaignId = item.campaignId;
const accountId = item.accountId;
const walletURL = `${baseURL}/Wallet/WalletProfile`
  const { data: WalletData, refreshApi: refreshWalletData, error: walletError, loading: WalletDataLoading
  } = useFetch(walletURL, "GET", onSuccess, onError);
 const walletBalance = WalletData?.walletBalance;
  const endorseWithWalletURL = `${baseURL}/Campaign/EndorseCampaignWithWallet`
const promoteURL = `https://iendorse.net/promote-campaign`

const endorseWithWalletData = {
  campaignId: campaignId,
  numberOfUnits: unitsToPurchase,
  endorsementNote: "I hereby endorse & promote this campaign"
}

const { data: ApiFeedback, loading: ApiFeedbackLoading, error, postData } = usePost(endorseWithWalletURL);


 
 

  const handleSelectPromotionType = (type: string) => {
    setPromotionType(type);   
    
  }

  const submitPromotionType = (promotionType: string) => {
    if(promotionType === "PurchaseUnits"){
      openPurchaseUnitsModal();
    } else if(promotionType === "Subscription"){
      openSubscriptionModal();
    }
    setAllData({...allData, promotionType: promotionType});
    closePromoteModal()
}

  const handleSubPlanSelect = (plan: string) => {
    setSubscriptionPlan(plan);  
   const amount = plan === "Basic" ? 1000 : plan === "Standard" ? 5000 : plan === "Premium" ? 10000 : 0;

    setAllData({...allData,accountId: accountId, subscriptionPlan: plan, amount: amount, walletBalance: walletBalance, campaignId: campaignId});
    
   closeSubscriptionModal();
   openSubSummaryModal();
   
   //toast.success("Subscription Plan Selected");
   //openPaymentMethodModal();
     
  }

  const submitUnitsToPurchase = (units:number) => {
    setUnitsToPurchase(units)
    setAllData({...allData, unitsToPurchase: units});
    closePurchaseUnitsModal();
    openPaymentMethodModal();
  }

  const submitPaymentMethod = (method: any) => {
    setAllData({ ...allData, paymentMethod: method, walletBalance: walletBalance, campaignId: campaignId });
    setPaymentMethod(method)
    let preferredPaymentMethod = method;
    closePaymentMethodModal();
    console.log(" Prefered PAyment method:", preferredPaymentMethod)
    if (preferredPaymentMethod == "Wallet") {
      if (unitsToPurchase > walletBalance) {
         openInsufficientWalletModal();
      } else {
        console.log("opening summary modal")
        opensummarymodal()
      }
    }
  }

 
  const promoteCampaign = async () => {
    console.log("..........Promoting campaign");
    setPromoting(true)
  
    //formData
    const formData = new FormData();
    formData.append("campaignId", campaignId);
    formData.append("numberOfUnits", unitsToPurchase.toString());
    formData.append("endorsementNote", "I hereby promote this campaign");

    try {
      const response = await fetch(promoteURL, {
        method: "POST",
        body: formData
      });
  
      const data = await response.json(); // Parse response
      //const data2 = await postData(endorseWithWalletData);
    
      if(data.success){
        //refresh Feed
        console.log("Campaign refershing");
        refreshFeed();
      }
  
      console.log("Response received:", data); // Log API response for debugging
    } catch (err) {
      console.error("Error posting data:", err);
      toast.error("Failed to promote. Please try again.");
      return;
    } finally {
      setPromoting(false);
      setSummaryModal(false);
      setPromotionSuccessfulModal(true);
    }
  }

  const InitializePayment = async () => {
    openSubStatusModal();
    closeSubSummaryModal();
  
  const URL = `${baseURL}/Wallet/InitializePaystackPayment`
   const units = allData.amount;
   
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ accountId, units }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()

      // Set the API response in state
      // setApiResponse(responseData.data)

      if (responseData) {
        // Open the authorization URL in a new tab
        window.open(`${responseData.data.authorization_url}`, "_blank")
              setAllData({ ...allData, accessCode: responseData.data.access_code, reference: responseData.data.reference });
        // Navigate to the TransactionDetails page with access_code and reference
        // navigate("/TransactionDetails", {
        //   state: {
        //     access_code: responseData.data.access_code,
        //     reference: responseData.data.reference,
        //   },
        // })
      }
    } catch (err) {
      console.log("An error occured:", err)
    } finally {
      // setLoading(false)
      // console.log("INITIALIZE TRANSAC", apiResponse)
    }
  }


  function formatDate(timestamp:string) {
    const dateObj = new Date(timestamp);
    const options:any = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-GB', options);
  }
  return (
    <>
      <div className="p-4 w-full  max-w-xl sm:border-gray-200 sm:border  bg-white rounded-2xl my-5 px-6">
      <div className="flex items-center justify-between mb-3" >
          <div>
            <button className="bg-green-100 text-green-600 rounded-lg px-4 py-2 text-xs font-medium">
            {item?.endorseCount}  Endorsements 
            </button>
          </div>
          <div onClick={openCampaignMenu} className="cursor-pointer">
            <img src={threeDots} />
          </div>
        </div>

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
        >
          <source src={file.filePath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img 
          src={file.filePath} 
          alt={`Campaign ${index}`} 
          className="w-full max-h-full object-cover" 
        />
      )}
    </div>
  ))}
        </Carousel>

<div>
<div className="my-4">
        <h1 className="font-medium text-lg truncate">{item?.campaignTitle}</h1>
        <div className="mt-2">
          <p className="text-justify text-sm">
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

 
 



  
<div className="flex justify-between mt-10 mb-3 text-sm gap-x-2">
  {[
    { label: "Share Campaign", onClick: openShareCampaignModal },
    { label: "Promote Campaign", onClick: openPromoteModal },
  ].map((button, index) => (
    <div key={index} className="flex items-center w-full">
      <button
        className="w-full p-2 bg-customBlue text-white rounded-md truncate"
        onClick={button.onClick}
        style={{ minWidth: "120px" }}
      >
        <span className="text-xs">{button.label}</span>
      </button>
    </div>
  ))}
</div>


       
      </div>

      <CampaignMenu 
        isOpen={campaignMenuOpen} 
        onClose={closeCampaignMenu} 
        details={item}
      />

      <PromoteModal
        isOpen={showPromoteModal}
        onClose={closePromoteModal}
        onSubmit={submitPromotionType}
      />

    <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={closeSubscriptionModal}
        onSubmit={handleSubPlanSelect}
      />

    <PurchaseUnitsModal
        isOpen={showPurchaseUnitsModal}
        onClose={closePurchaseUnitsModal}
        onSubmit={submitUnitsToPurchase}
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
        onSubmit={promoteCampaign}
        details ={allData}
        ApiLoading={promoting}
      />


<SubSummaryModal
        isOpen={subSummaryModal}
        onClose={closeSubSummaryModal}  
        onSubmit={InitializePayment}
        details ={allData}
        Loading={promoting}
      />


    <PromotionSuccessfulModal
            isOpen={promotionSuccessfulModal}
            onClose={closePromotionSuccessfulModal}
            details ={allData}
          />


    <SubStatusModal
            isOpen={subStatusModal}
            onClose={closeSubStatusModal}
            details ={allData}
          />



    <ConfirmSubscription
            isOpen={confirmSubModal}
            onClose={closeConfirmSubscription}
            details ={allData}
          />


      <ShareCampaignModal
              isOpen={shareCampaignModal}
              onClose={closeShareCampaignModal}
              details ={item}
            />


    </>
  );
};

export default FeedCampaign;