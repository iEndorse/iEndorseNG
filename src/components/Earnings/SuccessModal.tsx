 
import type React from "react"
import { useEffect, useState } from "react"
import close from "../svg/close.svg"
import greenCheck from "../svg/greenCheck.svg"


interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  details: any
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, details }) => {
 
  
 

  if (!isOpen) return null

  return (
    <div className="fixed z-50 inset-0 transition-opacity flex  items-start sm:items-center items-start mt-20 sm:mt-1 sm:items-center  justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="  flex justify-center p-4">
          <span
            className=" bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close || "/placeholder.svg"} alt="x" width={40} height={40} />
          </span>
        </div>

         
         
            <div className="relative bg-white rounded-lg shadow">
              <div className="p-2 md:p-5 mx-2">
                <h1 className="text-center font-bold my-5">    Success</h1>
                <div className="flex  justify-center my-4 ">
                  <img src={greenCheck || "/placeholder.svg"} alt="greenCheck" width={70} height={70} />
                </div>

                <div className="text-center  mb-10">
                  <p>
                    {" "}
                    Your withdrawal request successful  
                  </p>
                </div>

                <div className="flex pb-2  items-center ">
                  <button
                    onClick={() => onClose()}
                    className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center"
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
       
        
      </div>
    </div>
  )
}

export default SuccessModal
