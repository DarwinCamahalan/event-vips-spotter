// HeaderRow.jsx
import React from "react";
import { FaUserCheck, FaTv } from "react-icons/fa"; // Import icons

const HeaderRow = ({ commonPadding }) => {
  return (
    <div className="flex justify-between items-center mb-4 space-x-2">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Button container - side by side on all screen sizes */}
      <div className="flex space-x-2">
        {/* View Display Button */}
        <button
          onClick={() => (window.location.href = "/display")}
          className={`flex items-center justify-center bg-gray-800 text-white ${commonPadding} rounded hover:bg-gray-700`}
        >
          <FaTv className="mr-2" /> Display
        </button>

        {/* Spot Attendees Button */}
        <button
          onClick={() => (window.location.href = "/spotter")}
          className={`flex items-center justify-center bg-green-800 text-white ${commonPadding} rounded hover:bg-green-700`}
        >
          <FaUserCheck className="mr-2" /> Spotter
        </button>
      </div>
    </div>
  );
};

export default HeaderRow;
