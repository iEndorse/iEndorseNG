import { useState, useEffect } from "react"
import { baseURL } from "../URL"
import close from '../svg/close.svg';
interface ModalProps {
  onClose: () => void
  onSuccess: () => void 
  campaignId: string
}

const RequestPointsModal = ({ onClose, onSuccess, campaignId }: ModalProps) => {
  const [linkInput, setLinkInput] = useState("")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculatedPoints, setCalculatedPoints] = useState<number>(0)
  const [isCalculatingPoints, setIsCalculatingPoints] = useState(false)
 
  const userData = JSON.parse(localStorage.getItem("userData") as string)
  const userId = userData.id
  
  // Error handling states
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    link?: string;
    image?: string;
  }>({})

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear errors when user takes action
    setError(null)
    setFieldErrors({})
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors(prev => ({...prev, image: "Image size must be less than 5MB"}))
        return
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setFieldErrors(prev => ({...prev, image: "Please upload a valid image file (JPEG, PNG, GIF, WEBP)"}))
        return
      }
      
      setUploadedImage(file)
      
      // Create a preview URL for the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.onerror = () => {
        setFieldErrors(prev => ({...prev, image: "Failed to read the image file"}))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle link input change
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkInput(e.target.value)
    // Clear link error when user types
    setFieldErrors(prev => ({...prev, link: undefined}))
    setError(null)
  }

  // Calculate points asynchronously
  const readPoints = async () => {
    // Don't calculate if we don't have both link and image
    if (!linkInput.trim() || !uploadedImage) {
      return;
    }

    setIsCalculatingPoints(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('postUrl', linkInput);
      formData.append('campaignId', campaignId);
      formData.append('accountId', userId);

      
      // Add the image file to the form
      formData.append('image', uploadedImage);
      
      const response = await fetch('https://iendorse.net/readPoints', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('Points calculation response:', data);
      setCalculatedPoints(data.totalPoints || 0);
      return data.totalPoints || 0;
    } catch (err) {
      console.error('Error calculating points:', err);
      setError( 'Failed to calculate points');
      return 0;
    } finally {
      setIsCalculatingPoints(false);
    }
  };

  // Effect to calculate points when both link and image are ready
  useEffect(() => {
    if (linkInput.trim() && uploadedImage) {
      const debounceTimer = setTimeout(() => {
        readPoints();
      }, 500); // Debounce to avoid too many calls
      
      return () => clearTimeout(debounceTimer);
    }
  }, [linkInput, uploadedImage]);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // The result includes the "data:image/jpeg;base64," prefix
        // We need to remove this prefix to get the pure base64 string
        const base64String = (reader.result as string).split(',')[1]
        resolve(base64String)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  // Validate form before submission
  const validateForm = (): boolean => {
    const errors: {link?: string; image?: string} = {}
    
    // Validate link
    if (!linkInput.trim()) {
      errors.link = "Link is required"
    }
    //  else if (!linkInput.startsWith('http')) {
    //   errors.link = "Please enter a valid URL starting with http:// or https://"
    // }
    
    // Validate image
    if (!uploadedImage) {
      errors.image = "Please upload a screenshot of your campaign"
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Clear previous errors
    setError(null)
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      let base64Resource = ""
      if (uploadedImage) {
        try {
          base64Resource = await fileToBase64(uploadedImage)
        } catch (err) {
          setError("Failed to process the image. Please try uploading again.")
          setIsSubmitting(false)
          return
        }
      }

      // Calculate points if not already calculated
      let pointValue = calculatedPoints;
      if (pointValue === 0 && !isCalculatingPoints) {
        pointValue = await readPoints();
      }

      // Format the data as required by the endpoint
      const requestData = {
        accountId: userId, 
        base64Resource: base64Resource,
        requestLink: linkInput,
        pointsRequested: pointValue,
        campaignId: campaignId,
      }
      
      // Actual API call
      const response = await fetch(`${baseURL}/PointRequest/AddPointRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        // Get more specific error message if available
        let errorMessage = "Failed to submit request"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || `Error: ${response.status} ${response.statusText}`
        } catch {
          errorMessage = `Error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      // Call the success callback
      onSuccess()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("Error submitting request:", error)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed z-50 inset-0 transition-opacity flex items-start sm:items-center mt-20 sm:mt-1 justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
 
      <div className="relative px-6 py-4 w-full max-w-md max-h-full">
        <div className='flex justify-center p-4'>      
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="x" width={40} height={40} />
          </span> 
        </div> 
    
        <div className="relative bg-white p-4 rounded-lg shadow">
          <div className="text-center mb-6">
            <h3 className="font-bold text-lg mb-2">Request Points</h3>
            <p className="text-gray-600 text-xs">
              Please provide a screenshot and a link to the shared campaign with the highest engagements.
            </p>
          </div>
          
          {/* General error message display */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="mb-5">
            <input
              type="text"
              placeholder="Link"
              value={linkInput}
              onChange={handleLinkChange}
              className={`w-full p-2 border rounded-md ${
                fieldErrors.link ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            />
            <div className="flex justify-between items-center mt-1">
              <span style={{ fontSize: '8px' }} className="bg-blue-100 px-2 py-1 mt-2 rounded-md text-blue-500">This should be the link with the highest engagement</span>
              {fieldErrors.link && <span className="text-red-500 text-xs">{fieldErrors.link}</span>}
            </div>
          </div>
          
          {imagePreview ? (
            <div className="flex items-center gap-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-24 h-24 object-contain rounded" 
              />
              <button 
                onClick={() => {
                  setImagePreview(null);
                  setUploadedImage(null);
                  setCalculatedPoints(0);
                  setFieldErrors(prev => ({...prev, image: undefined}));
                }}
                className="bg-red-500 text-white rounded-full p-1 text-xs flex-shrink-0"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block w-full">
                <div className={`bg-gray-100 text-gray-700 p-2 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors ${
                  fieldErrors.image ? 'border-2 border-red-500' : ''
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload campaign media 
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </label>
              {fieldErrors.image && <p className="text-red-500 text-xs mt-1">{fieldErrors.image}</p>}
            </div>
          )}
          
          {/* Show calculated points if available */}
          {(isCalculatingPoints || calculatedPoints > 0) && (
            <div className="mb-4 p-2 bg-gray-50 border rounded mt-4">
              <p className="text-sm text-gray-600">Points:</p>
              {isCalculatingPoints ? (
                <p className="font-medium text-gray-400">Calculating...</p>
              ) : (
                <p className="font-bold">{calculatedPoints}</p>
              )}
            </div>
          )} 
          
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isCalculatingPoints}
              className={`w-full p-3 text-white bg-customBlue rounded ${
                isSubmitting || isCalculatingPoints
                  ? "cursor-not-allowed opacity-70"
                  : "hover:bg-blue-900"
              } transition-colors`}
            >
              {isSubmitting ? "Processing..." : isCalculatingPoints ? "Calculating..." : "Proceed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestPointsModal