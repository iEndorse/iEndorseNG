"use client"

import type React from "react"
import { useState } from "react"
import closeIcon from "../../svg/close.svg"
import { Backdrop, CircularProgress } from "@mui/material"

interface IncomeRangeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectIncomeRanges: (incomeRanges: string[]) => void
  cachedIncomeRangeData: string[]
}

const IncomeRangeModal: React.FC<IncomeRangeModalProps> = ({
  isOpen,
  onClose,
  onSelectIncomeRanges,
  cachedIncomeRangeData,
}) => {
  const [selectedIncomeRanges, setSelectedIncomeRanges] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Use cached income range data
  const incomeRangeValues = cachedIncomeRangeData || []

  const handleSelectIncomeRange = (incomeRange: string) => {
    const updatedSelectedIncomeRanges = selectedIncomeRanges.includes(incomeRange)
      ? selectedIncomeRanges.filter((i) => i !== incomeRange)
      : [...selectedIncomeRanges, incomeRange]
    setSelectedIncomeRanges(updatedSelectedIncomeRanges)
  }

  const handleSelectAll = (isChecked: boolean) => {
    const allIncomeRanges = isChecked ? [...incomeRangeValues] : []
    setSelectedIncomeRanges(allIncomeRanges)
  }

  const handleSave = () => {
    onSelectIncomeRanges(selectedIncomeRanges)
    handleClearSelections()
    handleModalClose()
  }

  const handleClearSelections = () => {
    setSelectedIncomeRanges([])
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
          <h2 className="text-center text-lg font-bold mb-4">Select Income Range</h2>

          {/* Select All Checkbox */}
          {incomeRangeValues.length > 0 && (
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedIncomeRanges.length === incomeRangeValues.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="mr-2 text-md"
              />
              <label htmlFor="select-all">Select All</label>
            </div>
          )}

          {/* Income Range Options */}
          <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
            {incomeRangeValues.length === 0 ? (
              <div className="text-center text-gray-500">No income ranges available.</div>
            ) : (
              incomeRangeValues.map((incomeRange: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`income-range-${index}`}
                    checked={selectedIncomeRanges.includes(incomeRange)}
                    onChange={() => handleSelectIncomeRange(incomeRange)}
                    className="mr-2 text-md"
                  />
                  <label htmlFor={`income-range-${index}`}>{incomeRange}</label>
                </div>
              ))
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              disabled={selectedIncomeRanges.length === 0}
              className={`px-4 py-2 rounded-lg ${
                selectedIncomeRanges.length
                  ? "bg-customBlue text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
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

export default IncomeRangeModal
