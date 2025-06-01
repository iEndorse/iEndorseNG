import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../svg/logo.svg';
import { Link } from 'react-router-dom';
import { baseURL } from '../URL';
import { useLocation } from 'react-router-dom';
import { LineWave } from 'react-loader-spinner';
 

const NewPassword = () => {
  const location = useLocation();
  const { email } = location.state || {};
  
  const [formData, setFormData] = useState({
    token: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(''); // For error messages
  const [message, setMessage] = useState(''); // For informational messages
  const [finalMessage, setFinalMessage] = useState(''); // For final success message
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [resendTimer, setResendTimer] = useState(0); // Countdown for resend

  const resetUrl = `${baseURL}/Account/ResetPasswordConfirmed`;
  const resendUrl = `${baseURL}/Account/ResetPasswordRequest`;

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Restrict token input to numbers only
    if (name === 'token' && isNaN(Number(value))) return;

    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { token, password, confirmPassword } = formData;

    // Basic validations
    if (!token || !password || !confirmPassword) {
      setError('All fields are required.');
      setMessage('');
      setFinalMessage('');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setMessage('');
      setFinalMessage('');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setMessage('');
      setFinalMessage('');
      return;
    }

    // Proceed with API call
    setError('');
    setMessage('');
    setFinalMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(resetUrl, {
        token,
        password,
        confirmPassword,
      });

      // On success
      setFinalMessage('Password reset successful!');
      setError('');
    } catch (error: any) {
      // Handle API error
      setError(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
      setFinalMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend token functionality
  const handleResendToken = async () => {
    setError('');
    setMessage('');
    setFinalMessage('');
    setIsLoading(true);

    try {
      const ApiResponse = await fetch(resendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailAddress: email }),
      });

      // Start the 60-second timer
      setResendTimer(60);
      setMessage('A new token has been sent to your email.');
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'Failed to resend token. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown for resend token timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer
    }
  }, [resendTimer]);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: 'url(images/formbanner.png)',
      }}
    >
      <div className="flex items-center justify-center w-full px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
          {/* Logo */}
          <div className="flex justify-center">
            <img src={logo} alt="Logo" />
          </div>
          
          {/* Title */}
          <div className="text-center text-lg font-medium text-gray-900">
            Reset Password
          </div>
          <div className="text-center text-sm text-gray-700">
            Enter your new password below.
          </div>

          {/* Display messages */}
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {message && <div className="text-blue-500 text-sm text-center">{message}</div>}
          {finalMessage && <div className="text-blue-500 text-sm text-center">{finalMessage}
             <span className='font-medium'> 
                <Link to={'/SignIn'} > Sign in</Link>   </span> with your new password</div>}

          {/* Form */}
          {!finalMessage && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="New Password"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Confirm Password"
                required
              />
              <input
                type="text"
                name="token"
                value={formData.token}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Token"
                required
              />
              <button
                type="submit"
                className={`w-full p-2 bg-blue-500 text-white rounded ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LineWave
                    visible={true}
                    height="20"
                    width="100"
                    color="#fff"
                    ariaLabel="loading"
                  />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {/* Resend Token */}
          {!finalMessage && (
            <div className="text-center mt-4">
              <button
                onClick={handleResendToken}
                disabled={resendTimer > 0 || isLoading}
                className={`p-2 bg-gray-300 rounded ${
                  resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
                }`}
              >
                {resendTimer > 0 ? `Resend Token in ${resendTimer}s` : 'Resend Token'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
