import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, } from 'react-router-dom';
import logo from './logo.svg';
import Home from "./components/Home/Home"
import SignUp from './components/authentication/SignUp';
import SignIn from './components/authentication/SignIn';
import Login from './components/authentication/SignIn';
import ConfirmOTP from './components/ConfirmOTP';
import ResetPassword from './components/authentication/ResetPassword';
import NewPasword from './components/authentication/NewPassword';
// import { Verify } from 'crypto';
import VerifyEmail from './components/authentication/VerifyEmail';
import ViewCampaign from './components/ViewCampaign/ViewCampaign';
import 'react-toastify/dist/ReactToastify.css';
import Notifications from './components/Notifications/Notifications';
import Search from './components/Search';
import CreateCampaign from './components/CreateCampaign/CreateCampaign';
import EditCampaign from './components/EditCampaign/EditCampaign';
import Feed from './components/Feeds/Feeds';
import Analytics from './components/Feeds/Analytics';
//import Analytics from './components/ViewCampaign/Analytics';
import Sidebar from './components/Sidebar';
import  MyProfile from './components/Profile/MyProfie';
import UserProfile from './components/Profile/UserProfile';
import HomeCampaign from './components/Home/HomeCampaign';
import Wallet from './components/Wallet/Wallet';
import Support from './components/Support';
import TransactionDetails from './components/Wallet/TranscationDetails';
import Earnings from './components/Earnings/Earnings';
import ProtectedRoute from './components/authentication/ProtectedRoute';
import {Sample} from './components/sample';
import AuthCallback from './components/authentication/AuthCallback';
import TandC from './components/TandC';
import CloudinaryApp from './components/CloudinaryApp';
import NotFound from './components/notfound';
import SharedCampaigns from './components/SharedCampaigns/SharedCampaigns';
import ViewSharedDetails from './components/SharedCampaigns/ViewSharedDetails';
import {Toaster,toast } from 'sonner'; 


function App() {

  return (
    <>
      <Router>
            <Toaster richColors position="bottom-left" />
        <Routes>

          {/* Protected routes
          <ProtectedRoute>  
            <Route path='/CreateCampaign' element={<CreateCampaign />} />
            <Route path='/UserProfile' element={<UserProfile />} />
            <Route path='/Wallet' element={<Wallet />} />
            <Route path='./Analytics/:uid' element={<Analytics />} />
            <Route path='/Notifications' element={<Notifications />} />
            <Route path='/Feed' element={<Feed />} />
          </ProtectedRoute> */}

          <Route element={<ProtectedRoute />}>
            <Route path='/EditCampaign' element={<EditCampaign />} />
            <Route path='/CreateCampaign' element={<CreateCampaign />} />
            <Route path='/SharedCampaigns' element={<SharedCampaigns />} />
            <Route path='/shared-campaign-details/:uid' element={<ViewSharedDetails />} />
            <Route path='/MyProfile' element={<MyProfile />} />
            <Route path='/Wallet' element={<Wallet />} />
            <Route path='Feed/Analytics/:uid' element={<Analytics />} />
            <Route path='/Notifications' element={<Notifications />} />
            <Route path='/Feed' element={<Feed />} />
            <Route path='/Earnings' element={<Earnings />} />
            <Route path='TransactionDetails' element={<TransactionDetails />} />
         
          </Route>
          
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path='/auth-callback' element={<AuthCallback />} />
       

          <Route path='/SignIn' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/ConfirmOTP' element={<ConfirmOTP />} />
          <Route path='/ResetPassword' element={<ResetPassword />} />
          <Route path='/VerifyEmail' element={<VerifyEmail />} />
          <Route path='/NewPassword' element={<NewPasword />} />
          <Route path='/Search' element={<Search />} />
    
          <Route path='/UserProfile/:userId' element={<UserProfile />} />

          <Route path='/ViewCampaign/:uid' element={<ViewCampaign />} />
          <Route path='/Support/' element={<Support />} />
          <Route path='/sample' element={<Sample />} />
          <Route path='/TermsAndConditions' element={<TandC />} />
          <Route path='/CloudinaryApp' element={<CloudinaryApp />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
