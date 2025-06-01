"use client"

import type React from "react"
import { useEffect, useState } from "react"
import close from "../svg/close.svg"
import { baseURL } from "../URL"
// import { toast } from "react-toastify"
import { LineWave } from "react-loader-spinner"
import Select from "react-select"
import { toast } from "sonner"

interface BankDetailsProps {
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
  details: any
}

// Define interface for bank data
interface BankOption {
  value: string
  label: string
  code: string
}

const BankDetails: React.FC<BankDetailsProps> = ({ isOpen, onClose, onProceed, details }) => {
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("")
  const [bankAccountName, setBankAccountName] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [banklist, setBanklist] = useState<BankOption[]>([])
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null)
  const [hasExistingDetails, setHasExistingDetails] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState<string>("")
  const [isAccountVerified, setIsAccountVerified] = useState(false)

  const userData = JSON.parse(localStorage.getItem("userData") as string)
  const userId = userData.id

  const validateAccountNumber = async () => {
    if (!bankAccountNumber || !selectedBank) {
      setValidationError("Please enter account number and select a bank first.")
      return
    }

    setIsValidating(true)
    setValidationError("")

    try {
      const response = await fetch(
        `${baseURL}/BankAccount/VerifyAccountDetails?accountNumber=${bankAccountNumber}&bankCode=${selectedBank.code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()

      if (responseData.succeeded && responseData.data) {
        setBankAccountName(responseData.data.accountName)
        setIsAccountVerified(true)
        //  toast.success("Account verified successfully!")
        setValidationError("")
      } else {
        setValidationError(responseData.message || "Account verification failed")
        setIsAccountVerified(false)
        // toast.error("Account verification failed")
      }
    } catch (err) {
      setValidationError("Failed to verify account. Please try again.")
      setIsAccountVerified(false)
      toast.error("Failed to verify account")
      console.error("Validation error:", err)
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = () => {
    if (!selectedBank || !bankAccountNumber || !bankAccountName) {
      setError("Please fill in all fields.")
      toast.error("Please fill in all fields.")
    } else if (!isAccountVerified && isEditing) {
      setError("Please verify your account number first.")
      toast.error("Please verify your account number first.")
    } else {
      setError("")
      saveBankDetails()
    }
  }

  const resetValidation = () => {
    setIsAccountVerified(false)
    setValidationError("")
    setBankAccountName("")
  }

  const fetchBanks = async () => {
    try {
      const response = await fetch(`${baseURL}/BankAccount/GetBanks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()

      if (responseData && responseData.data) {
        // Transform the API data into the format expected by react-select
        const formattedBanks = responseData.data.map((bank: any) => ({
          value: bank.code,
          label: bank.name,
          code: bank.code,
        }))

        setBanklist(formattedBanks)
      }
    } catch (err) {
      console.error((err as Error).message)
      toast.error("Failed to fetch banks")
    }
  }

  // fetch user bank details
  const fetchUserBankDetails = async () => {
    try {
      const response = await fetch(`${baseURL}/BankAccount/GetUserBankAccount/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()

      if (responseData && responseData.data) {
        setBankAccountNumber(responseData.data.bankAccountNumber)
        setBankAccountName(responseData.data.bankAccountName)
        setSelectedBank({
          value: responseData.data.bankCode,
          label: responseData.data.bankName,
          code: responseData.data.bankCode,
        })
        setHasExistingDetails(true)
        setIsEditing(false) // Initially show as read-only when there are existing details
      } else {
        setHasExistingDetails(false)
        setIsEditing(true) // Always in edit mode when no existing details
      }
    } catch (err) {
      console.error((err as Error).message)
      toast.error("Failed to fetch user bank details")
      setHasExistingDetails(false)
      setIsEditing(true) // Default to edit mode if fetch fails
    }
  }

  // Save bank details - uses the appropriate endpoint based on whether we're adding or updating
  const saveBankDetails = async () => {
    setLoading(true)

    try {
      // Use different endpoint and HTTP method based on whether user has existing details
      const endpoint = hasExistingDetails
        ? `${baseURL}/BankAccount/UpdateBankAccount`
        : `${baseURL}/BankAccount/AddBankAccount`

      const method = hasExistingDetails ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id: userId,
          bankName: selectedBank?.label,
          bankAccountNumber: bankAccountNumber,
          bankAccountName: bankAccountName,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()

      if (responseData) {
        toast.success(hasExistingDetails ? "Bank Details Updated" : "Bank Details Added")
        setHasExistingDetails(true)
        setIsEditing(false)
        onProceed()
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Use existing details without making changes
  const handleUseExisting = () => {
    onProceed()
  }

  // Switch to edit mode
  const handleEdit = () => {
    setIsEditing(true)
  }

  useEffect(() => {
    if (isOpen) {
      fetchBanks()
      fetchUserBankDetails()
    }
  }, [isOpen])

  useEffect(() => {
    if (bankAccountNumber.length === 10 && selectedBank) {
      validateAccountNumber()
    }
  }, [bankAccountNumber, selectedBank])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 transition-opacity flex items-start mt-20 sm:mt-1 sm:items-center justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="flex justify-center p-4">
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close || "/placeholder.svg"} alt="x" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5">
            <h1 className="text-center font-bold">Bank Details</h1>
            <p className="p-1 text-sm text-center font-sans mb-4">
              {hasExistingDetails && !isEditing
                ? "Review your bank details for point redemption."
                : "Enter the bank details you wish to redeem your points into."}
            </p>

            <div className="flex-col max-w-sm space-y-4 justify-center mb-6">
              {error && <p className="text-red-500 text-xs my-2">{error}</p>}

              {/* Bank Account Form */}
              <div className="mb-2">
                <Select
                  placeholder="Select Bank"
                  value={selectedBank}
                  onChange={(option) => {
                    setSelectedBank(option)
                    resetValidation()
                  }}
                  options={banklist}
                  isLoading={banklist.length === 0}
                  classNamePrefix="select"
                  className="basic-single"
                  isDisabled={!isEditing}
                />
              </div>

              <div className="mb-2">
                <input
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10)
                    setBankAccountNumber(value)
                    resetValidation()
                  }}
                  value={bankAccountNumber}
                  id="bankAccountNumber"
                  className={`w-full py-2 px-3 text-sm rounded-md border text-gray-900 ${!isEditing ? "bg-gray-100" : ""}`}
                  placeholder="Enter 10-digit Account Number"
                  disabled={!isEditing}
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
                {validationError && <p className="text-red-500 text-xs mt-1">{validationError}</p>}
              </div>

              <div className="mb-2">
                <div
                  className={`w-full py-2 px-3 text-sm rounded-md border text-gray-900 
                  ${!isEditing ? "bg-gray-100" : ""}`}  
                >
                  {bankAccountName || "Account Name"}
                </div>
                {/* {isAccountVerified && <p className="text-green-600 text-xs mt-1">✓ Account name verified</p>} */}
              </div>
            </div>

            {/* Display different button options based on state */}
            {hasExistingDetails && !isEditing ? (
              <div className="flex space-x-4">
                <button
                  onClick={handleUseExisting}
                  className="w-1/2 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Use Existing
                </button>
                <button
                  onClick={handleEdit}
                  className="w-1/2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Edit Details
                </button>
              </div>
            ) : (
              <button
                disabled={loading}
                onClick={handleSubmit}
                className={`w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  loading ? "opacity-50 cursor-not-allowed bg-gray-700" : "bg-customBlue"
                }`}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <LineWave height="24" width="24" color="white" ariaLabel="loading" />
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : hasExistingDetails ? (
                  "Update Details"
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BankDetails
