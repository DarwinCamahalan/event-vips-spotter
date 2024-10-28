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
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];
      setAttendees(attendeesList);
    });
  }, []);

  return (
    <div>
      <h2>Attendees List</h2>
      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.id}>
            {attendee.name} - {attendee.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Display;
