import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import Footer from "../Components/Footer";

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
  const [showPassword, setShowPassword] = useState(false);   // Show password 

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
    <div className="flex flex-col lg:flex-row min-h-screen items-center justify-around p-2 bg-gray-100">
      {/* Top-left Image and Title */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <img src="/LogiqueCode.png" alt="Image" className="w-13 h-10" />
        <h4 className="text-3xl font-semibold mb-1">
          <a
            href="https://logiquecode.com"
            className="text-slate-700 no-underline"
          >
            LogiqueCode
          </a>
        </h4>
      </div>

      {/* Left Image Container */}
      <div className="hidden lg:flex w-1/2 justify-center">
        <img
          src="/login_img_second.svg"
          alt="Image"
          className="max-w-xs md:max-w-md"
        />
      </div>

      {/* Right Form Container */}
      <div className="w-full lg:w-1/3 bg-white p-8 rounded-lg shadow-md max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-700 mb-6">
          LC_AUTH Sign-In
        </h1>
        <form onSubmit={handleLogIn} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="username"
              onChange={handleChange}
              id="username"
              placeholder="Enter your Username..."
              value={loginInfo.username}
              className="w-full p-3 border-b-2 focus:outline-none border-slate-700"
            />
            <i className="fa-solid fa-user absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-700"></i>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              id="password"
              placeholder="Enter your password..."
              value={loginInfo.password}
              className="w-full p-3 border-b-2 border-slate-700 focus:outline-none"
            />
            <i
              className={`fa-solid ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              } absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-700 cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              name="otp"
              id="otpInput"
              placeholder="Enter Your OTP..."
              value={loginInfo.otp}
              onChange={handleOTPChange}
              className="w-full p-3 border-b-2 border-slate-700 focus:outline-none "
            />
            <span
              id="otpButton"
              onClick={handleOTP}
              className="absolute top-0 right-0 px-4 py-2 bg-slate-700 text-white rounded-lg cursor-pointer hover:bg-slate-800"
            >
              <i className="fa-solid fa-paper-plane"></i> {/* Send OTP icon */}
              <span>OTP</span>
            </span>
          </div>
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
              onChange={handleReCAPTCHA}
              className="g-recaptcha"
            />
          </div>
          <button
            type="submit"
            disabled={!isOTPVerified}
            className="w-full bg-slate-700 cursor-pointer text-white p-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <i className="fa-solid fa-sign-in-alt"></i> {/* Sign-in icon */}
            <span>Log In</span>
          </button>
        </form>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
