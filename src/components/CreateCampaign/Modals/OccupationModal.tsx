"use client"

import type React from "react"
import { useState } from "react"
import closeIcon from "../../svg/close.svg"
import { Backdrop, CircularProgress } from "@mui/material"

interface OccupationModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectOccupation: (occupation: any) => void
  cachedOccupationData: string[]
}

const OccupationModal: React.FC<OccupationModalProps> = ({
  isOpen,
  onClose,
  onSelectOccupation,
  cachedOccupationData,
}) => {
  const [selectedOccupations, setSelectedOccupations] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true)
  const [loading, setLoading] = useState(false)

  // Use cached occupation data instead of fetching
  const occupations: string[] = cachedOccupationData || []

  const handleToggleDropdown = () => setIsDropdownOpen((prev) => !prev)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSelectOccupation = (occupation: string) => {
    if (selectedOccupations.includes(occupation)) {
      setSelectedOccupations(selectedOccupations.filter((item) => item !== occupation))
    } else {
      setSelectedOccupations([...selectedOccupations, occupation])
    }
  }

  const handleSelectAll = () => {
    if (selectedOccupations.length === occupations.length) {
      setSelectedOccupations([])
    } else {
      setSelectedOccupations(occupations)
    }
  }

  const handleSave = () => {
    onSelectOccupation(selectedOccupations)
    onClose()
  }

  const handleClose = () => {
    setSelectedOccupations([])
    setSearchQuery("")
    onClose()
  }

  const filteredOccupations = occupations.filter((occupation) =>
    occupation.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const isAllSelected = selectedOccupations.length === occupations.length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-start pt-20 sm:pt-1 sm:items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={handleClose}></div>

      {/* Loading State */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Modal */}
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* Close Button */}
        <div className="flex justify-center p-2">
          <button aria-label="Close" onClick={handleClose}>
            <img src={closeIcon || "/placeholder.svg"} alt="Close" width={40} height={40} />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold text-center mb-4">Select Occupation</h2>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search Occupation..."
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 
                        text-md placeholder-gray-400 mb-3 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Dropdown */}
          <button
            type="button"
            className="w-full text-xs bg-white border border-gray-300 rounded-lg px-4 py-2 text-left"
            onClick={handleToggleDropdown}
          >
            {selectedOccupations.length > 0
              ? `${selectedOccupations.length} Occupation(s) Selected`
              : "Select Occupation"}
          </button>

          {isDropdownOpen && (
            <ul className="z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {/* Select All */}
              <li className="px-4 py-2 border-b">
                <label className="flex items-center cursor-pointer text-xs">
                  <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="mr-2 text-md" />
                  Select All
                </label>
              </li>

              {/* List Items or Loading */}
              {loading ? (
                <li className="px-4 py-2 text-gray-500">Loading occupations...</li>
              ) : filteredOccupations.length > 0 ? (
                filteredOccupations.map((occupation, index) => (
                  <li key={index} className="px-4 py-2 text-xs hover:bg-gray-100">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedOccupations.includes(occupation)}
                        onChange={() => handleSelectOccupation(occupation)}
                        className="mr-2 text-md"
                      />
                      {occupation}
                    </label>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No occupations found</li>
              )}

              {/* Buttons */}
              <div className="sticky bottom-0 bg-white p-2 border-t shadow-inner flex justify-end">
                <button
                  aria-label="Close"
                  onClick={handleClose}
                  className="px-4 text-xs py-1 bg-gray-300 rounded-lg text-gray-500 hover:bg-gray-400 mr-2"
                >
                  Close
                </button>
                <button
                  aria-label="Save"
                  onClick={handleSave}
                  className="text-xs px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default OccupationModal
