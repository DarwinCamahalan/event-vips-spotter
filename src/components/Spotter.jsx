// src/components/Spotter.jsx
import React, { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase";

const Spotter = () => {
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [foundAttendee, setFoundAttendee] = useState(null);

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

  // Search for an attendee by name
  const searchAttendee = () => {
    const attendee = attendees.find(
      (person) => person.name.toLowerCase() === searchTerm.toLowerCase()
    );
    setFoundAttendee(attendee || null);
  };

  // Mark the attendee as present
  const markAsPresent = (attendeeId) => {
    const attendeeRef = ref(database, `attendees/${attendeeId}`);
    update(attendeeRef, { status: "Present" });
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
        <button onClick={searchAttendee}>Search</button>
      </div>

      {foundAttendee ? (
        <div>
          <h3>Attendee Found:</h3>
          <p>
            {foundAttendee.name} - {foundAttendee.status}
          </p>
          {foundAttendee.status !== "Present" && (
            <button onClick={() => markAsPresent(foundAttendee.id)}>
              Mark as Present
            </button>
          )}
        </div>
      ) : (
        searchTerm && <p>No attendee found with that name.</p>
      )}
    </div>
  );
};

export default Spotter;
