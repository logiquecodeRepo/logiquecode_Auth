import React from "react";

const Footer = () => {
  return (
    <footer className="absolute bottom-0 left-0 right-0 text-slate-700 flex justify-center items-center">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <p className="text-center mb-1">
          © 2024{" "}
          <a
            href="https://www.logiquecode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-700 font-medium hover:text-slate-800"
          >
            LogiqueCode
          </a>
          . All rights reserved.
        </p>
        <ul className="flex justify-center space-x-6">
          <li>
            <a
              href="https://www.logiquecode.com/index.php#about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-800"
            >
             <i className="fa-solid fa-circle-info mr-1"></i> About Us
            </a>
          </li>
          <li>
            <a
              href="https://www.logiquecode.com/index.php#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-800"
            >
              <i className="fa-solid fa-envelope mr-1"></i>Contact
            </a>
          </li>
          <li>
            <a
              href="https://www.logiquecode.com/index.php#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-800"
            >
             <i class="fa-solid fa-lock mr-1"></i> Privacy Policy
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
