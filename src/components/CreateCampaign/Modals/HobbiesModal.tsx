"use client"

import type React from "react"
import { useState } from "react"
import closeIcon from "../../svg/close.svg"
import { Backdrop, CircularProgress } from "@mui/material"

interface HobbiesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectHobbies: (hobbies: string[]) => void
  cachedHobbiesData: string[]
}

const HobbiesModal: React.FC<HobbiesModalProps> = ({ isOpen, onClose, onSelectHobbies, cachedHobbiesData }) => {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Use cached hobbies data
  const hobbiesValues = cachedHobbiesData || []

  const handleSelectHobby = (hobby: string) => {
    const updatedSelectedHobbies = selectedHobbies.includes(hobby)
      ? selectedHobbies.filter((h) => h !== hobby)
      : [...selectedHobbies, hobby]
    setSelectedHobbies(updatedSelectedHobbies)
  }

  const handleSelectAll = (isChecked: boolean) => {
    const allHobbies = isChecked ? [...hobbiesValues] : []
    setSelectedHobbies(allHobbies)
  }

  const handleSave = () => {
    onSelectHobbies(selectedHobbies)
    handleClearSelections()
    handleModalClose()
  }

  const handleClearSelections = () => {
    setSelectedHobbies([])
  }

  const handleModalClose = () => {
    setTimeout(() => handleClearSelections(), 300)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 sm:pt-1 pt-20 flex sm:items-center items-start justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

      {/* Loading State */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Modal */}
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* Close Icon */}
        <div className="flex justify-center p-2">
          <button onClick={handleModalClose}>
            <img src={closeIcon || "/placeholder.svg"} alt="Close" width={40} height={40} />
          </button>
        </div>

        <div className="p-4 bg-white rounded-lg">
          {/* Modal Title */}
          <h2 className="text-center text-lg font-bold mb-4">Select Hobbies</h2>

          {/* Select All Checkbox */}
          {hobbiesValues.length > 0 && (
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedHobbies.length === hobbiesValues.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="mr-2 text-md"
              />
              <label htmlFor="select-all">Select All</label>
            </div>
          )}

          {/* Hobbies Options */}
          <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
            {hobbiesValues.length === 0 ? (
              <div className="text-center text-gray-500">No hobbies available.</div>
            ) : (
              hobbiesValues.map((hobby: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`hobby-${index}`}
                    checked={selectedHobbies.includes(hobby)}
                    onChange={() => handleSelectHobby(hobby)}
                    className="mr-2 text-md"
                  />
                  <label htmlFor={`hobby-${index}`}>{hobby}</label>
                </div>
              ))
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              disabled={selectedHobbies.length === 0}
              className={`px-4 py-2 rounded-lg ${
                selectedHobbies.length ? "bg-customBlue text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HobbiesModal
