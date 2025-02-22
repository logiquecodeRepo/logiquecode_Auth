import React, { useEffect, useState, useRef } from "react";
import Logout from "./Logout";

const Header = ({ onMenuToggle }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // User dropdown
  const [showAdminDropdown, setShowAdminDropdown] = useState(false); // Admin User dropdown
  const [username, setUsername] = useState("");

  const menuRef = useRef(null);
  const userDropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem("name");
    setUsername(username);
  }, []);

  // Toggle sidebar menu
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
    onMenuToggle(!showMenu);
  };

  // Toggle user dropdown
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setShowAdminDropdown(false); // Close admin dropdown when opening user dropdown
  };

  // Toggle Admin User dropdown
  const toggleAdminDropdown = () => {
    setShowAdminDropdown((prev) => !prev);
    setShowDropdown(false); // Close user dropdown when opening admin dropdown
  };

  // Close menu and dropdowns when clicking outside
  const closeDropdownAndMenu = (event) => {
    if (
      !menuRef.current?.contains(event.target) &&
      !userDropdownRef.current?.contains(event.target) &&
      !adminDropdownRef.current?.contains(event.target) &&
      !menuButtonRef.current?.contains(event.target)
    ) {
      setShowDropdown(false);
      setShowAdminDropdown(false);
      setShowMenu(false);
      onMenuToggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdownAndMenu);
    return () => {
      document.removeEventListener("click", closeDropdownAndMenu);
    };
  }, []);

  return (
    <>

    {/* header  */}

    {/* updated code */}
      <header className="bg-white border-b border-gray-300 px-6 py-2 fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center">
          {/* Left Side: Logo and Menu Icon */}
          <div className="flex items-center space-x-2">
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="text-slate-700 text-3xl cursor-pointer"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="logo-container">
              <img src="/LogiqueCode.png" alt="Logo" className="w-10 h-auto" />
            </div>

            <div className="font-semibold text-xl"><a href="https://www.logiquecode.com" target="_blank" className="text-slate-700 no-underline">LogiqueCode</a></div>
          </div>

          {/* Right Side: User Info and Icon */}
          <div className="flex items-center space-x-4">
            {/* <span className="text-slate-700 font-semibold">{`Welcome, ${username}!`}</span> */}
            <div className="relative" ref={userDropdownRef}>
              <i
                className="fa-regular fa-circle-user text-slate-700 cursor-pointer text-3xl"
                onClick={toggleDropdown}
              ></i>
              {showDropdown && (
                <div className="absolute right-0 p-3 mt-2 w-40 bg-white border border-gray-300 text-slate-700 rounded-lg shadow-lg z-10 transition-transform duration-300 ease-in-out">
                  <div className="text-slate-700 pb-2 font-medium">
                    <i className="fas fa-user mr-1"></i> {username}
                  </div>
                  <div className="border-b border-slate-900"></div>
                  <Logout />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      <ul
        ref={menuRef}
        className={`fixed left-0 top-13 h-full border-r border-gray-300 bg-white text-slate-950 p-6 w-64 transform transition-transform duration-300 ${
          showMenu ? "translate-x-0" : "-translate-x-64"
        } z-40`}
      >
        {/* Admin User Dropdown */}
        <li className="py-2 mb-1 cursor-pointer relative">
          <span
            className="flex items-center w-full"
            onClick={toggleAdminDropdown}
          >
            <i className="fas fa-user-cog mr-2"></i> Admin Users
            <i
              className={`fas fa-chevron-down ml-10 ${
                showAdminDropdown ? "rotate-180" : ""
              }`}
            ></i>
          </span>
          {showAdminDropdown && (
            <ul className="mt-2 ml-4 w-full bg-white shadow-md rounded-lg border border-gray-300 z-50 transition-all duration-1000 ease-in-out">
              <li className="py-2 px-4 hover:bg-gray-200">
                <a href="/form">
                  <i className="fas fa-user-plus mr-2"></i> Create Admin User
                </a>
              </li>
              <li className="py-2 px-4 hover:bg-gray-200">
                <a href="/showUsers">
                  <i className="fas fa-users mr-2"></i> Show Admin Users
                </a>
              </li>
            </ul>
          )}
        </li>

        <li className="py-2 mb-1 cursor-pointer">
          <a href="/services">
            <i className="fa-solid fa-handshake mr-2"></i> Services
          </a>
        </li>
        <li className="py-2 mb-1 cursor-pointer">
          <a href="/contact">
            <i className="fa-solid fa-envelope mr-2"></i> Contact
          </a>
        </li>
        <li className="py-2 mb-1 cursor-pointer">
          <a href="/about">
            <i className="fa-solid fa-circle-info mr-2"></i> About Us
          </a>
        </li>
      </ul>
    </>
  );
};

export default Header;
