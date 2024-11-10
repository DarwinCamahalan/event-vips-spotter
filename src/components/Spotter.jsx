// src/components/Spotter.jsx
import React, { useState, useEffect } from "react";
import { ref, onValue, update, set, push } from "firebase/database";
import { database } from "../firebase";
import { FaCog, FaUserCheck, FaSearch } from "react-icons/fa";
import DynamicModal from "./DynamicModal";

const Spotter = () => {
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalMessage, setModalMessage] = useState("");

  // Fetch attendees from Firebase
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

  // Show modal function
  const showModal = (title, description) => {
    setModalTitle(title);
    setModalDescription(description);
    setModalVisible(true);
  };

  // Function to filter attendees based on search term and selected filter, and move present attendees to the bottom
  const filteredAttendees = attendees
    .filter((attendee) => {
      const matchesSearch = attendee.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "present" && attendee.status) ||
        (filter === "notPresent" && !attendee.status);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Move present attendees (status: true) to the bottom
      return a.status === b.status ? 0 : a.status ? 1 : -1;
    });

  // Mark the attendee as present and add to "current-present-attendee" node

  const markAsPresent = (attendeeId, attendeeName) => {
    const attendeeRef = ref(database, `attendees/${attendeeId}`);
    const currentPresentRef = ref(database, `current-present-attendee`);

    // Update the attendee's status in the "attendees" node
    update(attendeeRef, { status: true })
      .then(() => {
        // Push the attendee's info to "current-present-attendees" node
        push(currentPresentRef, {
          name: attendeeName,
          markedPresentAt: new Date().toISOString(),
        });
        showModal(
          "Attendee Marked as Present",
          `${attendeeName} is now present.`
        );
        setModalMessage(`${attendeeName} is now present`);
        setModalVisible(true);
      })
      .catch((error) => {
        console.error("Error updating attendee status:", error);
        showModal("Error", "Failed to mark attendee as present.");
      });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const commonPadding = "py-2 px-4";

  return (
    <div className="mx-auto lg:p-4 md:p-0">
      <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
        {/* Header Row with Spotter Title and Settings Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Spotter</h2>
          <button
            onClick={() => (window.location.href = "/settings")}
            className={`flex items-center bg-gray-800 text-white ${commonPadding} rounded hover:bg-gray-700`}
          >
            <FaCog className="mr-2" /> Settings
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-500" />
          </span>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 pl-10 w-full"
            placeholder="Search for attendee"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Section */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Filter by Status</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`border rounded-lg px-4 py-2 ${
                filter === "all"
                  ? "bg-black text-white border-black"
                  : "border-black"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("present")}
              className={`border rounded-lg px-4 py-2 ${
                filter === "present"
                  ? "bg-green-700 text-white border-green-700"
                  : "border-black"
              }`}
            >
              Present
            </button>
            <button
              onClick={() => setFilter("notPresent")}
              className={`border rounded-lg px-4 py-2 ${
                filter === "notPresent"
                  ? "bg-red-600 text-white border-red-600"
                  : "border-black"
              }`}
            >
              Not Present
            </button>
          </div>
        </div>

        {/* Attendees List */}
        <div>
          {filteredAttendees.length === 0 ? (
            // Display "No attendee found" if there are no matches
            <div className="text-center text-gray-500 mt-4">
              No attendee found
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <h3 className="mt-3 font-semibold mb-2 hidden md:block">
                  All Attendees
                </h3>
                <table className="min-w-full table-fixed bg-white">
                  <thead>
                    <tr>
                      <th className="w-1/2 py-2 px-4 border-b text-left">
                        Name
                      </th>
                      <th className="w-1/4 py-2 px-4 border-b text-left">
                        Status
                      </th>
                      <th className="w-1/4 py-2 px-4 border-b text-left">
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
                          <button
                            onClick={() =>
                              markAsPresent(attendee.id, attendee.name)
                            }
                            className={`flex items-center ${commonPadding} rounded ${
                              attendee.status
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-700 hover:bg-green-600 text-white"
                            }`}
                            disabled={attendee.status}
                          >
                            <FaUserCheck className="mr-2" />
                            {attendee.status
                              ? "Already Present"
                              : "Mark as Present"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View - Cards */}
              <div className="block md:hidden space-y-4">
                <div className="flex mt-8 items-center mb-2 md:hidden">
                  <hr className="flex-grow border-gray-300" />
                  <span className="mx-4 font-semibold text-gray-700">
                    All Attendees
                  </span>
                  <hr className="flex-grow border-gray-300" />
                </div>
                {filteredAttendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="bg-white border border-gray-300 shadow-md rounded-lg p-4 mb-4"
                  >
                    <div className="mb-3 flex items-center">
                      <h3 className="font-semibold mr-2">Name:</h3>
                      <span>{attendee.name}</span>
                    </div>
                    <div className="mb-2 flex items-center">
                      <h3 className="font-semibold mr-2">Status:</h3>
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          attendee.status ? "bg-green-700" : "bg-red-600"
                        }`}
                      >
                        {attendee.status ? "Present" : "Not Present"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="relative flex items-center mb-2">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-2 text-gray-500 text-xs">
                          Actions
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>

                      <button
                        onClick={() =>
                          markAsPresent(attendee.id, attendee.name)
                        }
                        className={`w-full flex items-center justify-center ${commonPadding} rounded ${
                          attendee.status
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-600 text-white"
                        }`}
                        disabled={attendee.status}
                      >
                        <FaUserCheck className="mr-2" />
                        {attendee.status
                          ? "Already Present"
                          : "Mark as Present"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        {modalVisible && (
          <DynamicModal
            status="success"
            title={modalTitle}
            description={modalDescription}
            onClose={() => setModalVisible(false)}
          />
        )}
        {modalVisible && (
          <DynamicModal
            title="Notification"
            description={modalMessage}
            onClose={handleCloseModal}
            type="info"
          />
        )}
      </div>
    </div>
  );
};

export default Spotter;
