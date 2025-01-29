import React from "react";
import { handleSuccess } from "../utils";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    handleSuccess("User Logout Successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  return (
    <>
      <button className="text-slate-700 pt-2 font-semibold cursor-pointer hover:text-slate-950" onClick={handleLogout}>
        <i className="fa-solid fa-right-from-bracket text-slate-900 mr-1"></i> Log
        Out
      </button>
    </>
  );
};

export default Logout;
