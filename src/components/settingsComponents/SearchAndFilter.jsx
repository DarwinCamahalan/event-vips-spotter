// SearchAndFilter.jsx
import React, { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filterOption,
  filterAttendees,
  commonPadding,
}) => {
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  return (
    <div className="flex flex-col md:flex-row md:mt-5 items-center mb-4 space-y-2 md:space-y-0 md:space-x-2">
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaSearch className="text-gray-500" />
        </span>
        <input
          type="text"
          className="border border-gray-300 rounded p-2 pl-10 w-full"
          placeholder="Search attendees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="relative w-full md:w-auto">
        <button
          onClick={toggleFilterDropdown}
          className={`bg-gray-200 ${commonPadding} rounded w-full md:w-auto flex items-center justify-center`}
        >
          <FaFilter className="mr-1" /> Filter
        </button>
        {filterDropdownVisible && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-10">
            <ul>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => filterAttendees("present")}
              >
                Present
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => filterAttendees("notPresent")}
              >
                Not Present
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => filterAttendees("")}
              >
                All
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
