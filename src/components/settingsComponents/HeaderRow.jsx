// HeaderRow.jsx
import React from "react";
import { FaUserCheck } from "react-icons/fa";

const HeaderRow = ({ commonPadding }) => {
  return (
    <div className="flex justify-between items-center mb-4 ">
      <h2 className="text-2xl font-bold">Settings</h2>
      <button
        onClick={() => (window.location.href = "/spotter")}
        className={`flex items-center bg-green-800 text-white ${commonPadding} rounded hover:bg-green-700`}
      >
        <FaUserCheck className="mr-2" /> Spot Attendees
      </button>
    </div>
  );
};

export default HeaderRow;
