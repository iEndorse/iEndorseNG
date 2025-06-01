import React, { useState, useRef, ChangeEvent, KeyboardEvent, FormEvent } from 'react';
import logo from './svg/logo.svg';
import facebook from './svg/facebook.svg';
import instagram from './svg/instagram.svg';

const ConfirmOTP: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [resendClicked, setResendClicked] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if value is not empty and current index is not the last one
      if (value !== '' && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join('');
    console.log('OTP submitted:', otpCode);
    // Add your form submission logic here
  };

  const handleResend = () => {
    setResendClicked(true);
    console.log('Resend OTP');
    // Add your resend OTP logic here
  };

  return (
    <>
      <div
        className="min-h-screen flex flex-col bg-cover bg-center r overflow-hidden"
        style={{
          backgroundImage: 'url(images/formbanner.png)',
        }}
      >
  <div className="min-h-screen flex items-center justify-start bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url(images/formbanner.png)' }}>
  <div className="w-full max-w-md bg-white rounded-lg shadow dark:border p-6 space-y-4 md:space-y-6 mx-5 mt-3 md:mx-10 md:my-10">
            <div className="flex justify-center">
              <img src={logo} alt="Logo" />
            </div>
            <div className="my-1 flex justify-center text-lg font-medium leading-tight tracking-tight text-gray-900 md:text-xl">
              Forgot Password
            </div>
            <div className="flex justify-center text-sm leading-tight tracking-tight text-gray-900 my-1">
              Please enter the OTP sent to your email address.
            </div>
            <form className="space-y-20 md:space-y-20" onSubmit={handleSubmit}>
              <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                {otp.map((digit, index) => (
                  <div key={index} className="w-16 h-16">
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center text-sm leading-tight tracking-tight text-gray-900 my-1">
                Did not receive code?{' '}
                <button
                  type="button"
                  className="text-blue-700 underline"
                  onClick={handleResend}
                >
                  Resend
                </button>
              </div>

              <div className='mb-20'>
                <button type="submit" className="bg-customBlue text-white p-2.5 rounded-md w-full mb-20">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOTP;
