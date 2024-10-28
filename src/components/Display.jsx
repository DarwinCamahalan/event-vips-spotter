// src/components/Display.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

const Display = () => {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const attendeesRef = ref(database, "attendees");
    onValue(attendeesRef, (snapshot) => {
      const data = snapshot.val();
      const attendeesList = data
        ? Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((attendee) => attendee.status === true) // Only show present attendees
        : [];
      setAttendees(attendeesList);
    });
  }, []);

  return (
    <div>
      <h2>Present Attendees</h2>
      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.id}>{attendee.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Display;
