import React, {useEffect, useState} from 'react';
import close from '../svg/close.svg';
import greenCheck from '../svg/greenCheck.svg'
import { toast } from 'sonner';
import CampaignMenu from './CampaignMenu';
import { baseURL } from '../URL';

interface SubStatusModalProps { 
  isOpen: boolean;
  onClose: () => void;
  details: any;
}

const SubStatusModal: React.FC<SubStatusModalProps> = ({ isOpen, onClose, details }) => {
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState("");
  const reference = details.reference;
  const [promoting, setPromoting] = useState(false);
  
  const verifyurl = `${baseURL}/Wallet/VerifyPaystackPaymentResponse`;
   const promoteURL = `https://iendorse.net/promote-campaign`
    const promoteCampaign = async () => {
      console.log("..........Promoting campaign");
      setPromoting(true)
      //formData
      const formData = new FormData();
      formData.append("campaignId", details.campaignId);
      formData.append("plan", details.subscriptionPlan);
      formData.append("amount", details.amount.toString());
      formData.append("accountId", details.accountId);
//formData.append("endorsementNote", "I hereby promote this campaign");
  
      try {
        const response = await fetch(promoteURL, {
          method: "POST",
          body: formData
        });
    
        const data = await response.json(); // Parse response
        //const data2 = await postData(endorseWithWalletData);
      
        if(data.success){
          //refresh Feed
      
        
        }
    
        console.log("Response received:", data); // Log API response for debugging
      } catch (err) {
        console.error("Error posting data:", err);
        toast.error("Failed to promote. Please try again.");
        return;
      } finally {
        setPromoting(false);
      }
    }
  



  const fetchTransactionData = async () => {
    if (!reference) {
      setError("Transaction reference is missing");
      return;
    }

    try {
      setError("");
      const token = window.localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated. Please log in.");
        return;
      }

      const response = await fetch(verifyurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reference }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transaction data");
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log
      if(data.succeeded){
        promoteCampaign();
        setTransactionData(data);
 

      }
   

    } catch (err) {
      console.error(err);
      setError("Failed to validate payment, please try again or contact support.");
    }
  };

  useEffect(() => {
    // Only run effects when modal is open
    if (isOpen) {
      // Initial fetch when modal opens
      fetchTransactionData();
      
      // Set up polling interval
      const intervalId = setInterval(() => {
        fetchTransactionData();
      }, 10000);
      
      // Clean up interval when modal closes or component unmounts
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isOpen, reference]); // Added reference to dependencies

  // Render null if modal is not open (after hooks are called)
  if (!isOpen) {
    return null;
  }

  return (
    <div className="z-50 fixed inset-0 transition-opacity flex items-center justify-center">
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
          <div className="w-full max-w-md">
            {error && (
              // <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md text-red-600">
              //   <h2 className="text-xl font-bold mb-4">Error</h2>
              //   <div>{error}</div>
              // </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-customBlue">Pending...</h2>
              <div className="text-gray-700">Kindly proceed to complete your payment to activate your subscription</div>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-customBlue"></div>
              </div>
            </div>
            )}

            {!error && !transactionData && (
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-customBlue">Pending...</h2>
                <div className="text-gray-700">Your transaction is being verified by the system.</div>
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-customBlue"></div>
                </div>
              </div>
            )}

            {transactionData && (
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  <img src={greenCheck} alt="Success" width={60} height={60} />
                </div>
                <h2 className="text-xl font-bold mb-4 text-center text-green-600"> Promotion Successful</h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-600">Subscription Plan</span>
                    <span className="text-gray-800">{details.subscriptionPlan}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-600">Amount:</span>
                    <span className="text-gray-800">&#8358; {transactionData?.data?.formattedAmount}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-600">Payment Status:</span>
                    <span
                      className={`${
                        transactionData?.data?.paymentStatus === "SUCCESSFUL"
                          ? "text-green-600 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {transactionData?.data?.paymentStatus}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {setTransactionData(null); onClose()}}
                  className="mt-6 w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center"
                >
                  Okay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubStatusModal;