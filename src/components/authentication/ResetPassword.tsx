import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../svg/logo.svg';
import facebook from '../svg/facebook.svg';
import instagram from '../svg/instagram.svg';
import { baseURL } from '../URL';

 

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetUrl =  `${baseURL}/Account/ResetPasswordRequest`;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true); // Show loading indicator
      send()
  };

  const send = async () => {
    try {
      const ApiResponse = await fetch(resetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailAddress: email }),
      });

      const apiData = await ApiResponse.json();

      if (ApiResponse.ok && apiData.succeeded) {
        const stateValues = {
          email: email, // Example state value
          //token: '123456', // Another state value
        };
        navigate('/NewPassword', { state: stateValues });
        toast.success('Token sent successfully. Please check your email.');
      } else {
        toast.error(apiData.message || 'An error occurred while sending the token');
      }
    } catch (err) {
      toast.error('Network error. Please try again later.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  }
  return (
    <div
      className="min-h-screen flex items-center justify-start bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: 'url(images/formbanner.png)' }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border p-6 space-y-4 md:space-y-6 mx-5 mt-3 md:mx-10 md:my-10">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" />
        </div>
        <div className="my-1 flex justify-center text-lg font-medium leading-tight tracking-tight text-gray-900 md:text-xl">
          Reset Password
        </div>
        <div className="flex justify-center text-sm leading-tight tracking-tight text-gray-900 my-1">
          Provide your email address to continue.
        </div>
        <form className="space-y-20 md:space-y-20" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Email Address"
              required
            />
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          <div className="mb-20">
            <button
              type="submit"
              className="bg-customBlue text-white p-2.5 rounded-md w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
