"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AgeModal from "./Modals/AgeModal"
import { toast } from "react-toastify"
import blueclose from "../svg/blueclose.svg"
import caret from "../svg/caret.svg"
import add from "../svg/add.svg"
import OccupationModal from "./Modals/OccupationModal"
import RegionModal from "./Modals/RegionModal"
import GenderModal from "./Modals/GenderModal"
import back from "../svg/back.svg"
import { baseURL } from "../URL"
import useFetch from "../Hooks/useFetch"
import { Backdrop, CircularProgress } from "@mui/material"

const Step2 = ({ prevStep, handleFileChange, handleFieldChange, handleTagChange, formData }: any) => {
  const navigate = useNavigate()
  const [createLoading, setCreateLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [ageModal, setAgeModal] = useState(false)
  const [occupationModal, setOccupationModal] = useState(false)
  const [regionModal, setRegionModal] = useState(false)
  const [genderModal, setGenderModal] = useState(false)
  const [selectedAges, setSelectedAges] = useState<any[]>(formData.Age || [])
  const [selectedOccupation, setSelectedOccupation] = useState<any[]>(formData.Occupation || [])
  const [selectedRegion, setSelectedRegion] = useState<any[]>(formData.Region || [])
  const [selectedGender, setSelectedGender] = useState<any[]>(formData.Gender || [])
  const [error, setError] = useState<{ [key: string]: string }>({})
  const openAgeModal = () => setAgeModal(true)
  const closeAgeModal = () => setAgeModal(false)
  const openOccupationModal = () => setOccupationModal(true)
  const closeOccupationModal = () => setOccupationModal(false)
  const openRegionModal = () => setRegionModal(true)
  const closeRegionModal = () => setRegionModal(false)
  const openGenderModal = () => setGenderModal(true)
  const closeGenderModal = () => setGenderModal(false)

  const url = `${baseURL}/CampaignTargetAudience/GetAll`
  const onSuccess = () => {}
  const onError = () => {}
  const {
    data: apiData,
    refreshApi: refresh,
    error: Error,
    loading: AudienceLoading,
  } = useFetch(url, "GET", onSuccess, onError)
  const Genders = apiData && apiData.length > 0 ? apiData[7].values : []

  const GenderId = apiData ? apiData[7].id : 0
  const RegionId = apiData ? apiData[8].id : 0
  const OccupationId = apiData ? apiData[7].id : 0
  const AgeId = apiData ? apiData[6].id : 0
  console.log("ids: ", GenderId, RegionId, OccupationId, AgeId)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setCreateLoading(true)

    // Validate required fields
    let isValid = true
    const validationErrors: { [key: string]: string } = {}

    if (formData.Age.length === 0) {
      validationErrors.Age = "Please select an age group."
      isValid = false
    }
    if (formData.Gender.length === 0) {
      validationErrors.Gender = "Please select a gender."
      isValid = false
    }

    if (formData.Occupation.length === 0) {
      validationErrors.Occupation = "Please select an Occupation."
      isValid = false
    }
    if (formData.Region.length === 0) {
      validationErrors.Region = "Please select a region."
      isValid = false
    }

    // If any validation fails, show errors and stop the submission
    if (!isValid) {
      setError(validationErrors)
      setCreateLoading(false)
      return
    }

    const transformedData = {
      categoryId: formData.CampaignCategory || 0, // Default to 0 if undefined
      campaignTitle: formData.CampaignTitle || "string", // Default placeholder
      campaignLink: formData.CampaignLink || "string", // Default placeholder
      description: formData.Description || "string", // Default placeholder
      tags: formData?.tags?.map((tag: any) => tag.id) || [0], // Default to [0] if undefined or empty
      campaignMedias:
        formData.campaignMedias?.map((media: any) => ({
          fileExtension: media.fileExtension || "unknown",
          campaignMedia: typeof media.campaignMedia === "string" ? media.campaignMedia : "", // Ensure it's a string
        })) || [], // Default placeholder if undefined or empty
      campaignTargetAudienceAnswers: [
        {
          id: AgeId,
          answer: formData.Age,
        },
        {
          id: OccupationId, // Assuming 2 is for Occupation
          answer: formData.Occupation,
        },
        {
          id: RegionId, // Assuming 3 is for Region
          answer: formData.Region,
        },
        {
          id: GenderId, // Assuming 4 is for Gender
          answer: formData.Gender,
        },
      ],
      campaignUnit: 10, // If campaignUnit is a fixed value or needs to be derived
    }

    console.log("Transformed data:", transformedData)
    console.log("Payload being sent:", JSON.stringify(transformedData)) // Log full request payload

    const apiUrl = `${baseURL}/Campaign/CreateCampaignV4`
    const facebookApiUrl = `http://50.16.151.222:4000/upload-photoV1`
    setCreateLoading(true) // Show loading indicator

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`, // Include auth token
        },
        body: JSON.stringify(transformedData), // Send the transformed data
      })

      const data = await response.json() // Parse response

      console.log("Response received:", data) // Log API response for debugging

      if (response.ok && data.succeeded) {
      toast.success("Successfully created campaign")
        
        // Add a delay before navigating to the next page
        setTimeout(() => {
              navigate(`/Feed/`) // Navigate to /ViewCampaign",) 
        }, 2000)
  
      } 
    } catch (error) {
      console.error("Error creating campaign:", error) // Log the error for debugging
      toast.error("An error occurred while creating the campaign")
    } finally {
      //  sendToFacebook();
      // sendVideoToFacebook();
      setCreateLoading(false); // Hide loading indicator
    }
  }

  const categories = [
    "Education",
    "Church",
    "Politics",
    "Gaming",
    "Sports",
    "Music",
    "Health & Fitness",
    "Travel",
    "Cooking",
    "Art & Craft",
  ]

  const sendToFacebook = async () => {
    setCreateLoading(true) // Show loading indicator

    const apiUrl = `http://50.16.151.222:4000/upload-photoV1`

    if (!formData.rawPhotos || formData.rawPhotos.length === 0) {
      console.log("No file selected for upload.")
      setCreateLoading(false)
      return
    }

    const formDataPayload = new FormData()
    formDataPayload.append("campaignTitle", formData.CampaignTitle)
    formDataPayload.append("photo", formData.rawPhotos[0])
    formDataPayload.append("description", formData.Description)
    formDataPayload.append("campaignLink", formData.CampaignLink)
    formDataPayload.append("campaignTargetAudienceAnswer", "#" + categories[formData.CampaignCategory - 1])
    console.log("Payload being sent:", formDataPayload) // Log full request payload

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formDataPayload, // Send FormData
      })

      const data = await response.json() // Parse response

      console.log("Response received:", data) // Log API response for debugging

      if (response.ok && data.succeeded) {
        console.log("Successfully uploaded campaign media to Facebook")
        //   toast.success("Successfully uploaded campaign media to Facebook");
      } else {
        // toast.error(data.message || "An error occurred while uploading campaign media to Facebook");
      }
    } catch (error) {
      console.error("Facebook upload error:", error) // Log the error for debugging
      // toast.error("An error occurred while uploading campaign media to Facebook");
    } finally {
      setCreateLoading(false) // Hide loading indicator
    }
  }

  const sendVideoToFacebook = async () => {
    setCreateLoading(true) // Show loading indicator
    console.log("Video data:", formData.rawVideos)
    const apiUrl = `http://50.16.151.222:4000/upload-videoV1`

    if (!formData.rawVideos || formData.rawVideos.length === 0) {
      console.log("No video available for upload.")
      setCreateLoading(false)
      return
    }

    const formDataPayload = new FormData()
    formDataPayload.append("campaignTitle", formData.CampaignTitle)
    formDataPayload.append("video", formData.rawVideos[0])
    formDataPayload.append("description", formData.Description)
    formDataPayload.append("campaignLink", formData.CampaignLink)
    formDataPayload.append("campaignTargetAudienceAnswer", "#" + categories[formData.CampaignCategory - 1])

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formDataPayload, // Send FormData
      })

      const data = await response.json() // Parse response

      console.log("Response received:", data) // Log API response for debugging

      if (response.ok && data.succeeded) {
        console.log("Successfully uploaded campaign video to Facebook")
      } else {
        console.log(data.message || "An error occurred while uploading campaign media to Facebook")
      }
    } catch (error) {
      console.error("Facebook upload error:", error) // Log the error for debugging
      toast.error("An error occurred while uploading campaign video to Facebook")
    } finally {
      setCreateLoading(false) // Hide loading indicator
    }
  }

  const handleSelectAge = (ages: string | string[]) => {
    const newAges = Array.isArray(ages) ? ages : [ages]

    const filteredAges = newAges.filter((age) => !selectedAges.includes(age))
    if (filteredAges.length > 0) {
      setSelectedAges([...selectedAges, ...filteredAges])
    } else if (!Array.isArray(ages)) {
      // toast.error(`You have already selected the age range ${ages}.`);
    }
  }

  const handleOccupation = (occupations: string[]) => {
    // Filter out any duplicates
    const newOccupations = occupations.filter((occupation) => !selectedOccupation.includes(occupation))

    if (newOccupations.length > 0) {
      // Add unique occupations to the state
      setSelectedOccupation([...selectedOccupation, ...newOccupations])
      handleFieldChange("Occupation")([...selectedOccupation, ...newOccupations])
    } else {
      //  toast.error("All selected occupations are already included.");
    }
  }

  const handleRegion = (region: any) => {
    if (Array.isArray(region)) {
      // Handle "Select All" case
      const newRegions = region.filter((r) => !selectedRegion.includes(r))
      if (newRegions.length > 0) {
        setSelectedRegion([...selectedRegion, ...newRegions])
        // toast.success(`All regions have been selected.`);
      } else {
        //  toast.error(`All regions are already selected.`);
      }
    } else {
      // Handle single region
      if (!selectedRegion.includes(region)) {
        setSelectedRegion([...selectedRegion, region])
        // toast.success(`Region ${region} has been added.`);
      } else {
        //    toast.error(`You have already selected the region ${region}.`);
      }
    }
  }

  const handleGender = (gender: any | any[]) => {
    if (Array.isArray(gender)) {
      // Handle multiple selections (e.g., "Select All")
      const newGenders = gender.filter((g) => !selectedGender.includes(g))
      setSelectedGender([...selectedGender, ...newGenders])
    } else {
      if (!selectedGender.includes(gender)) {
        setSelectedGender([...selectedGender, gender])
      } else {
        //  toast.error(`You have already selected the gender ${gender}.`);
      }
    }
  }

  const removeAge = (age: string) => {
    setSelectedAges((prev) => prev.filter((a) => a !== age))
  }

  const removeOccupation = (occupation: any) => {
    setSelectedOccupation(selectedOccupation.filter((selectedOccupation) => selectedOccupation !== occupation))
  }

  const removeRegion = (region: any) => {
    setSelectedRegion(selectedRegion.filter((selectedRegion) => selectedRegion !== region))
  }

  const removeGender = (gender: any) => {
    setSelectedGender(selectedGender.filter((selectedGender) => selectedGender !== gender))
  }

  useEffect(() => {
    handleFieldChange("Age")(selectedAges)
  }, [selectedAges])

  useEffect(() => {
    handleFieldChange("Occupation")(selectedOccupation)
  }, [selectedOccupation])

  useEffect(() => {
    handleFieldChange("Region")(selectedRegion)
  }, [selectedRegion])

  useEffect(() => {
    handleFieldChange("Gender")(selectedGender)
  }, [selectedGender])

  return (
    <>
      <div className="flex bg-gray-100 justify-center text-xs ">
        <Backdrop sx={{ color: "#0000d3", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={AudienceLoading}>
          <div className="flex justify-center items-center ">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-500"></div>
          </div>
        </Backdrop>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={createLoading}>
          <div className="flex flex-col items-center justify-center">
            <CircularProgress color="inherit" />
            <p className="mt-4 text-white font-medium">creating your campaign</p>
          </div>
        </Backdrop>
        <div className="bg-white p-5  mb-10 mt-36  mx-5 rounded-lg max-w-md h-auto my-10">
          <div className="flex items-center justify-center mb-5">
            <div className="flex-1 border-1 border-t border-gray-300"></div>
            <div className="flex-1 border-2 border-t border-customBlue"></div>
          </div>
          <img src="./images/frame1.png" alt="frame1" className="mx-auto" />

          <div className="text-center p-3">
            <h1 className="font-bold">Target Audience</h1>
            <p>Ensure your campaign gets the views and reach it needs</p>
          </div>

          <form className="space-y-4 mt-4">
            <div className="relative">
              <input
                placeholder="Age"
                name="Age"
                onChange={handleFieldChange("Age")}
                value={formData.Age}
                onClick={openAgeModal}
                className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 cursor-pointer ${selectedAges.length > 0 && "hidden"}`}
              />

              <img
                src={caret || "/placeholder.svg"}
                className={`absolute right-3 h-5 w-5  top-1/2 transform -translate-y-1/2 pointer-events-none ${selectedAges.length > 0 && "hidden"}`}
                alt="caret"
              />
            </div>
            {error.Age && <p className="text-red-500 text-xs  ml-1 ">{error.Age}</p>}
            {selectedAges.length > 0 && (
              <div className="border p-2 rounded-md">
                <p className="pt-1 ml-1"> Age</p>
                {selectedAges.map((age: any) => (
                  <span
                    key={age}
                    className="inline-block bg-gray-200 rounded-lg px-3 py-2 my-2 text-xs font-semibold text-gray-700 mr-2"
                  >
                    {age}
                    <img
                      src={blueclose || "/placeholder.svg"}
                      alt="close"
                      className="inline-block ml-2 cursor-pointer"
                      onClick={() => removeAge(age)}
                    />
                  </span>
                ))}
                <img
                  onClick={openAgeModal}
                  src={add || "/placeholder.svg"}
                  width={30}
                  height={30}
                  className="inline-block ml-2 cursor-pointer"
                />
              </div>
            )}

            <div className="relative">
              <input
                placeholder="Occupation"
                name="Occupation"
                onChange={handleFieldChange("Occupation")}
                value={formData.occupation}
                onClick={openOccupationModal}
                className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 cursor-pointer ${selectedOccupation.length > 0 && "hidden"}`}
              />

              <img
                src={caret || "/placeholder.svg"}
                className={`absolute right-3 h-5 w-5  top-1/2 transform -translate-y-1/2 pointer-events-none ${selectedOccupation.length > 0 && "hidden"}`}
                alt="caret"
              />
            </div>

            {selectedOccupation.length > 0 && (
              <div className="border p-2 rounded-md">
                <p className="pt-1 ml-1"> Occupation</p>
                {selectedOccupation.map((occupation: any) => (
                  <span
                    key={occupation}
                    className="inline-block bg-gray-200 rounded-lg px-3 py-2 my-2 text-xs font-semibold text-gray-700 mr-2"
                  >
                    {occupation}
                    <img
                      src={blueclose || "/placeholder.svg"}
                      alt="close"
                      className="inline-block ml-2 cursor-pointer"
                      onClick={() => removeOccupation(occupation)}
                    />
                  </span>
                ))}
                <img
                  onClick={openOccupationModal}
                  src={add || "/placeholder.svg"}
                  width={30}
                  height={30}
                  className="inline-block ml-2 cursor-pointer"
                />
              </div>
            )}
            {error.Occupation && <p className="text-red-500 text-xs  ml-1 ">{error.Occupation}</p>}

            <div className="relative">
              <input
                placeholder="Select Region"
                name="Region"
                onChange={handleFieldChange("Region")}
                value={formData.Region}
                onClick={openRegionModal}
                className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 cursor-pointer ${selectedRegion.length > 0 && "hidden"}`}
              />

              <img
                src={caret || "/placeholder.svg"}
                className={`absolute right-3 h-5 w-5  top-1/2 transform -translate-y-1/2 pointer-events-none ${selectedRegion.length > 0 && "hidden"}`}
                alt="caret"
              />
            </div>

            {selectedRegion.length > 0 && (
              <div className="border p-2 rounded-md">
                <p className="pt-1 ml-1"> Region</p>
                {selectedRegion.map((region: any) => (
                  <span
                    key={region}
                    className="inline-block bg-gray-200 rounded-lg px-3 py-2 my-2 text-xs font-semibold text-gray-700 mr-2"
                  >
                    {region}
                    <img
                      src={blueclose || "/placeholder.svg"}
                      alt="close"
                      className="inline-block ml-2 cursor-pointer"
                      onClick={() => removeRegion(region)}
                    />
                  </span>
                ))}
                <img
                  onClick={openRegionModal}
                  src={add || "/placeholder.svg"}
                  width={30}
                  height={30}
                  className="inline-block ml-2 cursor-pointer"
                />
              </div>
            )}

            {error.Region && <p className="text-red-500 text-xs  ml-1 ">{error.Region}</p>}

            <div className="relative">
              <input
                placeholder="Select Gender"
                name="Gender"
                onChange={handleFieldChange("Gender")}
                value={formData.Gender}
                onClick={openGenderModal}
                className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 cursor-pointer ${selectedGender.length > 0 && "hidden"}`}
              />

              <img
                src={caret || "/placeholder.svg"}
                className={`absolute right-3 h-5 w-5  top-1/2 transform -translate-y-1/2 pointer-events-none ${selectedGender.length > 0 && "hidden"}`}
                alt="caret"
              />
            </div>

            {selectedGender.length > 0 && (
              <div className="border p-2 rounded-md">
                <p className="pt-1 ml-1"> Gender</p>
                {selectedGender.map((gender: any) => (
                  <span
                    key={gender}
                    className="inline-block bg-gray-200 rounded-lg px-3 py-2 my-2 text-xs font-semibold text-gray-700 mr-2"
                  >
                    {gender}
                    <img
                      src={blueclose || "/placeholder.svg"}
                      alt="close"
                      className="inline-block ml-2 cursor-pointer"
                      onClick={() => removeGender(gender)}
                    />
                  </span>
                ))}
                <img
                  onClick={openGenderModal}
                  src={add || "/placeholder.svg"}
                  width={30}
                  height={30}
                  className="inline-block ml-2 cursor-pointer"
                />
              </div>
            )}
            {error.Gender && <p className="text-red-500 text-xs  ml-1 ">{error.Gender}</p>}

            <div
              onClick={prevStep}
              className="text-white py-1 cursor-pointer my-3 bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2.5 text-center"
            >
              <img src={back || "/placeholder.svg"} className="inline-block h-3 w-3 mr-1" /> Back
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
      <GenderModal isOpen={genderModal} onClose={closeGenderModal} onSelectGender={handleGender} />
    </>
  )
}

export default Step2

