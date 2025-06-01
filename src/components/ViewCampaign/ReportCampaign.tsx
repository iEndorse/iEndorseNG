import React, { useState , useEffect} from 'react';
import close from '../svg/close.svg';
import { baseURL } from '../URL';
import { toast } from 'react-toastify';
import { LineWave } from 'react-loader-spinner';


interface ReportCampaignProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: number; // Add campaignId as a prop
}

const ReportCampaign: React.FC<ReportCampaignProps> = ({ isOpen, onClose, campaignId }) => {
  const [description, setDescription] = useState("");
  const [complaint, setComplaint] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [complaintError, setComplaintError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const campaignURL = `${baseURL}/Campaign/ReportCampaign?CampaignId=${campaignId}`
  // Handle complaint selection
  const handleComplaint = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setComplaint(e.target.value);
    setComplaintError(""); // Clear error when user selects a complaint
  };

  // Handle description input
  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setDescriptionError(""); // Clear error when user types
  };

  // Submit form data to API
  const handleSubmit = async () => {
    let hasError = false;

    if (!complaint) {
      setComplaintError("Please select a complaint type.");
      hasError = true;
    }

    if (!description) {
      setDescriptionError("Please provide a description.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // If no errors, proceed with API call
    setIsLoading(true); // Show loading state

    const requestBody = {
      campaignId: campaignId,
      complaintTitle: complaint,
      complaintDescription: description,
    };

    try {
      const response = await fetch(campaignURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.localStorage.getItem("token")}`, // Add token if needed
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);
        // Optionally show success message
        toast.success("Your complaint has been submitted successfully!");
        setDescription(""); // Clear form fields
        setComplaint("");
        onClose();
      } else {
        console.error("Failed to submit complaint:", response.statusText);
        toast.error("Failed to submit your complaint. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false); // Hide loading state
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
    <div className="fixed z-50 inset-0 transition-opacity flex items-center justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="flex justify-center p-4">
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="x" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5">
            <h1 className="text-center font-bold mb-4">Report Campaign</h1>

            <div className="flex-col max-w-sm space-y-2 justify-center mb-20">
              <div>
                <select
                  onChange={handleComplaint}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={complaint} // Ensure controlled component behavior
                >
                  <option disabled value="">Complaint</option>
                  <option value="Fraudulent or misleading information">Fraudulent or misleading information</option>
                  <option value="Violation of guidelines">Violation of guidelines</option>
                  <option value="Suspected scam">Suspected scam</option>
                  <option value="Inappropriate content">Inappropriate content</option>
                  <option value="Intellectual Property Infringement">Intellectual property infringement</option>
                </select>
                {complaintError && <p className="text-red-500 text-sm">{complaintError}</p>}
              </div>

              <div className="flex items-center border border-gray-200 rounded mt-4">
                <div className="w-full">
                  <textarea
                    onChange={handleDescription}
                    name="Description"
                    id="note"
                    value={description}
                    rows={6}
                    className="resize-none text-gray-900 text-md block w-full p-2.5"
                    placeholder="Description"
                  />
                </div>
              </div>
              {descriptionError && <p className="text-red-500 text-sm">{descriptionError}</p>}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none
               focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? <>
               <LineWave
                    visible={true}
                    height="40"
                    width="40"
                    color="#fff"
                    ariaLabel="line-wave-loading"
                  />  </> : "Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCampaign;
