import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa"; // Icons for different statuses

const DynamicModal = ({ status, title, description, onClose }) => {
  // Determine the icon and color based on the status
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <FaCheckCircle className="text-green-500" size={40} />;
      case "error":
        return <FaTimesCircle className="text-red-500" size={40} />;
      case "info":
        return <FaInfoCircle className="text-blue-500" size={40} />;
      case "warning":
        return <FaExclamationTriangle className="text-yellow-500" size={40} />;
      default:
        return <FaInfoCircle className="text-gray-500" size={40} />;
    }
  };

  // Determine the button color based on the status
  const getButtonClasses = () => {
    switch (status) {
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "error":
        return "bg-red-500 hover:bg-red-600";
      case "info":
        return "bg-blue-500 hover:bg-blue-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full z-10">
        <div className="flex flex-col items-center">
          {/* Icon */}
          <div className="mb-4">{getStatusIcon()}</div>
          {/* Title */}
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          {/* Description */}
          <p className="text-gray-700 mb-4 text-center">{description}</p>
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`${getButtonClasses()} text-white py-2 px-4 rounded`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicModal;
