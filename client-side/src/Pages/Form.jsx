import { useState } from "react";
import { UserPlus } from "lucide-react"; // Lucide-react se icon import karein
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import { FaUserAlt, FaUserTie } from "react-icons/fa";
import { FaFileInvoiceDollar, FaIdCard, FaFileContract } from "react-icons/fa";
import { FaRoad, FaCity, FaMapMarkedAlt } from "react-icons/fa";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Form = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    phone: "",
    registration: "",
    street: "",
    city: "",
    state: "",
    pin: "",
    pan: "",
    tan: "",
    gst: "",
    gender: "",
    document: null,

    // project: [], // Selected projects ko store karne ke liye
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // File upload handle karne ke liye
  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  // Checkbox change handle karne ke liye
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => {
      const updatedProjects = checked
        ? [...prevState.project, name] // Checkbox checked hone par add karega
        : prevState.project.filter((proj) => proj !== name); // Unchecked hone par remove karega

      return { ...prevState, project: updatedProjects };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: formDataToSend, // Sending FormData
      });

      if (!response.ok) {
        try {
          const errorData = await response.json(); // Parse JSON response
          console.error("Server Response:", errorData);
          alert(`Error: ${errorData.message || "Unknown error occurred"}`);
        } catch (error) {
          console.error("Error parsing response:", error);
          alert(`Error: Unexpected response from server`);
        }
        return;
      }

      const data = await response.json();
      alert("User registered successfully!");

      setFormData({
        firstname: "",
        middlename: "",
        lastname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        gender: "",
        gst: "",
        pan: "",
        tan: "",
        street: "",
        city: "",
        state: "",
        pin: "",
        registration: "",
        document: null,
        // project: [],
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Header />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[1200px] max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-center gap-2 text-gray-800 border-b pb-2 text-4xl font-semibold">
          <UserPlus className="w-8 h-8" />
          <h2 className="text-center">Create User</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-lg font-semibold text-black mb-2 pt-4">
                User Type *
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-lg"
              >
                <option value="" disabled className="text-xl font-bold">
                  Select User Type
                </option>
                <option value="Admin" className="text-lg font-bold">
                  Admin
                </option>
                <option value="Reseller" className="text-lg font-bold">
                  Reseller
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                Username *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg outline-none"
                />
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password" // Suggested by the browser
                  required
                  className="mt-2 w-full px-4 py-2  border border-gray-300 rounded-lg outline-none"
                />
                <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                First Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                Middle Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="middlename"
                  value={formData.middlename}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <FaUserAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                Last Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <FaUserTie className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                Phone *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <FaPhone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                Registration Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="registration"
                  value={formData.registration}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <FaIdCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                Street *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg outline-none"
                />
                <FaRoad className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                City *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg outline-none"
                />
                <FaCity className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                State *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg outline-none"
                />
                <FaMapMarkedAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                PIN Code *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <FaFileInvoiceDollar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                PAN Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <FaIdCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                TAN Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="tan"
                  value={formData.tan}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />

                <FaFileContract className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 items-center">
            <div className="relative">
              <label className="block text-lg font-semibold text-black">
                GST Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <FaFileInvoiceDollar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-black mb-2 pt-4">
                Project *
              </label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-lg"
              >
                <option value="" disabled className="text-3xl font-bold">
                  Select Project
                </option>
                <option value="lms" className="text-lg font-bold">
                  LMS
                </option>
                <option value="dpms" className="text-lg font-bold">
                  DPMS
                </option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold text-black">
                Upload Document *
              </label>
              <input
                type="file"
                name="document"
                onChange={handleFileChange}
                required
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col w-full">
              <label className="block text-lg font-semibold text-black mb-2">
                Gender *
              </label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                    required
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Male</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                    required
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Female</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === "Other"}
                    onChange={handleChange}
                    required
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Other</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-900 text-white py-2 px-8 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 cursor-pointer"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Form;
