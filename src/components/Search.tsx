"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Puff } from "react-loader-spinner"
import { toast } from "react-toastify"
import Navbar from "./NavBar/Navbar"
import searchIcon from "./svg/search.svg"
import closeIcon from "./svg/close.svg"
import { baseURL } from "./URL"
import Initials from "./Initials"

// Function to hash the ID (implement your actual hashing logic)
const hashId = (id: string): string => {
  // Example simple encoding - replace with your actual hashing algorithm
  return btoa(id)
}

const Search = () => {
  const navigate = useNavigate()
  const [isCampaigns, setIsCampaigns] = useState(true)
  const [loading, setLoading] = useState(false)
  const [infiniteLoading, setInfiniteLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [formError, setFormError] = useState<string>("")
  const [searchMode, setSearchMode] = useState(false)
  const [apiData, setApiData] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalRecords, setTotalRecords] = useState<number>(0)

  const discoverURL = `${baseURL}/Campaign/DiscoverCampaign?pageNumber=${page}&pageSize=10`
  const searchURL = `${baseURL}/Campaign/SearchCampaign?pageNumber=${page}&pageSize=2&searchTerm=${searchQuery}`

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setFormError("")
  }

  const loadDefaultData = async () => {
    setSearchMode(false)
    setLoading(true)
    try {
      const response = await fetch(discoverURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const responseData = await response.json()
      setTotalRecords(responseData.totalRecords)
      setApiData(responseData?.data || [])
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!searchQuery.trim()) {
      setFormError("Please enter a search term")
      return
    }
    setSearchMode(true)
    setLoading(true)
    setPage(1) // Reset page to first page on new search

    try {
      const response = await fetch(searchURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const responseData = await response.json()
      setApiData(responseData?.data || [])
      setTotalRecords(responseData.totalRecords || 0)
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setPage(1)
    setSearchMode(false)
    setSearchQuery("")
    loadDefaultData()
  }

  useEffect(() => {
    loadDefaultData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setInfiniteLoading(true)
      try {
        const response = await fetch(searchMode ? searchURL : discoverURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const responseData = await response.json()
        setTotalRecords(responseData.totalRecords)
        setApiData((prev) => [...prev, ...(responseData?.data || [])])
      } catch (err) {
        toast.error((err as Error).message)
      } finally {
        setInfiniteLoading(false)
      }
    }

    if (page > 1) fetchData()
  }, [page, searchMode, searchURL, discoverURL])

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

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 mb-4 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {searchMode ? (
        <p className="text-lg text-center">
          No results found for "{searchQuery}".
          <br />
          Try a different search term or explore existing campaigns.
        </p>
      ) : (
        <p className="text-lg text-center">No campaigns available at the moment.</p>
      )}
    </div>
  )

  // Handle navigation to campaign view
  const handleCampaignClick = (campaignId: string, e: React.MouseEvent) => {
    e.preventDefault()
    navigate(`/ViewCampaign/${campaignId}`)
  }

  // Handle navigation to user profile - now using URL params with hashed ID 

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex justify-center mt-20 mb-3 mx-3">
        <div className="relative sm:w-1/2 mt-20">
          <form onSubmit={handleSubmit} className="">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className={`w-full bg-white border ${formError ? "border-red-500" : "border-gray-300"} rounded-lg p-2 pl-10`}
              placeholder="Search"
            />
            <img
              src={searchIcon || "/placeholder.svg"}
              onClick={handleSubmit}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              width={16}
              height={16}
              alt="Search"
            />
            {searchQuery && (
              <img
                src={closeIcon || "/placeholder.svg"}
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                width={16}
                height={16}
                alt="Clear"
              />
            )}
          </form>
        </div>
      </div>
      {formError && <div className="text-red-500 flex justify-center ">{formError}</div>}

      <div className="flex justify-center mt-8 mb-10 mx-3">
        <div className="flex text-sm justify-center mb-3 bg-white rounded-lg py-2 px-10">
          <button
            className={`px-6 py-2 ${isCampaigns ? "bg-customBlue text-white" : "bg-white text-gray-800"} rounded-md w-full`}
            onClick={() => setIsCampaigns(true)}
          >
            Campaigns
          </button>
          {/* <button
                            className={`px-6 py-2 ${!isCampaigns ? 'bg-customBlue text-white' : 'bg-white text-gray-800'} rounded-md w-full`}
                            onClick={() => setIsCampaigns(false)}
                        >
                            Accounts
                        </button> */}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : isCampaigns ? (
        apiData.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-4 sm:mx-32 mx-10">
            {apiData.map((item: any, index: number) => {
              // Safety check for campaignFiles
              const campaignImageUrl =
                item?.campaignFiles && item.campaignFiles.length > 0 ? item.campaignFiles[0].filePath : null

              return (
                <div
                  key={index}
                  onClick={(e) => handleCampaignClick(item?.campaignId, e)}
                  className="max-w-200 mb-4 h-400 grid rounded-lg border border-gray-200 shadow cursor-pointer"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backgroundImage: campaignImageUrl ? `url(${campaignImageUrl})` : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    height: 200,
                  }}
                >
                  {!campaignImageUrl && (
                    <div className="grid p-4 flex justify-center items-center">{item?.campaignTitle}</div>
                  )}

                  <div className="grid flex items-end">
                    <div
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(242, 242, 242, 0.00) 0%, rgba(242, 242, 242, 0.08) 14.58%, rgba(242, 242, 242, 0.78) 50%, #F2F2F2 70.83%, #F2F2F2 83.33%, #F2F2F2 100%)`,
                      }}
                    >
                      <div className="flex items-center justify-start pr-4 pl-2 pt-8 mb-4">
                        <div
                          className="mr-1 rounded-full cursor-pointer mx-1"
                          onClick={(e) => alert(item?.accountId)}
                        >
                          {item?.campaignOwnerImage ? (
                            <img
                              src={item?.campaignOwnerImage || "/placeholder.svg"}
                              className="w-8 h-8 rounded-full"
                              alt=""
                            />
                          ) : (
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-customBlue p-2">
                              <Initials fullName={item?.campaignOwner} className="text-xs" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div
                           
                            className="font-semibold cursor-pointer text-xs"
                            style={{ fontSize: "10px" }}
                          >
                            {item?.campaignOwner}
                          </div>

                          <div className="text-xs mt-0" style={{ fontSize: "7px" }}>
                            <i>{item?.campaignOwnerTitle}</i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {infiniteLoading && (
              <div className="flex justify-center items-center">
                <Puff visible={true} height="30" width="30" color="#0D236E" ariaLabel="puff-loading" />
              </div>
            )}
          </div>
        )
      ) : (
        <div className="flex justify-center">
          <div className="bg-white p-10 w-full mx-1 sm:w-3/4 rounded-md mb-10">
            {/* Accounts section remains the same */}
            <div className="flex items-center justify-between my-8 mx-1">
              <div className="flex">
                <div className="mr-4 rounded-full mx-1">
                  <img src="/images/Avatar.png" width={45} height={45} alt="Avatar" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Poster</div>
                  <div className="text-xs">
                    <span>Human Right Activist</span>
                  </div>
                </div>
              </div>
              <div className="p-1 cursor-pointer">
                <img alt="Report" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search
