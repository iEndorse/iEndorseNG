"use client"

import type React from "react"
import { useState } from "react"
import closeIcon from "../../svg/close.svg"
import { Backdrop, CircularProgress } from "@mui/material"

interface GenderModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectGender: (gender: string | string[]) => void
  cachedGenderData: string[]
}

const GenderModal: React.FC<GenderModalProps> = ({ isOpen, onClose, onSelectGender, cachedGenderData }) => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true)
  const [loading, setLoading] = useState(false)

  // Use cached gender data instead of fetching
  const Genders = cachedGenderData || []

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const selectGender = (gender: string | string[]) => {
    onSelectGender(gender)
    resetModal()
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const resetModal = () => {
    // Reset modal states to initial values
    setSearchQuery("")
    setIsDropdownOpen(true)
    onClose()
  }

  const filteredGenders = Genders.filter((gender: string) => gender.toLowerCase().includes(searchQuery.toLowerCase()))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="relative p-4 w-full max-w-md">
        <div className="flex justify-center p-4">
          <span className="cursor-pointer text-black text-3xl font-semibold" onClick={resetModal}>
            <img src={closeIcon || "/placeholder.svg"} alt="Close" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow overflow-hidden pb-10">
          <div className="p-4">
            <div className="flex justify-center mt-8 mb-3">
              <div className="w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search Gender..."
                  className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 mb-2 text-md"
                />
                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-left text-xs"
                  onClick={toggleDropdown}
                >
                  {searchQuery || "Select Gender"}
                </button>
                {isDropdownOpen && (
                  <ul className="z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-20 overflow-y-auto text-xs scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {filteredGenders.length > 0 ? (
                      filteredGenders.map((gender: string, index: number) => (
                        <li
                          key={index}
                          className="cursor-pointer px-2 py-1 hover:bg-gray-100 text-xs"
                          onClick={() => selectGender(gender)}
                        >
                          {gender}
                        </li>
                      ))
                    ) : (
                      <li className="px-2 py-1 text-gray-500">No Genders found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="selectAllGenders"
                className="w-4 h-4 text-blue-500 border-gray-300 text-md rounded focus:ring-blue-400"
                onChange={(e) => {
                  if (e.target.checked) {
                    selectGender(Genders) // Select all genders
                  } else {
                    resetModal() // Clear the modal if unchecked
                  }
                }}
              />
              <label htmlFor="selectAllGenders" className="text-xs text-gray-700">
                Select All Genders
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenderModal
