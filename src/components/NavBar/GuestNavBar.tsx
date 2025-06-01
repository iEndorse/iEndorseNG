import React, { useState, useEffect , useRef} from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import bg from '../../public/images/bg.svg';
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

const GuestNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const userData:any = window.localStorage.getItem("userData");
  const token = userData ? JSON.parse(userData).jwtToken : null;
  const userName = userData ? JSON.parse(userData).fullName : null;
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
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
    
   <nav className="bg-white w-full z-20 border-b border-gray-200 transition-all duration-300 fixed top-0 left-0 shadow-md">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    {/* Logo */}
    <Link to="/" className="flex items-center">
      <img 
        src="https://res.cloudinary.com/dgso4wgqt/image/upload/v1745070101/logo_wrwd9z.png" 
        className="h-8 md:h-10 lg:h-12 md:ml-10" 
        alt="Logo" 
      />
    </Link>

    {/* Sign In and Mobile Menu Button */}
    <div className="flex items-center gap-2 md:gap-4 md:order-2">
      <Link to="/SignIn">
        <button
          type="button"
          className="text-white bg-customBlue hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm transition-colors"
        >
          Sign in
        </button>
      </Link>

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
      <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 lg:flex-row lg:space-x-8 lg:mt-0 lg:border-0 lg:bg-white">
        {[
          { href: "/", icon: home, label: "Home" },
          { href: "/Search", icon: search, label: "Search" },
          { href: "/CreateCampaign", icon: plus, label: "Create Campaign" },
          { href: "/Feed", icon: feed, label: "My Feed" },
          { href: "/Notifications", icon: bell, label: "Notification" }
        ].map((item, index) => (
          <li key={index}>
            <Link
              to={item.href}
              className="flex items-center py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 text-xs md:text-sm transition-colors"
            >
              <img src={item.icon} className="h-4 md:h-5 mr-2" alt={`${item.label} icon`} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
</nav>
    </>
  );
}

export default GuestNavbar;