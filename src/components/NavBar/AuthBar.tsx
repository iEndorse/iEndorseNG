import React, { useState, useEffect , useRef} from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import bell from '../svg/bell.svg';
import home from '../svg/home.svg';
import search from '../svg/search.svg';
import plus from '../svg/plus.svg';
import feed from '../svg/feed.svg';
import account from '../svg/account.svg';
import close from '../svg/close.svg'
import editPen from '../svg/editPen.svg'
import profile from '../svg/profile.svg';
import money from '../svg/money.svg'
import deleteAccount from '../svg/deleteAccount.svg';
import wallet from '../svg/wallet.svg';
import battery from '../svg/battery.svg';
import support from '../svg/support.svg';
import Initials from "../Initials";
import Logout from "../authentication/Logout";


const AuthBar= ({toggleSidebar}:any)=> {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const userData:any = window.localStorage.getItem("userData");
    const token = userData ? JSON.parse(userData).jwtToken : null;
    const userName = userData ? JSON.parse(userData).fullName : null;
    const userImage = userData ? JSON.parse(userData).imageUrl : null;
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
      const toggleMenu = () => {
        setMenuOpen(!menuOpen);

      };


    

    
      useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))  {
            setDropdownOpen(false);
            setMenuOpen(false)
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
  
    return(
      <>
 
<nav className="bg-white w-full z-20 border-b border-gray-200 transition-all duration-300  fixed top-0 left-0 shadow-md">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    {/* Logo Section */}
    <Link to="/" className="flex items-center">
      <img src="https://res.cloudinary.com/dgso4wgqt/image/upload/v1745070101/logo_wrwd9z.png" className="h-8 sm:h-10 md:h-12 md:ml-10" alt="iendorse" />
    </Link>

    {/* Profile and Mobile Menu Section */}
    <div className="flex items-center gap-4 lg:order-2">
      {token ? (
        // Authenticated User Display
        <div className="relative inline-block text-left">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => {
              toggleSidebar();
              setMenuOpen(false);
            }}
          >
            <div className="flex items-center z-1">
              {userImage ? (
                <img 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white" 
                  style={{ boxShadow: '0 0 0 1px #0D236E' }}
                  src={userImage} 
                  alt="Avatar" 
                />
              ) : (
                <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 rounded-full text-customBlue">
                  <Initials fullName={userName} className="text-xs" />
                </div>
              )}
              <span className="hidden sm:block ml-2 text-sm text-gray-700">{userName}</span>
            </div>
          </div>
        </div>
      ) : (
        // Sign In Button for Non-authenticated Users
        <Link 
          to="/signin" 
          className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-medium text-white bg-customBlue rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-colors"
        >
          Sign in
        </Link>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        aria-controls="navbar-sticky"
        aria-expanded={menuOpen}
      >
        <span className="sr-only">Open main menu</span>
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
    </div>

    {/* Navigation Menu */}
    <div
      className={`${
        menuOpen ? 'block' : 'hidden'
      } w-full lg:flex lg:w-auto lg:order-1`}
      id="navbar-sticky"
    >
      <ul className="flex flex-col p-4 lg:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 lg:flex-row lg:space-x-8 lg:mt-0 lg:border-0 lg:bg-white">
        {[
          { to: '/', label: 'Home', icon: home },
          { to: '/Search', label: 'Search', icon: search },
          { to: '/CreateCampaign', label: 'Create Campaign', icon: plus },
          { to: '/Feed', label: 'My Feed', icon: feed },
          {
            label: 'My Account',
            icon: account,
            onClick: () => {
              toggleSidebar();
              setMenuOpen(false);
            },
          },
          { to: '/Notifications', label: 'Notification', icon: bell },
        ].map((item, index) => (
          <li key={index}>
            {item.to ? (
              <Link
                to={item.to}
                className="flex items-center py-2 px-3 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0"
              >
                <img src={item.icon} className="h-5 w-5 mr-2" alt={`${item.label} icon`} />
                <span className="text-sm">{item.label}</span>
              </Link>
            ) : (
              <button
                onClick={item.onClick}
                className="flex w-full items-center py-2 px-3 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0"
              >
                <img src={item.icon} className="h-5 w-5 mr-2" alt={`${item.label} icon`} />
                <span className="text-sm">{item.label}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
</nav>
  
      </>
  
    )
} 

export default AuthBar

    
