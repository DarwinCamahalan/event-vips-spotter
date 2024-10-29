// src/components/Display.jsx
import React, { useEffect, useState, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

const Display = () => {
  const [attendees, setAttendees] = useState([]);
  const [currentAttendeeIndex, setCurrentAttendeeIndex] = useState(0);
  const currentIndexRef = useRef(0); // Reference to keep the current index
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
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndexRef.current =
        (currentIndexRef.current + 1) % attendees.length;
      setCurrentAttendeeIndex(currentIndexRef.current);
    }, displayDuration);

    return () => clearInterval(interval);
  }, [attendees.length]); // Only reset the interval if the number of attendees changes

  return (
    <div className="flex items-center justify-center h-screen bg-white text-black">
      {attendees.length > 0 ? (
        <div
          className="fade-text text-5xl font-bold"
          key={attendees[currentAttendeeIndex]?.id} // use optional chaining to avoid errors
        >
          {attendees[currentAttendeeIndex]?.name}
        </div>
      ) : (
        <h1 className="text-3xl">No Present Attendees</h1>
      )}

      <style jsx>{`
        .fade-text {
          animation: fadeInOut ${displayDuration}ms ease-in-out;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};

export default Display;
