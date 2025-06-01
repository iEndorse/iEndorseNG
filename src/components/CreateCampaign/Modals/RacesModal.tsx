"use client"

import type React from "react"
import { useState } from "react"
import closeIcon from "../../svg/close.svg"
import { Backdrop, CircularProgress } from "@mui/material"

interface RacesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectRaces: (races: string[]) => void
  cachedRacesData: string[]
}

const RacesModal: React.FC<RacesModalProps> = ({ isOpen, onClose, onSelectRaces, cachedRacesData }) => {
  const [selectedRaces, setSelectedRaces] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Use cached races data
  const racesValues = cachedRacesData || []

  const handleSelectRace = (race: string) => {
    const updatedSelectedRaces = selectedRaces.includes(race)
      ? selectedRaces.filter((r) => r !== race)
      : [...selectedRaces, race]
    setSelectedRaces(updatedSelectedRaces)
  }

  const handleSelectAll = (isChecked: boolean) => {
    const allRaces = isChecked ? [...racesValues] : []
    setSelectedRaces(allRaces)
  }

  const handleSave = () => {
    onSelectRaces(selectedRaces)
    handleClearSelections()
    handleModalClose()
  }

  const handleClearSelections = () => {
    setSelectedRaces([])
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
          <h2 className="text-center text-lg font-bold mb-4">Select Races</h2>

          {/* Select All Checkbox */}
          {racesValues.length > 0 && (
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedRaces.length === racesValues.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="mr-2 text-md"
              />
              <label htmlFor="select-all">Select All</label>
            </div>
          )}

          {/* Races Options */}
          <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
            {racesValues.length === 0 ? (
              <div className="text-center text-gray-500">No races available.</div>
            ) : (
              racesValues.map((race: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`race-${index}`}
                    checked={selectedRaces.includes(race)}
                    onChange={() => handleSelectRace(race)}
                    className="mr-2 text-md"
                  />
                  <label htmlFor={`race-${index}`}>{race}</label>
                </div>
              ))
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              disabled={selectedRaces.length === 0}
              className={`px-4 py-2 rounded-lg ${
                selectedRaces.length ? "bg-customBlue text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
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

export default RacesModal
