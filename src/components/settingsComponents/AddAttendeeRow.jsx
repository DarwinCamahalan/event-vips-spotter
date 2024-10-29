// AddAttendeeRow.jsx
import React from "react";
import { FaUserPlus } from "react-icons/fa";

const AddAttendeeRow = ({
  addAttendee,
  inputValue,
  setInputValue,
  commonPadding,
}) => {
  // Function to convert to sentence case
  const toSentenceCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 hidden md:block">
        Add Attendee
      </h3>
      <div className="flex mt-8 items-center mb-2 md:hidden">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 font-semibold text-gray-700 md:text-xs">
          Add Attendee
        </span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <input
          type="text"
          className="border border-gray-300 rounded p-2 flex-grow"
          placeholder="Enter name"
          value={inputValue}
          onChange={(e) => setInputValue(toSentenceCase(e.target.value))} // Apply sentence case here
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addAttendee();
            }
          }}
        />
        <button
          onClick={addAttendee}
          className={`bg-green-600 text-white ${commonPadding} rounded w-full md:w-auto hover:bg-green-700 flex items-center justify-center`}
        >
          <FaUserPlus className="mr-2" />
          Add Attendee
        </button>
      </div>
    </div>
  );
};

export default AddAttendeeRow;
