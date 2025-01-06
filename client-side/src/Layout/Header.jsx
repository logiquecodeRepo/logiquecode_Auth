import React from "react";
import "../Css/Header.css"; // CSS file for styling

function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        {/* Left Side - Logo */}
        <div className="logo-container">
          <img
            src="/LogiqueCode.png" // Replace with your logo path
            alt="LogiqueCode Logo"
            className="logo"
          />
        </div>

        {/* Right Side - Welcome Text */}
        <div className="welcome-container">
          <a href="https://logiquecode.com" target="_blank" className="welcome-text">
            Welcome to LogiqueCode LLP
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
