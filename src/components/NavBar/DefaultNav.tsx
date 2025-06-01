import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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


const DefaultNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
 
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  return (

    <nav className="bg-white w-full z-20 top-0 start-0 border-b border-gray-200 sticky">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="images/logo.png" className="h-12 md:ml-10" alt="Logo" />
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

          <button
            onClick={toggleMenu}
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
        <div
          className={`items-center justify-between ${menuOpen ? '' : 'hidden'} w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <a
                href="/"
                className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                aria-current="page"
              >
                <span className="flex items-center">
                  <img src={home} className="h-5 mr-2" /> Home
                </span>
              </a>
            </li>
            <li>
              <a
                href="/Search"
                className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                aria-current="page"
              >
                <span className="flex items-center">
                  <img src={search} className="h-5 mr-2" /> Search
                </span>
              </a>
            </li>
            <li>
              <a
                href="/CreateCampaign"
                className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                aria-current="page"
              >
                <span className="flex items-center">
                  <img src={plus} className="h-5 mr-2" /> Create Campaign
                </span>
              </a>
            </li>
            <li>
              <a
                href="/Feed"
                className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                aria-current="page"
              >
                <span className="flex items-center">
                  <img src={feed} className="h-5 mr-2" /> My Feed
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={toggleSidebar}
                href="#"
                className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                aria-current="page"
              >
                <span className="flex items-center">
                  <img src={account} className="h-5 mr-2" /> My Account
                </span>
              </a>
            </li>
            <li>
              <a
                href="/Notifications"
                className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                aria-current="page"
              >
                <span className="flex items-center">
                  <img src={bell} className="h-5 mr-2" /> Notification
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  )
}

export default DefaultNav


