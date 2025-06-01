import React, { useState } from 'react';
import close from '../svg/close.svg';
import { toast } from "react-toastify";
import eye from '../svg/eye.svg';

interface PasswordProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

const EnterPassword: React.FC<PasswordProps> = ({ isOpen, onClose, onSubmit }) => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = () => {
    if (!password) {
      setError('Please enter a valid password.');
      toast.error("Please enter a valid password.");
    } else {
      setError('');
      onSubmit(password);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 transition-opacity flex items-start sm:items-center justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className='flex justify-center p-4'>
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="x" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5">
            <h1 className="text-center font-bold">Enter Password</h1>
            <p className="p-1 text-sm text-center font-sans mb-4">
              Please enter your password to proceed.
            </p>

            <div className="flex-col max-w-sm space-y-2 justify-center mb-40">
              {error && <p className="text-red-500 text-xs my-2">{error}</p>}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} // Toggle between text and password
                  onChange={handlePasswordChange}
                  value={password}
                  className="w-full py-2 px-3 text-sm rounded-md border text-gray-900"
                  placeholder="Enter your password"
                />
                <div className="absolute right-3 top-2.5 cursor-pointer" onClick={handleTogglePassword}>
                  {showPassword ? <img src={eye} alt="eye" width={20} height={20} /> : <img src={eye} alt="eye" width={20} height={20} />}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterPassword;
