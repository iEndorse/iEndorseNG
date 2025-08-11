"use client"

import type React from "react"
import { useEffect, useState } from "react"
import close from "../svg/close.svg"
import { LineWave } from "react-loader-spinner"
import { baseURL } from "../URL"

interface SummaryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void // Add this line
  details: any
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, onSuccess, details }) => {
  const [loading, setLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)
 
  const [accountId, setAccountId] = useState<any>(null)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [alertType, setAlertType] = useState<"success" | "error" | "">("")

  useEffect(() => {
    const userDataString = window.localStorage.getItem("userData")

    if (userDataString) {
      const userData = JSON.parse(userDataString)
      const accountId = userData.id
      setAccountId(accountId)
    } else {
      console.log("No userData found in localStorage")
    }
  }, [])

  if (!isOpen) return null

  const URL = `${baseURL}/Wallet/ReedeemUserPoint?pointToRedeem=${details?.points}`

  const RedeemEarnedPoints = async () => {
    setLoading(true)
    // Clear previous alerts
    setAlertMessage("")
    setAlertType("")

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${window.localStorage.getItem("token")}`,
        },
      
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()

      // Set the API response in state
      setApiResponse(responseData.data)

      if (responseData) {
        // Display success message within the component
        // setAlertMessage("Points Redeemed Successfully")
        // setAlertType("success")
        console.log(responseData)
        onSuccess() // Call the onSuccess function passed as a prop

        // Wait a short time before transitioning to success modal
   
      }
    } catch (err) {
      console.error((err as Error).message)
      // Display error message within the component
      setAlertMessage("Something went wrong")
      setAlertType("error")
    } finally {
      setLoading(false)
    }
  }

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
            <h1 className="text-center font-bold">Summary</h1>

            {/* Alert message display */}
            {alertMessage && (
              <div
                className={`mt-4 p-3 rounded text-center font-medium ${
                  alertType === "success"
                    ? "bg-green-100 text-green-700 border border-green-400"
                    : alertType === "error"
                      ? "bg-red-100 text-red-700 border border-red-400"
                      : ""
                }`}
              >
                {alertMessage}
              </div>
            )}

            <div className="flex-col max-w-sm space-y-2 justify-center mt-8 mb-28">
              <div className="border-b pb-2 flex justify-between">
                <span className="">Points Balance</span>
                <span className="font-medium">{details?.pointsBalance}</span>
              </div>

              <div className="border-b pb-2 flex justify-between">
                <span className="">Amount</span>
                <span className="font-medium">{details?.points}</span>
              </div>

              <div className="pb-2 flex justify-between">
                <span className="">Total</span>
                <span className="font-medium">{details?.points}</span>
              </div>
            </div>

            <button
              onClick={() => RedeemEarnedPoints()}
              disabled={loading}
              className="w-full flex text-white items-center justify-center bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center"
            >
              {loading ? <LineWave height="30" width="30" color="white" ariaLabel="loading" /> : "Proceed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryModal
