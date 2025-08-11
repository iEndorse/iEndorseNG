"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../NavBar/Navbar"
import { baseURL } from "../URL"
import useFetch from "../Hooks/useFetch"
import incoming from "../svg/incoming.svg"
import { Backdrop, CircularProgress } from "@mui/material"
import RedeemPoints from "./RedeemPoints"
import BankDetails from "./BankDetails"
import SummaryModal from "./SummaryModal"
import SuccessModal from "./SuccessModal"

const Earnings = () => {
  const [accountId, setAccountId] = useState<any>(null)
  const [apiResponse, setApiResponse] = useState<any>()
  const [allData, setAllData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [redeemPointsModal, setRedeemPointsModal] = useState(false)
  const [bankDetails, setBankDetails] = useState<any>(null)
  const [withdrawSuccessModal, setWithdrawSuccessModal] = useState(false)
  const [points, setPoints] = useState<any>(null)
  const [enterPasswordModal, setEnterPasswordModal] = useState(false)
  const [summaryModal, setSummaryModal] = useState(false)
  const [bankDetailsModal, setBankDetailsModal] = useState(false)
  const onSuccess = () => {}
  const onError = () => {}
  const openBankDetailsModal = () => setBankDetailsModal(true)
  const closeBankDetailsModal = () => setBankDetailsModal(false)
  const openRedeemPointsModal = () => setRedeemPointsModal(true)
  const closeRedeemPointsModal = () => setRedeemPointsModal(false)
  const openWithdrawSuccessModal = () => setWithdrawSuccessModal(true)
  const closesWithdrawSuccessModal = () => setWithdrawSuccessModal(false)
  const openSummaryModal = () => setSummaryModal(true)
  const closeSummaryModal = () => {setSummaryModal(false); refreshPointsData()}
  const openEnterPasswordModal = () => setEnterPasswordModal(true)
  const closeEnterPasswordModal = () => setEnterPasswordModal(false)
  const navigate = useNavigate()

  const redeemURL = `${baseURL}/Wallet/ReedeemUserPoint`
  const pointsUrl = `${baseURL}/Wallet/PointsProfile`

  const {
    data: pointsData,
    refreshApi: refreshPointsData,
    error: pointsError,
    loading: pointsDataLoading,
  } = useFetch(pointsUrl, "GET", onSuccess, onError)

  const pointsBalance = pointsData?.totalPointBalance
  const transactions = pointsData?.pointsTransactions

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

  const handlePoints = (x: any) => {
    setPoints(x)
    setAllData({ ...allData, points: x, pointsBalance: pointsBalance, accountId: accountId })
    closeRedeemPointsModal()
    openBankDetailsModal()
  }

  const handleBankDetails = () => {
    closeBankDetailsModal()
    console.log("allData", allData)
    openSummaryModal()
  }

  function formatDate(timestamp: string) {
    const dateObj = new Date(timestamp)
    const options: any = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // For 12-hour format with AM/PM, set to false for 24-hour format
    }
    return dateObj.toLocaleString("en-GB", options)
  }

  return (
    <>
      <div className="bg-gray-100 h-screen ">
        <Navbar />
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <div className={`flex bg-gray-100 justify-center px-4 sm:px-6 md:px-8 mt-20 `}>
          <div className=" mt-10 w-full max-w-md mt-10  ">
            <div
              className={`p-4 w-full md:max-w-md border-gray-700 bg-white rounded-lg my-2 bg-cover  bg-center overflow-hidden ${pointsDataLoading && "animate-pulse"}`}
              style={{
                backgroundImage:
                  "url(https://res.cloudinary.com/dgso4wgqt/image/upload/v1744376587/Frame_1000001220_1_emgqml.png)",
              }}
            >
              <div className="mt-3  pl-2 pr-36">
                <h1 className="text-sm text-white pr-36">Points Ballance</h1>
              </div>
              <div className="mt-2 pl-2 pr-10">
                <h1 className="text-3xl font-bold text-white">{pointsBalance}</h1>
              </div>
              <div className="mt-5 pl-2  ">
                <button
                  className="px-10 py-2  bg-white hover:bg-gray-100 text-customBlue rounded-md  "
                  onClick={() => setRedeemPointsModal(true)}
                >
                  Redeem Points
                </button>
              </div>
            </div>
            {/* <div className='font-medium text-lg'> Today</div> */}
            {transactions &&
              transactions.map((item: any, index: number) => (
                <div className=" w-full md:max-w-md p-4 max-w-md border-gray-700 bg-white rounded-lg my-2" key={index}>
                  <div className="flex items-center ">
                    <div className="flex">
                      <div className="mr-4   rounded-full  mx-1">
                        <img
                          src={incoming || "/placeholder.svg"}
                          width={50}
                          height={50}
                          alt="notification"
                          className=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2  pr-16">
                    <h1 className="font-medium">{item.title}</h1>
                    <div className="mt-2 text-sm">{item.description}</div>

                    <div className="mt-2 text-sm">
                      Balance : <span className="font-medium"> {item?.pointBalance}</span>
                    </div>

                    <div>
                      <p className="text-xs mt-10">{formatDate(item?.dateRecieved)}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <RedeemPoints isOpen={redeemPointsModal} onClose={closeRedeemPointsModal} onSubmit={handlePoints} />

      <BankDetails
        isOpen={bankDetailsModal}
        onClose={closeBankDetailsModal}
        // onSubmit={handleBankDetails}
        onProceed={handleBankDetails}
        details={allData}
      />

      <SummaryModal
        isOpen={summaryModal}
        onClose={closeSummaryModal}
        onSuccess={() => {
          closeSummaryModal()
          openWithdrawSuccessModal()
        }}
        details={allData}
      />

      {/* 
                <EnterPassword 
                isOpen={enterPasswordModal}
                onClose={closeEnterPasswordModal}
                onSubmit={handlePasswordSubmit}
                />   */}

      <SuccessModal isOpen={withdrawSuccessModal} onClose={closesWithdrawSuccessModal} details={allData} />
    </>
  )
}
export default Earnings
