import React, { useState, FormEvent } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import logo from './svg/logo.svg';
import google from './svg/google.svg';
import { baseURL } from '../URL';
import { useNavigate, Link } from 'react-router-dom';
import { LineWave } from 'react-loader-spinner';

interface MyJwtPayload extends JwtPayload {
  name: string;
  email?: string;
}

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async (credentialResponse: any) => {
    setLoading(true);
    if (credentialResponse.credential) {
      const decodedUser = jwtDecode<MyJwtPayload>(credentialResponse.credential);
  
      console.log("Credential Response", credentialResponse);
      console.log('Google Sign-In successful:', decodedUser);
  
      // Prepare the request body for the API endpoint
      const requestBody = {
        fullName: decodedUser.name,
        emailAddress: decodedUser.email,
        socialMediaPlatform: "Google",
      };
  
      try {
        // Send the user data to the backend
        const response = await fetch(`${baseURL}/Auth/LoginForStoreOwnerWithSocialMedia`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          console.log("User successfully created/validated:", responseData);
          window.localStorage.setItem("userData", JSON.stringify(responseData.data));
          window.localStorage.setItem("token", responseData.data.jwtToken);
  
          // Navigate to the desired page
          const intendedUrl = new URLSearchParams(window.location.search).get('next') || "/";
          navigate(intendedUrl);
        } else {
          const errorData = await response.json();
          console.error("Error from API:", errorData);
          setErrorMessage(errorData.message || "Failed to validate user.");
        }
      } catch (error) {
        console.error("Error during Google Sign-In:", error);
        setErrorMessage("An unexpected error occurred during Google Sign-In.");
      }
      finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Google Sign-In failed.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Clear any previous errors
    const apiUrl = `${baseURL}/Auth/LoginForUser`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailAddress: email, password }),
      });

      const data = await response.json();

      if (response.ok && data.succeeded) {
        window.localStorage.setItem('userData', JSON.stringify(data.data));
        window.localStorage.setItem('token', data?.data.jwtToken);
        window.localStorage.setItem('walletUnits', data?.data.walletUnits);

        const intendedUrl = new URLSearchParams(window.location.search).get('next') || "/";
        navigate(intendedUrl);
      } else {
        setErrorMessage(data.message || 'An error occurred while signing in');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setErrorMessage('An error occurred while signing in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center sm:justify-start md:pl-10 bg-cover bg-center" style={{ backgroundImage: 'url(https://res.cloudinary.com/dgso4wgqt/image/upload/v1733390911/formbanner_m56rbj.png)' }}>
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border p-6 space-y-4 md:space-y-6 mx-5 mt-10 sm:mt-0">
        <div className="flex justify-center">
          <img src="https://res.cloudinary.com/dgso4wgqt/image/upload/v1732801029/logo_zganue.png" alt="Logo" />
        </div>
        <div className="flex justify-center text-lg font-medium leading-tight tracking-tight text-gray-900 md:text-xl">
          Sign In
        </div>
        <div className="flex justify-center text-sm leading-tight tracking-tight text-gray-900">
          Your impact matters, we're excited to have you back.
        </div>
        
        {/* Display error message if there is one */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        
        <form className="space-y-4 md:space-y-3" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <p className="px-4">
              Forgot your password?{' '}
              <Link to="/ResetPassword" className="text-customBlue hover:text-blue-500 font-medium">
                Reset
              </Link>
            </p>
          </div>
          <div>
            <button disabled={loading} type="submit" className="bg-customBlue text-white p-2.5 rounded-md w-full flex items-center justify-center space-x-2">
              <span>{loading ? 'Signing In' : 'Sign In'}</span>
              {loading && (
                <LineWave
                  visible={true}
                  height="40"
                  width="40"
                  color="#fff"
                  ariaLabel="line-wave-loading"
                />
              )}
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <p className="px-4">Or Sign in with</p>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        <div className="flex justify-center space-x-4">
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={() => setErrorMessage('Google Sign-In failed.')}
          />
        </div>
        <div className="flex items-center justify-center">
          <p className="px-4">
            Are you new here?{' '}
            <Link to="/SignUp" className="text-customBlue hover:text-blue-500">
              Create An Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;