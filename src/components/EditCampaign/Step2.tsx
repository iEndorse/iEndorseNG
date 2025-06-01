import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import upload from '../svg/upload.svg';
import AgeModal from './AgeModal';
import { toast } from 'react-toastify';
import blueclose from '../svg/blueclose.svg';
import caret from '../svg/caret.svg'
import add from '../svg/add.svg'
import OccupationModal from './OccupationModal';
import RegionModal from './RegionModal';
import GenderModal from './GenderModal';
import back from  '../svg/back.svg';
import { baseURL } from '../URL';
import useFetch from '../Hooks/useFetch';
import { Backdrop, CircularProgress } from "@mui/material";


const Step2 = ({ prevStep, handleFileChange, handleFieldChange, handleTagChange, formData }: any) => {
 
  const [createLoading, setCreateLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [ageModal, setAgeModal] = useState(false);
  const [occupationModal, setOccupationModal] = useState(false);
  const [regionModal, setRegionModal] = useState(false);
  const [genderModal, setGenderModal] = useState(false);
  const [selectedAges, setSelectedAges] = useState<any[]>(formData.Age || []);
  const [selectedOccupation, setSelectedOccupation] = useState<any[]>(formData.Occupation || []);
  const [selectedRegion, setSelectedRegion] = useState<any[]>(formData.Region || []);
  const [selectedGender, setSelectedGender] = useState<any[]>(formData.Gender || []);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const openAgeModal = () => setAgeModal(true);
  const closeAgeModal = () => setAgeModal(false);
  const openOccupationModal = () => setOccupationModal(true);
  const closeOccupationModal = () => setOccupationModal(false);
  const openRegionModal = () => setRegionModal(true);
  const closeRegionModal = () => setRegionModal(false);
  const openGenderModal = () => setGenderModal(true);
  const closeGenderModal = () => setGenderModal(false);

  const url = `${baseURL}/CampaignTargetAudience/GetAll`;
  const onSuccess = () => {};
  const onError = () => {};
  const { data: apiData, refreshApi: refresh, error: Error, loading: AudienceLoading} = useFetch(url, "GET", onSuccess, onError);
  const Genders = apiData && apiData.length > 0 ? apiData[7].values : [];
   
  const GenderId =  apiData ? apiData[7].id : 0;
  const RegionId =  apiData? apiData[8].id : 0;
 const OccupationId =  apiData? apiData[7].id : 0;
  const AgeId =  apiData ? apiData[6].id : 0;
 console.log("ids: " , GenderId, RegionId, OccupationId, AgeId);

const handleSubmit = async (e: any) => {
  e.preventDefault();
  setCreateLoading(true);
  
  // Validate required fields
  let isValid = true;
  const validationErrors: { [key: string]: string } = {};
  
  if (formData.Age.length===0) {
    validationErrors.Age = 'Please select an age group.'
    isValid = false;
  }
  if (formData.Gender.length===0) {
    validationErrors.Gender = 'Please select a gender.';
    isValid = false;
  }

  if (formData.Occupation.length===0) {
    validationErrors.Occupation = 'Please select an Occupation.';
    isValid = false;
  }
  if (formData.Region.length===0) {
    validationErrors.Region = 'Please select a region.';
    isValid = false;
  }




  // If any validation fails, show errors and stop the submission
  if (!isValid) {
    setError(validationErrors);
    setCreateLoading(false);
    return;
  }

  // Map formData to the expected backend structure
  const transformedData = {
    categoryId: formData.CampaignCategory,
    campaignTitle: formData.CampaignTitle,
    campaignLink: formData.CampaignLink,
    description: formData.Description,
    tags: formData?.tags.map((tag: any) => tag.id), // Convert to an array of tag IDs
    campaignMedias: formData.campaignMedias, // Already an array of strings (base64)
    campaignTargetAudienceAnswers: [
      {
        id: AgeId, 
        answer: formData.Age
      },
      {
        id: OccupationId, // Assuming 2 is for Occupation
        answer: formData.Occupation
      },
      {
        id: RegionId, // Assuming 3 is for Region
        answer: formData.Region
      },
      {
        id: GenderId, // Assuming 4 is for Gender
        answer: formData.Gender
      }
    ],
    campaignUnit: 10 // If campaignUnit is a fixed value or needs to be derived from somewhere
  };

  const apiUrl = `${baseURL}/Campaign/CreateCampaignV2`;
  setCreateLoading(true);
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${window.localStorage.getItem('token')}`
      },
      body: JSON.stringify(transformedData), // Send the transformed data
    });

    const data = await response.json();

    if (response.ok && data.succeeded) {
      toast('Successfully created campaign');
    } else {
      toast.error(data.message || 'An error occurred while creating the campaign');
    }
  } catch (error) {
    console.error('Error creating campaign:', error);
    toast.error('An error occurred while creating the campaign');
    setCreateLoading(false);
  } finally {
    setCreateLoading(false);
  }
};

  

  const handleSelectAge = (age: any) => {
    if (!selectedAges.includes(age)) {
      setSelectedAges([...selectedAges, age]);
     // handleFieldChange('Age')(selectedAges);
    } else {
      toast.error(`You have already selected the age range ${age}.`);
    }
  };


  const handleOccupation = (occupation: any) => {
    if (!selectedOccupation.includes(occupation)) {
      setSelectedOccupation([...selectedOccupation, occupation]);
     // handleFieldChange('Age')(selectedAges);
    } else {
      toast.error(`You have already selected the occupation ${occupation}.`);
    }
  };

  
  const handleRegion = (region: any) => {
    if (!selectedRegion.includes(region)) {
      setSelectedRegion([...selectedRegion, region]);
     // handleFieldChange('Age')(selectedAges);
    } else {
      toast.error(`You have already selected the region ${region}.`);
    }
  };


  
  const handleGender = (gender: any) => {
    if (!selectedGender.includes(gender)) {
      setSelectedGender([...selectedGender, gender]);
     // handleFieldChange('Age')(selectedAges);
    } else {
      toast.error(`You have already selected the gender ${gender}.`);
    }
  };
 

  const removeAge = (age: any) => {
    setSelectedAges(selectedAges.filter((selectedAge) => selectedAge !== age));
  };


  const removeOccupation = (occupation: any) => {
    setSelectedOccupation(selectedOccupation.filter((selectedOccupation) => selectedOccupation !== occupation));
  };

  
  const removeRegion = (region: any) => {
    setSelectedRegion(selectedRegion.filter((selectedRegion) => selectedRegion !== region));
  };

  
  const removeGender = (gender: any) => {
    setSelectedGender(selectedGender.filter((selectedGender) => selectedGender !== gender));
  };




  useEffect(() => {
    handleFieldChange('Age')(selectedAges);
  }, [selectedAges]);
  
  useEffect(() => {
    handleFieldChange('Occupation')(selectedOccupation);
  }, [selectedOccupation]);

  useEffect(() => {
    handleFieldChange('Region')(selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    handleFieldChange('Gender')(selectedGender);
  }, [selectedGender]);

 
  return (
    <>
      <div className="flex bg-gray-100 justify-center text-xs">
      <Backdrop
              sx={{ color: '#dc0000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={AudienceLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
      <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={ createLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
        <div className="bg-white p-5 rounded-lg max-w-md h-auto my-10">
          <div className="flex items-center justify-center mb-5">
            <div className="flex-1 border-1 border-t border-gray-300"></div>
            <div className="flex-1 border-2 border-t border-customBlue"></div>
          </div>
          <img src="./images/frame1.png" alt="frame1" className="mx-auto" />

          <div className="text-center p-3">
            <h1 className="font-bold">Target Audience</h1>
            <p>Ensure your campaign gets the views and reach it needs</p>
          </div>

          <form className="space-y-4 mt-4" >
          <div className="relative">
          <input
            placeholder="Age"
            name="Age"
            onChange={handleFieldChange('Age')}
            value={formData.Age}
            onClick={openAgeModal}
            className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 cursor-pointer ${selectedAges.length > 0 && 'hidden'}`}
          />

          <img
            src={caret}
            className={`absolute right-3 h-5 w-5  top-1/2 transform -translate-y-1/2 pointer-events-none ${selectedAges.length > 0 && 'hidden'}`}
            alt="caret"
          />
        </div>
        {error.Age && <p className="text-red-500 text-xs  ml-1 ">{error.Age}</p>}
            { selectedAges.length > 0 && (
                <div className="border p-2 rounded-md">
                  <p className='pt-1 ml-1'> Age</p>
                {selectedAges.map((age: any) => (
                  <span
                    key={age}
                    className="inline-block bg-gray-200 rounded-lg px-3 py-2 my-2 text-xs font-semibold text-gray-700 mr-2"
                  >
                    {age}
                    <img
                      src={blueclose}
                      alt="close"
                      className="inline-block ml-2 cursor-pointer"
                      onClick={() => removeAge(age)}
                    />
                  </span>
                ))}
                  <img onClick={openAgeModal} src={add}  width={30} height={30} className='inline-block ml-2 cursor-pointer'/>
                 
              </div>
  
            )}
           
                
              <div className="relative">
            <input
              placeholder="Occupation"
              name="Occupation"
              onChange={handleFieldChange('Occupation')}
              value={formData.occupation}
              onClick={openOccupationModal}
              className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 cursor-pointer ${selectedOccupation.length > 0 && 'hidden'}`}
            />

            <img
              src={caret}
              className={`absolute right-3 h-5 w-5  top-1/2 transform -translate-y-1/2 pointer-events-none ${selectedOccupation.length > 0 && 'hidden'}`}
              alt="caret"
            />
             </div>


              { selectedOccupation.length > 0 && (
                  <div className="border p-2 rounded-md">
                      <p className='pt-1 ml-1'> Occupation</p>
                  {selectedOccupation.map((occupation: any) => (
                    <span
                      key={occupation}
                      className="inline-block bg-gray-200 rounded-lg px-3 py-2 my-2 text-xs font-semibold text-gray-700 mr-2"
                    >
                      {occupation}
                      <img
                        src={blueclose}
                        alt="close"
                        className="inline-block ml-2 cursor-pointer"
                        onClick={() => removeOccupation(occupation)}
                      />
                    </span>
                  ))}
                    <img onClick={openOccupationModal} src={add}  width={30} height={30} className='inline-block ml-2 cursor-pointer'/>
                </div>
    
              )}
     {error.Occupation && <p className="text-red-500 text-xs  ml-1 ">{error.Occupation}</p>}


                  
      <div className="relative">
            <input
              placeholder="Select Region"
              name="Region"
              onChange={handleFieldChange('Region')}
              value={formData.Region}
              onClick={openRegionModal}
              className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 cursor-pointer ${selectedRegion.length > 0 && 'hidden'}`}
            />

            <img
              src={caret}
              className={`absolute right-3 h-5 w-5  top-1/2 transform -translate-y-1/2 pointer-events-none ${selectedRegion.length > 0 && 'hidden'}`}
              alt="caret"
            />
             </div>


              { selectedRegion.length > 0 && (
                  <div className="border p-2 rounded-md">
                        <p className='pt-1 ml-1'> Region</p>
                  {selectedRegion.map((region: any) => (
                    <span
                      key={region}
                      className="inline-block bg-gray-200 rounded-lg px-3 py-2 my-2 text-xs font-semibold text-gray-700 mr-2"
                    >
                      {region}
                      <img
                        src={blueclose}
                        alt="close"
                        className="inline-block ml-2 cursor-pointer"
                        onClick={() => removeRegion(region)}
                      />
                    </span>
                  ))}
                    <img onClick={openRegionModal} src={add}  width={30} height={30} className='inline-block ml-2 cursor-pointer'/>
                 
                </div>
    
              )}

{error.Region && <p className="text-red-500 text-xs  ml-1 ">{error.Region}</p>}

     <div className="relative">
            <input
              placeholder="Select Gender"
              name="Gender"
              onChange={handleFieldChange('Gender')}
              value={formData.Gender}
              onClick={openGenderModal}
              className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 cursor-pointer ${selectedGender.length > 0 && 'hidden'}`}
            />

            <img
              src={caret}
              className={`absolute right-3 h-5 w-5  top-1/2 transform -translate-y-1/2 pointer-events-none ${selectedGender.length > 0 && 'hidden'}`}
              alt="caret"
            />
             </div>


              { selectedGender.length > 0 && (
                  <div className="border p-2 rounded-md">
                        <p className='pt-1 ml-1'> Gender</p>
                  {selectedGender.map((gender: any) => (
                    <span
                      key={gender}
                      className="inline-block bg-gray-200 rounded-lg px-3 py-2 my-2 text-xs font-semibold text-gray-700 mr-2"
                    >
                      {gender}
                      <img
                        src={blueclose}
                        alt="close"
                        className="inline-block ml-2 cursor-pointer"
                        onClick={() => removeGender(gender)}
                      />
                    </span>
                  ))}
                    <img onClick={openGenderModal} src={add}  width={30} height={30} className='inline-block ml-2 cursor-pointer'/>
                </div>
    
              )}
   {error.Gender && <p className="text-red-500 text-xs  ml-1 ">{error.Gender}</p>}
          


            <div onClick={prevStep} className="text-white py-1 cursor-pointer my-3 bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2.5 text-center">
            <img src={back} className='inline-block h-3 w-3 mr-1' /> Back
            </div>

            <button
             onClick={handleSubmit}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
           
              Publish
            </button>
          </form>
        </div>
      </div>

      <AgeModal isOpen={ageModal} onClose={closeAgeModal} onSelectAge={handleSelectAge} />
      <OccupationModal isOpen={occupationModal} onClose={closeOccupationModal} onSelectOccupation={handleOccupation} />
      <RegionModal isOpen={regionModal} onClose={closeRegionModal} onSelectRegion={handleRegion} />
    <GenderModal isOpen={genderModal} onClose={closeGenderModal} onSelectGender={handleGender}/>
    </>
  );
};

export default Step2;
