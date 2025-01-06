import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import "../Css/Home.css";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Set the API base URL here
  console.log("api url", API_BASE_URL);

  useEffect(() => {
    const user = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      setLoggedInUser(user);
      fetchUserDetails();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    handleSuccess("User LoggedOut");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/projects/getProjectsDetails`; // Use the base URL here
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const response = await fetch(url, headers);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleError("Unauthorized access, please login again.");
          navigate("/login");
        } else {
          throw new Error(`Error: ${response.statusText}`);
        }
      }

      const result = await response.json();
      setProjects(result.data?.projects || []);
    } catch (err) {
      handleError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const handleProjectClick = (project) => {
    const { name, serverUrl } = project;
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("name");

    if (["DPMS", "LMS", "Chemist", "CRM", "Other"].includes(name)) {
      // Set token and username in cookies
      setCookie("authToken", token, 1);
      setCookie("username", username, 1);

      // Redirect to project serverUrl
      window.open(serverUrl, "_blank");
    } else {
      handleError("Unknown project");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="wholeContainer">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-content">
          <div className="logo-container">
            <img
              src="/LogiqueCode.png" // Replace with the actual logo path
              alt="Logo"
              className="logo"
            />
          </div>
          <div className="user-info">
            <span className="welcome-message">Welcome, {loggedInUser}!</span>
            <div className="user-icon-container" onClick={toggleDropdown}>
              <i className="fa-regular fa-circle-user user-icon"></i>
              {showDropdown && (
                <div className="dropdown-menu open">
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main-container">
        <h3 className="main-heading">Select a Project:</h3>
        <div className="projects-container">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div
                key={index}
                className="project-card"
                onClick={() => handleProjectClick(project)}
              >
                <h4>{project.name}</h4>
              </div>
            ))
          ) : (
            <p>No projects available.</p>
          )}
        </div>
      </main>

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
  );
}

export default Home;
