"use client"

import { useEffect, useState } from "react"
import link from "../svg/link.svg"
import { baseURL } from "../URL"
import usePost from "../Hooks/usePost"
import Navbar from "../NavBar/Navbar"
import { useParams } from "react-router-dom"
import danger from "../svg/danger.svg"
import Initials from "../Initials"
import RequestPointsModal from "./RequestPointsModal"
import SuccessModal from "./SuccessModal"
 
const ViewSharedDetails = ({ item }: any) => {
  const { uid } = useParams()
  const [allData, setAllData] = useState<any>({})
  const onSuccess = () => {}
  const onError = () => {}

  const campaignURL = `${baseURL}/Campaign/SharedCampaignDetails?CampaignId=${uid}`

  // Replace the useFetch hook with these state variables
  const [campaignData, setCampaignData] = useState<any>()
  const [DataError, setDataError] = useState(null)
  const [DataLoading, setDataLoading] = useState(false)

  // Modal states
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Add this function to fetch campaign data
  const fetchCampaignData = async () => {
    setDataLoading(true)

    try {
      const response = await fetch(campaignURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ campaignId: uid }), // Add any required parameters
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      if (responseData) {
        setCampaignData(responseData.data || responseData)
      }
    } catch (err: any) {
      console.error("Error fetching campaign data:", err)
      setDataError(err)
    } finally {
      setDataLoading(false)
    }
  }

  // Add this useEffect to call the fetch function
  useEffect(() => {
    if (uid) {
      fetchCampaignData()
    }
  }, [uid])
 
  function formatDate(timestamp: string) {
    const dateObj = new Date(timestamp)
    const options: any = { year: "numeric", month: "long", day: "numeric" }
    return dateObj.toLocaleDateString("en-GB", options)
  }

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  // Handle successful form submission
  const handleRequestSuccess = () => {
    setShowRequestModal(false)
    setShowSuccessModal(true)
  }

  // Close all modals
  const closeAllModals = () => {
    setShowRequestModal(false)
    setShowSuccessModal(false)
  }

  return (
    <>
      <Navbar />

      {DataLoading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-colorBlue"></div>
        </div>
      )}

      {!DataLoading && (!campaignData || DataError) && (
        <div className="flex justify-center items-center pb-20 px-10 h-screen">
          <div className="text-center p-6 bg-white rounded-lg shadow-md mb-20">
            <h2 className="text-2xl font-bold text-customBlue mb-4">Campaign Not Found</h2>
            <p className="text-gray-600 mb-4">
              The campaign you are looking for might have been removed or is currently unavailable.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => window.history.back()}
                className="bg-customBlue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {campaignData && (
        <>
          <div className="sm:bg-gray-100 bg-white h-screen mt-20">
            <div className="flex flex-col sm:bg-gray-100 bg-white justify-center items-center">
              <div className="p-4 max-w-lg border-gray-700 bg-white rounded-lg my-5 mx-0 sm:mx-1 mb-20">
                <div className="my-4">
                  <img
                    className="rounded-2xl w-full"
                    src={campaignData?.campaignImage || "/placeholder.svg"}
                    alt="Campaign Media"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="inline-block z-1 mr-3">
                      {campaignData?.campaignOwnerImage ? (
                        <img
                          className="rounded-full border-2 w-10 h-10 border-white"
                          style={{ boxShadow: "0 0 0 1px #0D236E" }}
                          src={campaignData?.campaignOwnerImage || "/placeholder.svg"}
                          alt=""
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-blue-100 rounded-full text-customBlue p-2">
                          <Initials fullName={item?.campaignOwner} className="text-lg font-medium" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{campaignData?.campaignOwner}</div>
                      <div className="text-xs">
                        <i>{campaignData?.campaignOwnerTitle}</i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-4 campaign-container min-w-[300px] max-w-[648px]">
                  <h1 className="font-medium">{campaignData?.campaignTitle}</h1>
                  <p className="flex my-2 text-customBlue font-medium text-justify">
                    <img src={link || "/placeholder.svg"} alt="Link" />
                    <a href={campaignData?.campaignUrl}>
                      <span className="px-1">{campaignData?.campaignUrl}</span>{" "}
                    </a>
                  </p>

                  <div className="text-justify my-2 pb-3 description-container">
                    <div style={{ whiteSpace: "pre-line" }}>{campaignData?.description}</div>
                  </div>

                  <div className="text-xs text-gray-700 my-2"> 
                    <div>
                      <span>Shared Date: {formatDate(campaignData?.sharedDate)}</span> 
                    </div>
                    <div> 
                      <span>Points Earned: {campaignData.pointEarned}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button 
                      onClick={() => setShowRequestModal(true)}
                      className="w-full bg-customBlue text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Request Points 
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal components */}
      {showRequestModal && (
        <RequestPointsModal 
          onClose={closeAllModals} 
          onSuccess={handleRequestSuccess}
          campaignId={uid || ""}
        />
      )}
      
      {showSuccessModal && (
        <SuccessModal onClose={closeAllModals} />
      )}
    </>
  )
}

export default ViewSharedDetails