"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../NavBar/Navbar"
import { baseURL } from "../URL"
import { toast } from "sonner"
import { Puff } from "react-loader-spinner"



const UserProfile = () => {

const userId = useParams().userId
 console.log("userId", userId)


  const userDataFromStorage: any = window.localStorage.getItem("userData")
  const parsedUserData = JSON.parse(userDataFromStorage)
  const [copied, setCopied] = useState(false)
  const [userData, setUserData] = useState<any>([])
  const token = parsedUserData.token
  const [loading, setLoading] = useState(false)
  const [infiniteLoading, setInfiniteLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [formError, setFormError] = useState<string>("")
  const [searchMode, setSearchMode] = useState(false)
  const [apiData, setApiData] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [editModal, setEditModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState("")
  const navigate = useNavigate()

  useEffect(() => {

    // No need to store in sessionStorage since it's in the URL now
    window.scrollTo(0, 0)
    loadDefaultData()
  }, [userId, navigate])

  const url = `${baseURL}/Campaign/UserCampaigns?AccountId=${userId}&pageNumber=${page}&pageSize=10` 

  const loadDefaultData = async () => {
    //if (!userId) return // Guard clause to prevent fetch without userId

    setSearchMode(false)
    setLoading(true)
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const responseData = await response.json()
      console.log("total records", responseData.totalRecords)
      setTotalRecords(responseData.totalRecords)
      setUserData(responseData?.data)
      setApiData(responseData?.data?.pagedResults || [])
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadmoredata = async () => {
      if (!userId) return // Guard clause

      setInfiniteLoading(true)
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const responseData = await response.json()
        setTotalRecords(responseData.totalRecords)
        setApiData((prev) => [...prev, ...(responseData?.data?.pagedResults || [])])
      } catch (err) {
        toast.error((err as Error).message)
      } finally {
        setInfiniteLoading(false)
      }
    }

    if (page > 1 && userId) loadmoredata()
  }, [page, userId, url])

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
      if (totalRecords > apiData.length) {
        setPage((prev) => prev + 1)
      }
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [apiData])

  const getInitials = (fullName: string) => {
    if (!fullName) return ""
    const names = fullName.split(" ")
    const initials = names.map((name) => name[0]).join("")
    return initials.toUpperCase()
  }

  const submitNewProfile = () => {
    console.log("submit new profile")
  }

  setTimeout(() => {
    setCopied(false)
  }, 2000)

  // Handle navigation to campaign view
  const handleCampaignClick = (campaignId: string, e: React.MouseEvent) => {
    e.preventDefault()
    navigate(`/ViewCampaign/${campaignId}`)
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="bg-gray-100 px-10 pt-10 mb-20 mt-16">
          <div className="relative mt-16 max-w-2xl mx-auto mt-32 rounded-lg">
            <div className="rounded-3xl overflow-hidden shadow-md bg-white">
              <div className="absolute -mt-32 w-full flex justify-center">
                <div className="h-36 w-36 flex items-center justify-center bg-white border-2 border-customBlue rounded-full">
                  <div className="h-32 w-32 flex items-center justify-center rounded-full">
                    {userData?.image ? (
                      <img
                        src={userData?.image || "/placeholder.svg"}
                        className="rounded-full object-cover max-h-full max-w-full shadow-md"
                        alt="Profile"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-blue-100 rounded-full text-customBlue font-bold text-3xl">
                        {getInitials(userData?.name || "")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 mt-6 pb-12">
                <h1 className="font-bold text-3xl text-center mb-1">{userData.name || "Loading..."}</h1>
                <p className="text-gray-600 text-sm text-center">{userData.title || ""}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-4 sm:mx-32 mx-10">
          {loading ? (
            // Skeleton Loading State
            <>
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="max-w-200 mb-4 h-400 grid rounded-lg border border-gray-200 shadow animate-pulse"
                >
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4 space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="flex items-center space-x-3 mt-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : apiData && apiData.length > 0 ? (
            // Campaign Data
            apiData.map((item, index) => (
              <div
                key={index}
                onClick={(e) => handleCampaignClick(item?.campaignId, e)}
                className="max-w-200 mb-4 h-400 grid rounded-lg border border-gray-200 shadow cursor-pointer"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  backgroundImage: `url(${item?.filePath})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  height: 200,
                }}
              >
                <div className="grid flex items-end">
                  <div
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(255, 255, 242, 0.00) 0%, rgba(242, 242, 242, 0.08) 14.58%, rgba(242, 242, 242, 0.78) 50%, #F2F2F2 70.83%, #F2F2F2 83.33%, #F2F2F2 100%)`,
                    }}
                  >
                    <div className="flex items-center justify-start pr-4 pl-2 pt-8 mb-2">
                      <div className="flex items-center justify-center bg-white border-2 border-customBlue rounded-full w-10 h-10 mx-1">
                        <div className="flex items-center justify-center rounded-full w-8 h-8 bg-blue-100">
                          {item?.campaignOwnerImage ? (
                            <img
                              src={item?.campaignOwnerImage || "/placeholder.svg"}
                              className="rounded-full object-cover w-full h-full"
                              alt="Avatar"
                            />
                          ) : (
                            <span className="text-customBlue font-bold text-sm">
                              {getInitials(item.campaignOwner || "")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold text-xs" style={{ fontSize: "10px" }}>
                          {item?.campaignOwner}
                        </div>
                        <div className="text-xs mt-0 truncate w-20" style={{ fontSize: "7px" }}>
                          <i>{item?.campaignOwnerTitle}</i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No Data Message
            !loading && (
              <div className="col-span-4 text-center text-gray-500">
                <p>No campaigns available at the moment.</p>
              </div>
            )
          )}

          {infiniteLoading && (
            <div className="flex justify-center items-center">
              <p>
                <Puff
                  visible={true}
                  height="30"
                  width="30"
                  color="#0D236E"
                  ariaLabel="puff-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default UserProfile
