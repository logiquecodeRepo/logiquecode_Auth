import React from "react";
import "../Css/Footer.css"; // Optional CSS for styling

const Footer = () => {
  return (
    <div class="footer-container">
      <div class="footer-content">
        <p>© 2024 <a href="https://www.logiquecode.com" target="_blank">Logiquecode LLP</a>. All rights reserved.</p>
        <ul class="footer-links">
          <li>
            <a href="https://www.logiquecode.com/index.php#about" target="_blank">About Us</a>
          </li>
          <li>
            <a href="https://www.logiquecode.com/index.php#contact" target="_blank">Contact</a>
          </li>
          <li>
            <a href="https://www.logiquecode.com/index.php#" target="_blank">Privacy Policy</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
