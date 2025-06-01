"use client"

import { useState, useEffect } from "react"
import { baseURL } from "../URL"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../NavBar/Navbar"

const TransactionDetails = () => {
  const [transactionData, setTransactionData] = useState<any>(null)
  const [error, setError] = useState("")
  const location = useLocation()
  const { reference } = location.state || {}
  const navigate = useNavigate()
  const url = `${baseURL}/Wallet/VerifyPaystackPaymentResponse`

  const fetchTransactionData = async () => {
    if (!reference) {
      setError("Transaction reference is missing")
      return
    }

    try {
      setError("")
      const token = window.localStorage.getItem("token")
      if (!token) {
        setError("User is not authenticated. Please log in.")
        return
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reference }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch transaction data")
      }

      const data = await response.json()
      console.log("API Response:", data) // Debug log
      setTransactionData(data)
    } catch (err) {
      console.error(err)
      setError("Failed to validate payment, please try again or contact support.")
    }
  }

  useEffect(() => {
    fetchTransactionData()
    const intervalId = setInterval(fetchTransactionData, 10000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      {/* Main content area with vertical centering */}
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {error && (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md text-red-600">
              <h2 className="text-xl font-bold mb-4">Error</h2>
              <div>{error}</div>
            </div>
          )}

          {!error && !transactionData && (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-customBlue">Pending...</h2>
              <div className="text-gray-700">Your transaction is being verified by the system.</div>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-customBlue"></div>
              </div>
            </div>
          )}

          {transactionData && (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-customBlue">Transaction Successful</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-600">Amount:</span>
                  <span className="text-gray-800">{transactionData?.data?.formattedAmount}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-600">Payment Status:</span>
                  <span
                    className={`${
                      transactionData?.data?.paymentStatus === "SUCCESSFUL"
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {transactionData?.data?.paymentStatus}
                  </span>
                </div>

                {/* You can add more transaction details here */}
              </div>

              <button
                onClick={() => navigate("/wallet")}
                className="mt-6 w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center"
              >
                Back to wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionDetails
