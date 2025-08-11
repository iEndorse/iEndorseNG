import React, { useEffect, useState } from 'react';
import close from '../svg/close.svg';
import editPen from '../svg/editPen.svg';
import { toast } from "sonner";
import PhoneInput from 'react-phone-input-2';
import { baseURL } from '../URL';
import { Audio, LineWave } from 'react-loader-spinner';
import { Backdrop, CircularProgress } from "@mui/material";
interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
}
const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
  const userData: any = window.localStorage.getItem("userData");
  const parsedUserData = JSON.parse(userData);
  const [fullName, setFullName] = useState<string>(parsedUserData?.fullName || '');
  const[id, setId] = useState<string>(parsedUserData?.id || '');
  const[emailAddress, setEmailAddress] = useState<string>(parsedUserData?.emailAddress || '');
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [sex, setSex] = useState<string>(parsedUserData?.sex || '')
  const [occupation, setOccupation] = useState<string>(parsedUserData?.occupation || '')
  const [error, setError] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>(parsedUserData?.phoneNumber || '');
  const token = parsedUserData?.jwtToken || '';
  const [profilePicture, setProfilePicture] = useState<string>();

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(name => name[0]).join('');
    return initials.toUpperCase();
  };

  // const handlePhoneChange = (value: string) => {
  //   setPhoneNumber(value);

  // }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'occupation':
        setOccupation(value);
        break;
      case 'sex':
        setSex(value);
        break;
      default:
        break;
    }
  }

const handlePhoneChange = (value: string) => {
  setPhoneNumber(value);    
}

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const img = new Image();
  //       img.src = reader.result as string;
  
  //       img.onload = () => {
  //         const canvas = document.createElement('canvas');
  //         const ctx = canvas.getContext('2d');
  
  //         const size = Math.min(img.width, img.height); // The size will be the smallest dimension
  
  //         // Set canvas to square dimensions
  //         canvas.width = size;
  //         canvas.height = size;
  
  //         // Draw the image onto the canvas, centered, and cropped to a square
  //         ctx?.drawImage(
  //           img,
  //           (img.width - size) / 2,  // Start cropping from this x position
  //           (img.height - size) / 2, // Start cropping from this y position
  //           size,  // Crop width
  //           size,  // Crop height
  //           0,     // Place at x=0 on the canvas
  //           0,     // Place at y=0 on the canvas
  //           size,  // Width of the canvas
  //           size   // Height of the canvas
  //         );
  
  //         // Convert the canvas back to a data URL
  //         const resizedImage = canvas.toDataURL('image/jpeg');
  //         setProfilePicture(resizedImage); // Set the resized image as the profile picture
  //       };
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageLoading(true); // Set loading state to true when the image upload starts
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          if (!ctx) {
            console.error('Failed to get canvas context');
            setImageLoading(false); // Stop loading if canvas context fails
            return;
          }
  
          const size = Math.min(img.width, img.height); // Use the smallest dimension
  
          // Set canvas to square dimensions
          canvas.width = size;
          canvas.height = size;
  
          // Draw the image onto the canvas, centered, and cropped to a square
          ctx.drawImage(
            img,
            (img.width - size) / 2,  // Crop from the x position
            (img.height - size) / 2, // Crop from the y position
            size,                    // Crop width
            size,                    // Crop height
            0,                       // Start x on canvas
            0,                       // Start y on canvas
            size,                    // Canvas width
            size                     // Canvas height
          );
  
          // Determine the MIME type based on the file extension
          const mimeType = file.type || 'image/jpeg'; // Default to 'image/jpeg' if unknown
          const resizedImage = canvas.toDataURL(mimeType);
  
          setProfilePicture(resizedImage); // Set the resized image as the profile picture
          setImageLoading(false); // Stop loading once the image is processed
        };
  
        img.onerror = (error) => {
          console.error('Error loading image', error);
          setImageLoading(false); // Stop loading on image load error
        };
      };
  
      reader.onerror = (error) => {
        console.error('Error reading file', error);
        setImageLoading(false); // Stop loading on file reading error
      };
  
      reader.readAsDataURL(file);
    } else {
      setImageLoading(false); // Stop loading if no file is selected
    }
  };
  
  const handleSubmit = async () => {
    setLoading(true);
  
    // Create a transformed data object with only updated fields for the API call
    const transformedData: any = {
      id: id,
      fullName: fullName,
      sex: sex,
      emailAddress: parsedUserData.emailAddress,
      occupation: occupation,
      phoneNumber:  phoneNumber,
      imageBase64String: profilePicture ? profilePicture : undefined, // Only add image if uploaded
    };
  
    // Remove undefined fields so they are not sent to the API
    Object.keys(transformedData).forEach((key) => {
      if (transformedData[key] === undefined) {
        delete transformedData[key];
      }
    });
  
    try {
      const response = await fetch(`${baseURL}/Account/UpdateUserAccountDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
        },
        body: JSON.stringify(transformedData),
      });
  
      const data = await response.json();
  
      if (response.ok && data.succeeded) {
        // Fetch existing data from localStorage
        const existingUserData = JSON.parse(window.localStorage.getItem("userData") || "{}");
  
        // Merge updated fields with the existing data, using imageUrl for the profile picture
        const updatedUserData = { 
          ...existingUserData, 
          ...transformedData, 
          imageUrl: transformedData.imageBase64String // Change to imageUrl for localStorage
        };
  
        // Remove imageBase64String from the merged data
        delete updatedUserData.imageBase64String;
  
        // Save the updated user data to localStorage
        window.localStorage.setItem("userData", JSON.stringify(updatedUserData));
  
        toast.success('Profile updated successfully');
        onClose();
      } else {
        toast.error(data.message || 'An error occurred while updating the profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating the profile');
    } finally {
      setLoading(false);
    }
  };
  
  
const closeAndClear = () => {
  onClose();
  setProfilePicture("");
  setFullName(parsedUserData.fullName);
  setSex(parsedUserData.sex);
  setOccupation(parsedUserData.occupation);
  setPhoneNumber(parsedUserData.phoneNumber);
}
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start sm:items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
         <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={imageLoading}>
              <CircularProgress color="inherit" />
         </Backdrop>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className='flex justify-center p-4'>
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={closeAndClear}
          >
            <img src={close} alt="Close" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow">
          <div className="py-3">
            <div className='border-b pb-2'>
              <h1 className="text-center font-bold">Edit Profile</h1>
            </div>

            <div className='px-5'>
              <div className='flex justify-center mb-3 mt-3'>
                <div className="relative inline-block">
                  <label htmlFor="profile-picture-upload">
                          {profilePicture ? (
          <img
            className="rounded-full border-2 border-white cursor-pointer"
            style={{ boxShadow: '0 0 0 1px #0D236E' }}
            src={profilePicture}
            width={45}
            height={45}
            alt="Avatar"
          />
        ) : parsedUserData.imageUrl ? (
          <img
            className="rounded-full border-2 border-white cursor-pointer"
            style={{ boxShadow: '0 0 0 1px #0D236E' }}
            src={parsedUserData.imageUrl}
            width={45}
            height={45}
            alt="Avatar"
          />
        ) : (
          <div className="flex items-center justify-center h-20 w-20 bg-blue-100 rounded-full text-customBlue font-bold text-lg">
            {getInitials(parsedUserData.fullName)}
          </div>
        )}


                    <img
                      width={70}
                      height={70}
                      src={editPen}
                      className="absolute top-[9px] right-0 transform translate-x-1/4 translate-y-1/4"
                      alt="Edit"
                    />
                  </label>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex-col max-w-sm space-y-3 justify-center mb-5">
                {error && <p className="text-red-500 text-xs my-2">{error}</p>}

                <div className="relative w-full">
                  <label className="absolute left-3 top-1 text-xs text-gray-400 px-1">
                    Email Address
                  </label>
                  <input
                    value={parsedUserData.emailAddress}
                    readOnly
                    className="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md border text-gray-900"
                    placeholder="Email Address"
                  />
                </div>

                <div className="relative w-full">
                  <label className="absolute left-3 top-1 text-xs text-gray-900 px-1">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    value={fullName}
                    onChange={handleChange}
                    className="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md border text-gray-900"
                    placeholder="Full Name"
                  />
                </div>

{/* 
                <div className="relative w-full">
                  <label className="absolute left-3 top-1 text-xs text-gray-900 px-1">
                    Phone Number
                  </label>
                  <input
                    name="fullName"
                    value={"+" + parsedUserData.phoneNumber}
                    // onChange={handleChange}
                    className="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md border text-gray-900"
                    placeholder="Phone Number"
                  />
                </div> */}

                <div className="relative w-full bg-gray-50 border rounded-md">
                  <label className="pl-2 py-2 mb-2 left-3 w-full text-xs text-gray-900 px-1">
                    Phone Number
                  </label>
                  <PhoneInput
                    country={'ng'}
                     
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    inputStyle={{ border: 'none' }}
                    inputClass="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                    buttonStyle={{ border: 'none', backgroundColor: 'transparent' }}
                  />
                </div>

                <div className="relative w-full">
                  <label className="absolute left-3 top-1 text-xs text-gray-900 px-1">
                    Sex
                  </label>
                  <input
                    name="sex"
                    value={sex}
                    onChange={handleChange}
                    className="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md border text-gray-900"
                    placeholder="Sex"
                  />
                </div>

                <div className="relative w-full">
                  <label className="absolute left-3 top-1 text-xs text-gray-900 px-1">
                    Occupation
                  </label>
                  <input
                    name="occupation"
                    value={occupation}
                    onChange={handleChange}
                    className="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md border text-gray-900"
                    placeholder="Occupation"
                  />
                </div>
              </div>

              <button
              disabled={loading}
                onClick={handleSubmit}
                className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center items-center
                  ${loading ? "cursor-not-allowed bg-gray-600" : "bg-customBlue hover:bg-blue-900 focus:ring-4 focus:ring-blue-300"}`}
              >
             <span className='inline'> {!loading && <>  Save Changess </>}    </span> 
                {loading && (
                  <LineWave
                    visible={true}
                    height="30"
                    width="30"
                    color="#fff"
                    ariaLabel="line-wave-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    firstLineColor=""
                    middleLineColor=""
                    lastLineColor=""
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
