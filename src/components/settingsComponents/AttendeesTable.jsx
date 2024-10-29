// AttendeesTable.jsx
import React from "react";
import { FaTrash, FaUserXmark } from "react-icons/fa6";

const AttendeesTable = ({
  attendees,
  filteredAttendees,
  markAsNotPresent,
  confirmDelete,
  commonPadding,
}) => {
  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2 hidden md:block">
        All Attendees
      </h3>
      <div className="flex mt-8 items-center mb-2 md:hidden">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 font-semibold text-gray-700">All Attendees</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Display as a table for medium and larger screens */}
      <div className="hidden md:block">
        <table className="min-w-full table-fixed bg-white">
          <thead>
            <tr>
              <th className="w-1/3 py-2 px-4 border-b text-left">Name</th>
              <th className="w-1/4 py-2 px-4 border-b text-left">Status</th>
              <th className="w-1/3 py-2 px-4 border-b text-left">Actions</th>
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
                <td className="py-2 px-1 border-b">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => markAsNotPresent(attendee.id)}
                      className={`py-1 px-2 rounded flex items-center justify-center ${commonPadding} ${
                        attendee.status
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!attendee.status}
                    >
                      <FaUserXmark className="mr-2" />
                      Tag as Not Present
                    </button>
                    <button
                      onClick={() => confirmDelete(attendee.id)}
                      className={`bg-red-500 text-white ${commonPadding} py-1 px-2 rounded hover:bg-red-600 flex items-center justify-center`}
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

      {/* Display as cards for smaller screens */}
      <div className="block md:hidden space-y-4">
        {filteredAttendees.map((attendee) => (
          <div
            key={attendee.id}
            className="bg-white border border-gray-300 shadow-md rounded-lg p-4 mb-4"
          >
            <div className="mb-2">
              <strong>Name:</strong> {attendee.name}
            </div>
            <div className="mb-2">
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
                <span className="mx-2 text-gray-500 text-xs">Actions</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => markAsNotPresent(attendee.id)}
                  className={`py-1 px-2 rounded flex items-center justify-center ${commonPadding} ${
                    attendee.status
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!attendee.status}
                >
                  <FaUserXmark className="mr-2" />
                  Tag as Not Present
                </button>
                <button
                  onClick={() => confirmDelete(attendee.id)}
                  className={`bg-red-500 text-white ${commonPadding} py-1 px-2 rounded hover:bg-red-600 flex items-center justify-center`}
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
  );
};

export default AttendeesTable;
