import type React from "react"
import { useState } from "react"
import closeIcon from "../../svg/close.svg"
import { Backdrop, CircularProgress } from "@mui/material"

interface EducationLevelModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectEducationLevels: (educationLevels: string[]) => void
  cachedEducationLevelData: string[]
}

const EducationLevelModal: React.FC<EducationLevelModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectEducationLevels, 
  cachedEducationLevelData 
}) => {
  const [selectedEducationLevels, setSelectedEducationLevels] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Use cached education level data
  const educationLevelValues = cachedEducationLevelData || []

  const handleSelectEducationLevel = (educationLevel: string) => {
    const updatedSelectedEducationLevels = selectedEducationLevels.includes(educationLevel)
      ? selectedEducationLevels.filter((e) => e !== educationLevel)
      : [...selectedEducationLevels, educationLevel]
    setSelectedEducationLevels(updatedSelectedEducationLevels)
  }

  const handleSelectAll = (isChecked: boolean) => {
    const allEducationLevels = isChecked ? [...educationLevelValues] : []
    setSelectedEducationLevels(allEducationLevels)
  }

  const handleSave = () => {
    onSelectEducationLevels(selectedEducationLevels)
    handleClearSelections()
    handleModalClose()
  }

  const handleClearSelections = () => {
    setSelectedEducationLevels([])
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
          <h2 className="text-center text-lg font-bold mb-4">Select Education Level</h2>

          {/* Select All Checkbox */}
          {educationLevelValues.length > 0 && (
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedEducationLevels.length === educationLevelValues.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="mr-2 text-md"
              />
              <label htmlFor="select-all">Select All</label>
            </div>
          )}

          {/* Education Level Options */}
          <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
            {educationLevelValues.length === 0 ? (
              <div className="text-center text-gray-500">No education levels available.</div>
            ) : (
              educationLevelValues.map((educationLevel: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`education-level-${index}`}
                    checked={selectedEducationLevels.includes(educationLevel)}
                    onChange={() => handleSelectEducationLevel(educationLevel)}
                    className="mr-2 text-md"
                  />
                  <label htmlFor={`education-level-${index}`}>{educationLevel}</label>
                </div>
              ))
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              disabled={selectedEducationLevels.length === 0}
              className={`px-4 py-2 rounded-lg ${
                selectedEducationLevels.length ? "bg-customBlue text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
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

export default EducationLevelModal
