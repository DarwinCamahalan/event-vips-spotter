import React from "react";
import { FaExclamationTriangle } from "react-icons/fa"; // Import the warning icon

const ConfirmationModal = ({ title, description, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full z-10">
        <div className="flex flex-col items-center">
          {/* Warning Icon */}
          <FaExclamationTriangle className="text-red-500 mb-2" size={40} />
          {/* Title */}
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          {/* Description */}
          <p className="text-gray-700 mb-6 text-center">{description}</p>
          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={onCancel}
              className="bg-green-600 text-white py-2 px-10 rounded hover:bg-green-700"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white py-2 px-10 rounded hover:bg-red-600"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
