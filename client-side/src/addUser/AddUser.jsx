import React, { useState } from "react";
import "./addUser.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

const AddUser = () => {
  const users = {
    name: "",
    email: "",
    address: "",
  };

  const [user, setUser] = useState(users);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setUser({ ...user, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    await axios
      .post("http://127.0.01:6000/createUser", user)
      .then((response) => {
        setTimeout(() => {
          console.log("User created successfully", response.data);
          handleSuccess("User Created Successfully");
          navigate("/userTable");
        }, 1000);
      })
      .catch((error) => {
        console.log("Error :", error);
      });
  };
  return (
    <div className="addUser">
      <Link to="/" type="button" className="btn btn-secondary">
        <i class="fa-solid fa-backward"></i> Back
      </Link>

      <Link
        to="http://127.0.01:6000/users"
        type="button"
        className="btn btn-info mx-5"
      >
        <i class="fa-solid fa-backward"></i> Back
      </Link>

      <h3>Add New Users</h3>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={inputHandler}
            autoComplete="off"
            placeholder="Enter Your Name..."
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            onChange={inputHandler}
            name="email"
            autoComplete="off"
            placeholder="Enter Your Email..."
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            onChange={inputHandler}
            name="address"
            autoComplete="off"
            placeholder="Enter Your Address..."
          />
        </div>
        <div className="inputGroup">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddUser;
