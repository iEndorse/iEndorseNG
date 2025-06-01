import React, { useState, ChangeEvent, FormEvent } from 'react';
import logo from '../svg/logo.svg';
import facebook from '../svg/facebook.svg';
import instagram from '../svg/instagram.svg';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../PhoneInput.css';
import { baseURL } from '../URL';
import { useNavigate } from 'react-router-dom';
import { LineWave } from 'react-loader-spinner';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode, JwtPayload } from 'jwt-decode'; 

interface Errors {
  fullName?: string;
  emailAddress?: string;
  password?: string;
  confirmPass?: string;
  phone?: string;
  referalCode?: string;
}

interface MyJwtPayload extends JwtPayload {
  name: string;
  email?: string;
}

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [country, setCountry] = useState<string>('NGA');
  const [countryCode, setCountryCode] = useState<string>('NG');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [referalCode, setReferalCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const navigate = useNavigate();
 
  const handleGoogleSignUp = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decodedUser = jwtDecode<MyJwtPayload>(credentialResponse.credential);
      setGeneralError(''); // Clear any previous errors
      setSuccessMessage(''); // Clear any previous success messages
  
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
        const response = await fetch(`${baseURL}/Account/CreateAccountForUserWithSocialMedia`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          console.log("User successfully created:", responseData);
          setSuccessMessage("User successfully created");
          window.localStorage.setItem("userData", JSON.stringify(responseData.data));
          window.localStorage.setItem("token", responseData.data.jwtToken);
  
          // Navigate to the desired page
          navigate('/');
        } else {
          const errorData = await response.json();
          console.error("Error from API:", errorData);
          setGeneralError(errorData.message || "Failed to create user.");
        }
      } catch (error) {
        console.error("Error during Google Sign-In:", error);
        setGeneralError("An unexpected error occurred during Google Sign-up.");
      }
    } else {
      setGeneralError("Google Sign-up failed.");
    }
  };
  
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          return 'Full name is required';
        }
        break;
      case 'email':
        if (!value) {
          return 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          return 'Email is invalid';
        }
        break;
      case 'password':
        if (!value) {
          return 'Password is required';
        } else if (value.length < 8) {
          return 'Password must be at least 8 characters';
        } else if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
          return 'Password must contain both letters and numbers';
        }
        break;
      case 'confirmPass':
        if (!value) {
          return 'Confirm password is required';
        } else if (value !== password) {
          return 'Passwords do not match';
        }
        break;
      case 'phone':
        if (!value) {
          return 'Phone number is required';
        }
        
        break;
      default:
        break;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the corresponding state
    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmailAddress(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPass':
        setConfirmPassword(value);
        break;
      case 'referalCode':
        setReferalCode(value);
        break;
      default:
        break;
    }

    // Validate the field and update the errors state
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    const error = validateField('phone', value);
    setErrors((prevErrors) => ({ ...prevErrors, phone: error }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setGeneralError(''); // Clear any previous general errors
    setSuccessMessage(''); // Clear any previous success messages
  
    const apiUrl = `${baseURL}/Account/CreateAccountForUser`;
    const tokenUrl = `${baseURL}/Account/SendToken`;
  
    // Validate all fields before submitting
    const validationErrors: Errors = {
      fullName: validateField('fullName', fullName),
      emailAddress: validateField('email', emailAddress),
      password: validateField('password', password),
      confirmPass: validateField('confirmPass', confirmPassword),
      phone: validateField('phone', phoneNumber),
      referalCode: validateField('referalCode', referalCode),
    };
  
    if (Object.values(validationErrors).some((error) => error !== undefined)) {
      setErrors(validationErrors);
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          emailAddress,
          phoneNumber,
          password,
          confirmPassword,
          country,
          countryCode,
          referalCode,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.succeeded) {
        // Save email and token to localStorage
        window.localStorage.setItem("email", data.data.emailAddress);
        window.localStorage.setItem("token", data.data.jwtToken);
  
        // Request for the token using the user's email address
        const tokenResponse = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailAddress: data.data.emailAddress,
          }),
        });
  
        const tokenData = await tokenResponse.json();
  
        if (tokenResponse.ok && tokenData.succeeded) {
          setSuccessMessage('Account created successfully and token sent');
          navigate('/VerifyEmail');
        } else {
          setGeneralError(tokenData.message || 'An error occurred while sending the token');
        }
      } else {
        setGeneralError(data.message || 'An error occurred while creating the account');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setGeneralError('An error occurred while signing up');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center md:justify-start md:pl-10 bg-cover bg-center" style={{ backgroundImage: 'url(images/formbanner.png)' }}>
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border p-6 space-y-4 md:space-y-6 mx-5 mt-5 md:mx-10 md:my-10">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" />
        </div>
        <div className="my-1 flex justify-center text-lg font-medium leading-tight tracking-tight text-gray-900 md:text-xl">
          Create an Account
        </div>
        <div className="flex justify-center text-sm leading-tight tracking-tight text-gray-900 my-1">
          You are just a step closer, let's get you started.
        </div>
        
        {/* Display general error message if there is one */}
        {generalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{generalError}</span>
          </div>
        )}
        
        {/* Display success message if there is one */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        
        <form className="space-y-4 md:space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={fullName}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-base  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Full Name"
              required
            />
            {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={emailAddress}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Email Address"
              required
            />
            {errors.emailAddress && <p className="text-red-600 text-sm">{errors.emailAddress}</p>}
          </div>
          <div>
            <PhoneInput
              country={'us'}
              value={phoneNumber}
              onChange={handlePhoneChange}
              inputClass="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            />
            {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>
          <div>
            <input
              type="password"
              name="confirmPass"
              id="confirmPass"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required
            />
            {errors.confirmPass && <p className="text-red-600 text-sm">{errors.confirmPass}</p>}
          </div>

            <div>
            <input
              type="text"
              name="referalCode"
              id="referalCode"
              value={referalCode}
              onChange={handleChange}
              placeholder="Referal Code (optional)"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        
              pattern='^[a-zA-Z0-9]*$'
              maxLength={10}
            />
            
          </div>
          <div>
            <button disabled={loading} type="submit" className="bg-customBlue text-white p-2.5 rounded-md w-full flex items-center justify-center space-x-2">
              <span>Create Account</span>
              {loading && (
                <LineWave
                  visible={true}
                  height="40"
                  width="40"
                  color="#fff"
                  ariaLabel="line-wave-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  firstLineColor=""
                  middleLineColor=""
                  lastLineColor=""
                />
              )}
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <p className="px-4">OR </p>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        <div className="flex justify-center space-x-4">
          <GoogleLogin
            
        
            onSuccess={handleGoogleSignUp}
            onError={() => setGeneralError('Google Sign-up failed.')}
          />
 
        </div>
        <div className="flex items-center justify-center">
          <p className="px-4">You already have an account? <a href="/SignIn" className='text-customBlue hover:text-blue-500'>Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;