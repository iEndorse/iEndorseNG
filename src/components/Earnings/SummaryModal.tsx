"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { LineWave } from "react-loader-spinner"
import { baseURL } from "../URL"

interface SummaryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  details: any
}

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="cursor-pointer"
  >
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, onSuccess, details }) => {
  const [loading, setLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [accountId, setAccountId] = useState<any>(null)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [alertType, setAlertType] = useState<"success" | "error" | "">("")

  const hasInsufficientBalance = details?.points > details?.pointsBalance
  const isRedeemDisabled = loading || hasInsufficientBalance

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

  useEffect(() => {
    if (hasInsufficientBalance) {
      setAlertMessage("Insufficient balance. You cannot redeem more points than your available balance.")
      setAlertType("error")
    } else {
      // Clear error message when balance is sufficient
      if (alertType === "error" && alertMessage.includes("Insufficient balance")) {
        setAlertMessage("")
        setAlertType("")
      }
    }
  }, [hasInsufficientBalance, details?.points, details?.pointsBalance])

  if (!isOpen) return null

  const URL = `${baseURL}/Wallet/ReedeemUserPoint?pointToRedeem=${details?.points}`

  const RedeemEarnedPoints = async () => {
    if (hasInsufficientBalance) {
      setAlertMessage("Cannot proceed: Insufficient balance")
      setAlertType("error")
      return
    }

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

      console.log("Response Data:", responseData)
      setApiResponse(responseData.data)

      if (responseData) {
        console.log(responseData)
        onSuccess()
      }
    } catch (err) {
      console.error((err as Error).message)
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
            <CloseIcon />
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
              disabled={isRedeemDisabled}
              className={`w-full flex text-white items-center justify-center font-medium rounded-lg text-sm px-5 py-2 text-center ${
                isRedeemDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300"
              }`}
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
