import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAuthenticated } from "../authentication/auth";
import DefaultNav from './DefaultNav';
import GuestNavbar from "./GuestNavBar";
import AuthBar from "./AuthBar";
import close from '../svg/close.svg';
import editPen from '../svg/editPen.svg';
import profile from '../svg/profile.svg';
import money from '../svg/money.svg';
import deleteAccount from '../svg/deleteAccount.svg';
import wallet from '../svg/wallet.svg';
import battery from '../svg/battery.svg';
import support from '../svg/support.svg';
import Logout from "../authentication/Logout";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
 // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userData:any = window.localStorage.getItem("userData");
  const token = userData ? JSON.parse(userData).jwtToken : null;
  const userName = userData ? JSON.parse(userData).fullName : null;
  const [isSidebarOpen, setISidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const parsedUserData = JSON.parse(userData);
  const [logoutModal, setLogoutModal] = useState(false)
  const toggleSidebar = () => {
    setISidebarOpen(!isSidebarOpen);
  };

  const closeLogoutModal = () =>  setLogoutModal(false);

  const openLogoutModal = () => {
    setISidebarOpen(false)
    setDropdownOpen(false)
    setLogoutModal(true)


}


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    navigate("/SignIn");
    toast.success("Logged out successfully"); 
  };

  const isUserAuthenticated = isAuthenticated();
  

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (fullName: string) => {
    if(fullName){
      const names = fullName.split(' ');
      const initials = names.map(name => name[0]).join('');
      return initials.toUpperCase();
    }
  
};



  return (
    <>
   
       
       { isUserAuthenticated ? (<AuthBar toggleSidebar={toggleSidebar} />) : (<GuestNavbar />)}
      

      {/* Sidebar */}
      <div className={`fixed z-20 inset-0 bg-black bg-opacity-50 transition-opacity duration-[2000ms]ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Close Button */}
       
        <span className={`fixed top-1/2 transform -translate-y-1/2 p-2 text-white rounded transition-transform duration-[2000ms] ease-in-out ${isSidebarOpen ? 'right-80 translate-x-0' : 'right-0 translate-x-full'}`} onClick={toggleSidebar}>
          <img src={close} alt="x" width={40} height={40} />
        </span>
     
      </div>

      {/* Sidebar */}
      <div className={`fixed z-40 top-0 right-0 h-full bg-white text-CustomBlue w-80 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-[100ms] ease-in-out`}>
        <div className="flex flex-col justify-center items-center">
          <div className="relative inline-block mt-10">
          {parsedUserData?.imageUrl ? (
            <img className="rounded-full border-2 border-white" style={{ boxShadow: '0 0 0 1px #0D236E' }} src={parsedUserData?.imageUrl} width={45} height={45} alt="Avatar" />
          ):(
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full text-customBlue p-2">
            {getInitials(parsedUserData?.fullName)}
            </div>
          )
        }

             
          </div>
          <div className="my-2">
            <p className="font-bold text-center"> {userName}</p>
            <p className="text-center text-xs"> {userData ? JSON.parse(userData).occupation : null}</p>
          </div>
          <div>
            <ul className="py-2 space-y-2 text-sm mx-4 text-gray-800" aria-labelledby="dropdownDefaultButton">
              <li className="hover:bg-gray-100 rounded-lg">
                <Link to="/MyProfile" className="block px-16 py-2">
                  <img src={profile} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle"> My Profile </span>
                </Link>
              </li>
              <li className="hover:bg-gray-100 rounded-lg">
                <Link to="/Earnings" className="block px-16 py-2">
                  <img src={money} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle"> My Earnings </span>
                </Link>
              </li>
              <li className="hover:bg-gray-100 rounded-lg">
                <Link to="/wallet" className="block px-16 py-2">
                  <img src={wallet} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle"> My Wallet </span>
                </Link>
              </li>
              <li className="hover:bg-gray-100 rounded-lg">
                <Link to="/SharedCampaigns"  className="block px-16 py-2">
                  <img src={battery} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle"> Shared Campaigns </span>
                </Link>
              </li>
              <li className="hover:bg-gray-100 rounded-lg">
                <Link to="/support" className="block px-16 py-2">
                  <img src={support} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle"> Support </span>
                </Link>
              </li>
              <li className="hover:bg-gray-100 rounded-lg">
                <a onClick={openLogoutModal} href="#" className="block px-16 py-2">
                  <img src={deleteAccount} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle text-red-700"> Logout </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Logout
             isOpen={logoutModal}
             onClose={closeLogoutModal}
         />
    </>
  );
}

export default Navbar;
