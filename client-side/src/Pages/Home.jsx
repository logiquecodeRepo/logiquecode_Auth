import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../utils";
import { ToastContainer } from "react-toastify";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      handleError("Please Login");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      fetchUserDetails();
    }

    // Listen for screen resize to determine if it's desktop
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/projects/getProjectsDetails`;
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

    if (["DPMS", "LMS", "CMRKS", "CRM", "Other"].includes(name)) {
      setCookie("authToken", token, 1);
      setCookie("username", username, 1);
      window.open(serverUrl, "_blank");
    } else {
      handleError("Unknown project");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ml-5 mr-5">
      {/* Header with menu toggle handler */}
      <Header onMenuToggle={setMenuOpen} />

      {/* Main Content - Move only for desktop */}
      <main
        className={`p-6 mt-16 shadow shadow-slate-700 rounded-lg bg-gray-50 transition-all duration-300 ${
          isDesktop && menuOpen ? "ml-64" : "ml-0"
        }`}
      >
        <h3 className="main-heading text-2xl font-semibold text-gray-700 mb-4">
          LogiqueCode Projects
          <i class="fa-solid fa-rocket ml-2"></i>
        </h3>
        <div className="projects-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div
                key={index}
                className="project-card p-4 bg-white shadow-md rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <h4 className="flex justify-between items-center text-lg font-semibold text-gray-800">
                  {project.name} <i className="fa-solid fa-paper-plane"></i>
                </h4>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No projects available.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default Home;
