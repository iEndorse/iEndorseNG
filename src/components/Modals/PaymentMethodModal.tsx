import React, {useEffect, useState, useRef} from 'react';
import close from '../svg/close.svg';
import paystack from '../svg/paystack.svg'
import paypal from '../svg/paypal.svg'
import flutterwave from '../svg/flutterwave.svg'
import stripe from '../svg/stripe.svg'
import { toast } from 'react-toastify';

interface PaymentMethodProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: string) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodProps> = ({ isOpen, onClose,onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const walletRef = useRef<HTMLInputElement>(null);
  const paystackRef = useRef<HTMLInputElement>(null);
  const paypalRef = useRef<HTMLInputElement>(null);
    const stripeRef = useRef<HTMLInputElement>(null);
        const flutterwaveRef = useRef<HTMLInputElement>(null);
      
  const handleDivClick = (ref: React.RefObject<HTMLInputElement>, type: string) => {
    if (ref.current) {
      ref.current.checked = true;
      handleSelectPaymentMethod(type);
    }
  };


    const handleSelectPaymentMethod = (type:string) => {
      setPaymentMethod(type);
    };

 
    
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 transition-opacity flex   items-start mt-20 sm:mt-1 sm:items-center justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

      <div className="relative p-4 w-full max-w-md max-h-full">
      <div className='  flex justify-center p-4'>      
             <span
        className=" bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
        onClick={onClose}
      >
        <img src={close} alt="x" width={40} height={40} />
      </span> 
      </div> 
    
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5">
            <h1 className="text-center font-bold"> Select Payment Method</h1>

            <div className="flex-col max-w-sm space-y-1.5 justify-center mt-2 mb-10">

            <div
                className="flex items-center ps-4 border border-gray-200 rounded-lg cursor-pointer"
                onClick={() => handleDivClick(walletRef, "Wallet")}
              >
                <input
                  ref={walletRef}
                  id="wallet-radio"
                  type="radio"
                  name="payment-method"
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="wallet-radio"
                  className="w-full py-2 ms-5 text-sm font-medium text-gray-900"
                >
                  Wallet
                </label>
              </div>

              {/* <div
                className="flex items-center ps-4 border border-gray-200 rounded-lg cursor-pointer"
                onClick={() => handleDivClick(paystackRef, "Paystack")}
              >
                <input
                  ref={paystackRef}
                  id="paystack-radio"
                  type="radio"
                  name="payment-method"
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="paystack-radio"
                  className="w-full py-2 ms-5 text-sm font-medium text-gray-900"
                >
                  <img src={paystack}  className='w-4 h-4 inline mr-2' /> Paystack
                </label>
              </div>


              <div
                className="flex items-center ps-4 border border-gray-200 rounded-lg cursor-pointer"
                onClick={() => handleDivClick(paypalRef, "Paypal")}
              >
                <input
                  ref={paypalRef}
                  id="paypal-radio"
                  type="radio"
                  name="payment-method"
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="paypal-radio"
                  className="w-full py-3 ms-5 text-sm font-medium text-gray-900"
                >
                  <img src={paypal} className='inline w-4 h-4  mr-2' /> Paypal
                </label>
              </div>
            


      
              <div
                className="flex items-center ps-4 border border-gray-200 rounded-lg cursor-pointer"
                onClick={() => handleDivClick(stripeRef, "Stripe")}
              >
                <input
                  ref={stripeRef}
                  id="stripe-radio"
                  type="radio"
                  name="payment-method"
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="stripe-radio"
                  className="w-full py-2 ms-5 text-sm font-medium text-gray-900"
                >
                  <img src={stripe} className='inline w-4 h-4   mr-2' /> Stripe
                </label>
              </div>
            
              <div
                className="flex items-center ps-4 border border-gray-200 rounded-lg cursor-pointer"
                onClick={() => handleDivClick(flutterwaveRef, "Flutterwave")}
              >
                <input
                  ref={flutterwaveRef}
                  id="flutterwave-radio"
                  type="radio"
                  name="payment-method"
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="flutterwave-radio"
                  className="w-full py-2 ms-5 text-sm font-medium text-gray-900"
                >
                  <img src={flutterwave} className='inline w-4 h-4  mr-2' /> Flutterwave
                </label>
              </div>
             

          

           */}

 

        

     
          
          
            </div>
            
            <button
              onClick={() => onSubmit(paymentMethod)}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;