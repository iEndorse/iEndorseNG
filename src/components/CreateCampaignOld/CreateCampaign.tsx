"use client"

import { useEffect, useState } from "react"
import Navbar from "../NavBar/Navbar"
import Step1 from "./Step1"
import Step2 from "./Step2"
import useFetch from "../Hooks/useFetch"
import { baseURL } from "../URL"

const CreateCampaign = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [cachedData, setCachedData] = useState({
    targetAudience: null,
    accounts: null,
    categories: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch target audience data (for Age, Gender, Region, Occupation)
  const audienceUrl = `${baseURL}/CampaignTargetAudience/GetAll`
  const { data: audienceData, loading: audienceLoading } = useFetch(
    audienceUrl,
    "GET",
    () => {},
    () => {},
  )

  // Fetch accounts data (for People modal)
  const accountsUrl = `${baseURL}/Account/GetAccounts`
  const { data: accountsData, loading: accountsLoading } = useFetch(
    accountsUrl,
    "GET",
    () => {},
    () => {},
  )

  // Fetch categories data
  const categoriesUrl = `${baseURL}/Category/GetCategories/`
  const { data: categoriesData, loading: categoriesLoading } = useFetch(
    categoriesUrl,
    "GET",
    () => {},
    () => {},
  )

  // Cache all data once it's loaded
  useEffect(() => {
    if (audienceData && accountsData && categoriesData) {
      setCachedData({
        targetAudience: audienceData,
        accounts: accountsData,
        categories: categoriesData,
      })
      setIsLoading(false)
    }
  }, [audienceData, accountsData, categoriesData])

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleFieldChange = (fieldName: string) => (e: any) => {
    const value = Array.isArray(e) ? e : e?.target?.value // Check if the value is an array or from an event object
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }))
  }

  const handleTagChange = (fieldName: string) => (e: any) => {
    const value = Array.isArray(e) ? e : e?.target?.value // Check if the value is an array or from an event object
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }))
  }

  const handleFileChange = (fieldName: string) => (files: { fileExtension: string; campaignMedia: string }[]) => {
    setFormData({
      ...formData,
      [fieldName]: files,
    })
  }

  const handleRawFileChange = (fieldName: string) => (files: File[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: files,
    }))
  }

  useEffect(() => {
    console.log("FORMData>>>>>>>>>>>>>", formData)
  }, [formData])

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            nextStep={nextStep}
            handleFieldChange={handleFieldChange}
            handleTagChange={handleFieldChange}
            handleFileChange={handleFileChange}
            handleRawFileChange={handleRawFileChange}
            formData={formData}
            cachedData={cachedData}
            isLoading={isLoading || categoriesLoading || accountsLoading}
          />
        )

      case 2:
        return (
          <Step2
            prevStep={prevStep}
            handleFieldChange={handleFieldChange}
            handleTagChange={handleFieldChange}
            formData={formData}
            cachedData={cachedData}
            isLoading={isLoading || audienceLoading}
          />
        )
      default:
        return <div>Form Complete</div>
    }
  }

  return (
    <div className="bg-gray-100 h-screen">
      <Navbar />
      {renderStep()}
    </div>
  )
}

export default CreateCampaign
