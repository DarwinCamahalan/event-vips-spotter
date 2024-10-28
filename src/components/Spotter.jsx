// src/components/Spotter.jsx
import React, { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase";

const Spotter = () => {
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Function to filter attendees based on search term
  const filteredAttendees = attendees.filter((attendee) =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mark the attendee as present
  const markAsPresent = (attendeeId) => {
    const attendeeRef = ref(database, `attendees/${attendeeId}`);
    update(attendeeRef, { status: true }); // Set status to true
    alert("Attendee marked as present!");
  };

  return (
    <div>
      <h2>Spotter</h2>
      <div>
        <input
          type="text"
          placeholder="Search for attendee"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        <h3>Attendees List</h3>
        <ul>
          {filteredAttendees.map((attendee) => (
            <li key={attendee.id}>
              {attendee.name} - {attendee.status ? "Present" : "Not Present"}
              {!attendee.status && (
                <button onClick={() => markAsPresent(attendee.id)}>
                  Mark as Present
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Spotter;
