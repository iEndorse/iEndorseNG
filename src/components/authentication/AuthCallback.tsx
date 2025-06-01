import React, { useEffect } from 'react';
import { account } from '../../appwrite';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const completeOAuthLogin = async () => {
        try {
          // Ensure user is authenticated
          const session = await account.getSession('current');
          console.log('OAuth session:', session);
      
          if (!session) {
            toast.error('No session available');
          }
          window.localStorage.setItem('userData', JSON.stringify(session));
          toast.success('Successfully signed in!');
          navigate('/');
        } catch (error) {
          console.error('Error completing OAuth login:', error);
          toast.error('error completing login');
          navigate('/signin');
        }
      };
    completeOAuthLogin();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Completing sign-in...</p>
    </div>
  );
};

export default AuthCallback;
