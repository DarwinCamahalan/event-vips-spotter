import React, { useState, useEffect } from "react";
import { ref, set, push, onValue, update, remove } from "firebase/database";
import { database } from "../firebase";
import {
  FaSearch,
  FaFilter,
  FaUserCheck,
  FaTrash,
  FaUserPlus,
  FaFileCsv,
  FaFileUpload,
} from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";

const Settings = () => {
  const [inputValue, setInputValue] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

  useEffect(() => {
    const attendeesRef = ref(database, "attendees");
    onValue(attendeesRef, (snapshot) => {
      const data = snapshot.val();
      const attendeesList = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];
      setAttendees(attendeesList);
    });
  }, []);

  const toSentenceCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Function to add a single attendee from input field
  const addAttendee = () => {
    if (inputValue.trim()) {
      const attendeesRef = ref(database, "attendees");
      const newAttendeeRef = push(attendeesRef);
      const formattedName = toSentenceCase(inputValue); // Format the name to sentence case
      set(newAttendeeRef, {
        name: formattedName,
        status: false, // Status set to false (Not Present)
      });
      setInputValue(""); // Clear the input field
    }
  };

  // Function to add multiple attendees from JSON input
  const addAttendeesFromJson = () => {
    try {
      const attendeesArray = JSON.parse(jsonInput);
      if (Array.isArray(attendeesArray)) {
        attendeesArray.forEach((attendee) => {
          if (attendee.name) {
            const attendeesRef = ref(database, "attendees");
            const newAttendeeRef = push(attendeesRef);
            set(newAttendeeRef, {
              name: attendee.name,
              status: false, // Status set to false (Not Present)
            });
          }
        });
        setJsonInput(""); // Clear the JSON input field
      } else {
        alert("Invalid JSON format. Please provide an array of objects.");
      }
    } catch (error) {
      alert("Invalid JSON. Please check your input.");
    }
  };

  // Function to tag an attendee as "Not Present"
  const markAsNotPresent = (attendeeId) => {
    const attendeeRef = ref(database, `attendees/${attendeeId}`);
    update(attendeeRef, { status: false }); // Set status to false
    alert("Attendee marked as not present!");
  };

  // Function to delete an attendee
  const deleteAttendee = (attendeeId) => {
    const attendeeRef = ref(database, `attendees/${attendeeId}`);
    remove(attendeeRef);
    alert("Attendee deleted successfully!");
  };

  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  // Handle filtering
  const filterAttendees = (option) => {
    setFilterOption(option);
    setFilterDropdownVisible(false);
  };

  // Filter attendees based on search term and filter option
  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch = attendee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterOption === "" ||
      (filterOption === "present" && attendee.status) ||
      (filterOption === "notPresent" && !attendee.status);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            onClick={() => (window.location.href = "/spotter")}
            className="flex items-center bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            <FaUserCheck className="mr-2" /> Spot Attendees
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row items-center mb-4 space-y-2 md:space-y-0 md:space-x-2">
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
              className="bg-gray-200 p-2 rounded w-full md:w-auto flex items-center justify-center"
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

        {/* Add Attendee */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Add Attendee</h3>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <input
              type="text"
              className="border border-gray-300 rounded p-2 flex-grow"
              placeholder="Enter name"
              value={inputValue}
              onChange={(e) => setInputValue(toSentenceCase(e.target.value))}
            />
            <button
              onClick={addAttendee}
              className="bg-green-600 text-white py-2 px-4 rounded w-full md:w-auto hover:bg-green-700 flex items-center justify-center"
            >
              <FaUserPlus className="mr-2" />
              Add Attendee
            </button>
          </div>
        </div>

        {/* Upload CSV/JSON */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Bulk Add Attendees</h3>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button className="bg-cyan-800 hover:bg-cyan-700 text-white py-2 px-4 rounded w-full md:w-auto flex items-center justify-center">
              <FaFileCsv className="mr-2" />
              Upload CSV
            </button>
            <button
              onClick={addAttendeesFromJson}
              className="bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded w-full md:w-auto flex items-center justify-center"
            >
              <FaFileUpload className="mr-2" />
              Upload JSON
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">All Attendees</h3>
          <div className="overflow-x-auto">
            <div className="hidden md:block">
              <table className="min-w-full table-fixed bg-white">
                <thead>
                  <tr>
                    <th className="w-1/3 py-2 px-4 border-b text-left">Name</th>
                    <th className="w-1/4 py-2 px-4 border-b text-left">
                      Status
                    </th>
                    <th className="w-1/3 py-2 px-4 border-b text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendees.map((attendee) => (
                    <tr key={attendee.id}>
                      <td className="py-2 px-4 border-b">{attendee.name}</td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            attendee.status ? "bg-green-700" : "bg-red-600"
                          }`}
                        >
                          {attendee.status ? "Present" : "Not Present"}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markAsNotPresent(attendee.id)}
                            className={`py-1 px-2 rounded flex items-center justify-center ${
                              attendee.status
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={!attendee.status}
                          >
                            <FaUserXmark className="mr-2" />
                            Mark as Not Present
                          </button>
                          <button
                            onClick={() => deleteAttendee(attendee.id)}
                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 flex items-center justify-center"
                          >
                            <FaTrash className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden">
              {filteredAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="bg-white shadow-md rounded-lg p-4 mb-4"
                >
                  <div className="mb-3">
                    <strong>Name:</strong> {attendee.name}
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        attendee.status ? "bg-green-700" : "bg-red-600"
                      }`}
                    >
                      {attendee.status ? "Present" : "Not Present"}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="relative flex items-center my-3">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="mx-2 text-gray-500">Actions</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => markAsNotPresent(attendee.id)}
                        className={`py-1 px-2 rounded flex items-center justify-center ${
                          attendee.status
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!attendee.status}
                      >
                        <FaUserXmark className="mr-2" />
                        Mark as Not Present
                      </button>
                      <button
                        onClick={() => deleteAttendee(attendee.id)}
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 flex items-center justify-center"
                      >
                        <FaTrash className="mr-2" />
                        Delete Attendee
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
