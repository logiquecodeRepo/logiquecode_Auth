import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer } from "react-toastify";
import "../Css/Signup.css";
import { handleError, handleSuccess } from "../utils";
import Header from "../Layout/Header";

export default function Login() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  console.log("api url", apiUrl);

  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
    otp: "",
  });
  const [captchaToken, setCaptchaToken] = useState(""); // Store reCAPTCHA token
  const [isOTPVerified, setIsOTPVerified] = useState(false); // Track OTP verification

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleReCAPTCHA = (token) => {
    setCaptchaToken(token); // Save the token when captcha is completed
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    const { username, password } = loginInfo;

    if (!username || !password) {
      return handleError("username and Password are required!");
    }

    if (!captchaToken) {
      return handleError("Please complete the reCAPTCHA verification.");
    }

    try {
      // Use the API URL from the .env file
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const url = `${apiUrl}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...loginInfo, captchaToken }), // Send reCAPTCHA token
      });

      const result = await response.json();
      const { message, success, error, name, jwtToken } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("name", username);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message || error;
        handleError(details);
      } else {
        handleError(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      handleError("An error occurred while logging in.");
    }
  };

  const handleOTP = async (e) => {
    e.preventDefault();
    const { username } = loginInfo;

    if (!username) {
      return handleError("username is required!");
    }

    try {
      // Use the API URL from the .env file
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const url = `${apiUrl}/otp/sendOtp`;
      const response = await fetch(url, {
        method: "POST", // Use POST method to send data
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }), // Send username in the body
      });

      const result = await response.json(); // Parse the response body
      const { message, success, generatedOtp } = result;

      if (success) {
        handleSuccess("OTP SENT!");
        localStorage.setItem("otp", generatedOtp);
      } else {
        handleError(message || "Failed to send OTP");
        localStorage.setItem("otp", generatedOtp);
      }
    } catch (err) {
      handleError("Internal server error");
    }
  };

  // verify otp
  const handleOTPChange = async (e) => {
    const { value } = e.target;

    // Update the OTP in the state
    setLoginInfo({ ...loginInfo, otp: value });

    // Check OTP length
    if (value.length === 6) {
      console.log("otp :", value, " username: ", loginInfo.username);
      try {
        // Use the API URL from the .env file
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const url = `${apiUrl}/otp/verifyotp`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: value, username: loginInfo.username }),
        });

        const result = await response.json();
        const localStorageOtp = localStorage.getItem("otp");
        const { message, success } = result;

        if (success || value === localStorageOtp) {
          handleSuccess("OTP verified successfully!");
          setIsOTPVerified(true); // Enable login button
        } else {
          handleError(message || "Failed to verify OTP.");
          setIsOTPVerified(false); // Ensure login button stays disabled
        }
      } catch (err) {
        handleError("Internal server error while verifying OTP.");
        setIsOTPVerified(false); // Ensure login button stays disabled
      }
    } else if (value.length > 6) {
      handleError("OTP cannot exceed 6 digits.");
      setIsOTPVerified(false); // Ensure login button stays disabled
    }
  };

  return (
    <div>
      <div className="main-container">
        <div className="img-title">
          <div className="img">
            <img src="/LogiqueCode.png" alt="Image" />
          </div>
          <div className="title">
            <h4>
              <a href="https://logiquecode.com">LogiqueCode</a>
            </h4>
          </div>
        </div>
        <div className="left-container">
          <div className="img-2">
            <img src="/login_img_second.svg" alt="Image" />
          </div>
        </div>

        <div className="right-container">
          <h1>Sign-In</h1>
          <form onSubmit={handleLogIn}>
            <div>
              {/* <label htmlFor="username">Username</label> */}
              <input
                type="text"
                name="username"
                onChange={handleChange}
                id="username"
                placeholder="Enter your Username..."
                value={loginInfo.username}
              />
              <i class="fa-solid fa-user"></i>
            </div>
            <div>
              {/* <label htmlFor="password">Password</label> */}
              <input
                type="password"
                name="password"
                onChange={handleChange}
                id="password"
                placeholder="Enter your password.."
                value={loginInfo.password}
              />
              <i class="fa-solid fa-lock"></i>
            </div>
            <div className="otp-button">
              <input
                type="text"
                name="otp"
                id="otpInput"
                placeholder="Enter Your OTP..."
                value={loginInfo.otp}
                onChange={handleOTPChange}
                // onChange={handleChange}
              />
              <span id="otpButton" onClick={handleOTP}>
                Send OTP
              </span>
            </div>
            <div className="mt-3">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
                onChange={handleReCAPTCHA}
                className="g-recaptcha"
              />
            </div>
            <button type="submit" disabled={!isOTPVerified}>
              LogIn
            </button>
          </form>
        </div>
        <div className="footer-items">
          <p>
            © 2024{" "}
            <a href="https://www.logiquecode.com" target="_blank">
              LogiqueCode
            </a>
            . All rights reserved.
          </p>
          <ul class="footer-links">
            <li>
              <a
                href="https://www.logiquecode.com/index.php#about"
                target="_blank"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="https://www.logiquecode.com/index.php#contact"
                target="_blank"
              >
                Contact
              </a>
            </li>
            <li>
              <a href="https://www.logiquecode.com/index.php#" target="_blank">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
