import React, { useEffect, useState, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import "./styles/Display.css"; // Import the CSS file

const Display = () => {
  const [attendees, setAttendees] = useState([]);
  const [currentAttendeeIndex, setCurrentAttendeeIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const displayDuration = 5000; // 5 seconds per attendee

  useEffect(() => {
    const attendeesRef = ref(database, "attendees");
    onValue(attendeesRef, (snapshot) => {
      const data = snapshot.val();
      const presentAttendees = data
        ? Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((attendee) => attendee.status === true)
        : [];

      setAttendees(presentAttendees);

      // Reset current index to start displaying the newly updated list
      if (presentAttendees.length > 0) {
        currentIndexRef.current = 0;
        setCurrentAttendeeIndex(0);
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndexRef.current =
        (currentIndexRef.current + 1) % attendees.length;
      setCurrentAttendeeIndex(currentIndexRef.current);
    }, displayDuration);

    return () => clearInterval(interval);
  }, [attendees.length]);

  return (
    <div className="display-container">
      {/* GIF Background */}
      <img
        src="/bg.gif"
        alt="Background Animation"
        className="gif-background"
      />

      {attendees.length > 0 ? (
        <div
          className="fade-text attendee-name"
          key={attendees[currentAttendeeIndex]?.id}
        >
          {attendees[currentAttendeeIndex]?.name}
        </div>
      ) : (
        <img
          src="/empty_view.png"
          alt="No Present Attendees"
          className="empty-view"
        />
      )}
    </div>
  );
};

export default Display;
