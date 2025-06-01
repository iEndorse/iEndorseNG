"use client"

import type React from "react"
import { Search, X } from 'lucide-react';
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Puff } from "react-loader-spinner"
import { toast } from "react-toastify"
import Navbar from "../NavBar/Navbar"
import searchIcon from "./svg/search.svg"
import closeIcon from "./svg/close.svg"
import { baseURL } from "../URL"
import Initials from "../Initials"

const SharedCampaigns = () => {
  const navigate = useNavigate()
 
  const [loading, setLoading] = useState(false)
  const [infiniteLoading, setInfiniteLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [formError, setFormError] = useState<string>("")
  const [searchMode, setSearchMode] = useState(false)
  const [apiData, setApiData] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalRecords, setTotalRecords] = useState<number>(0)
 
  const url = `${baseURL}/Campaign/SharedCampaigns?Page=${page}&PageSize=10&search=${searchQuery}`

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setFormError("")
  }

  const loadDefaultData = async () => {
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
      const response = await fetch(url, {
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
  }, [searchQuery])

  useEffect(() => {
    const fetchData = async () => {
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
        setApiData((prev) => [...prev, ...(responseData?.data || [])])
      } catch (err) {
        toast.error((err as Error).message)
      } finally {
        setInfiniteLoading(false)
      }
    }

    if (page > 1) fetchData()
  }, [page])

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
    navigate(`/shared-campaign-details/${campaignId}`)
  }

  // Handle navigation to user profile
  const handleUserProfileClick = (userId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate("/userprofile", { state: { userId } })
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex justify-center mt-20 mb-3 mx-3">
        <div className="relative sm:w-1/2 mt-20">
          <h1 className="text-xl font-bold mb-4 text-gray-800 text-center">Shared Campaigns</h1>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className={`w-full bg-white border ${formError ? "border-red-500" : "border-gray-300"} rounded-lg p-3 pl-10`}
              placeholder="Search"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={16} className="text-gray-400 cursor-pointer" onClick={handleSubmit} />
            </div>
            {searchQuery && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <X size={16} className="text-gray-400 cursor-pointer" onClick={clearSearch} />
              </div>
            )}
          </form>
        </div>
      </div>
   
      {formError && <div className="text-red-500 flex justify-center ">{formError}</div>}
 
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        apiData.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-4 sm:mx-32 mx-10">
            {apiData.map((item: any, index: number) => {
              // Safety check for campaignFiles
              // const campaignImageUrl =
              //   item?.campaignFiles && item.campaignFiles.length > 0 ? item.campaignFiles[0].filePath : null

              return (
              <div
  key={index}
  onClick={(e) => handleCampaignClick(item?.campaignId, e)}
  className="max-w-200 mb-4 h-400 grid rounded-lg border border-gray-200 shadow cursor-pointer"
  style={{
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backgroundImage: item.campaignImage ? `url(${item.campaignImage})` : "none",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: 200,
  }}
>
  {!item.campaignImage && (
    <div className="grid p-4 flex justify-center items-center">{item?.campaignTitle}</div>
  )}

  <div className="grid flex items-end">
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(242, 242, 242, 0.00) 0%, rgba(242, 242, 242, 0.3) 10%, rgba(242, 242, 242, 0.6) 25%, rgba(242, 242, 242, 0.85) 40%, #F2F2F2 60%, #F2F2F2 100%)`,
        paddingTop: "30px", // Add more space at the top of the gradient
      }}
    >
      <div className="flex items-center justify-start pr-4 pl-2 pt-8 mb-4">
        <div
          className="mr-1 rounded-full cursor-pointer mx-1"
          onClick={(e) => handleUserProfileClick(item?.accountId, e)}
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
            onClick={(e) => handleUserProfileClick(item?.campaignOwnerId, e)}
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
      )}
    </div>
  )
}

export default SharedCampaigns