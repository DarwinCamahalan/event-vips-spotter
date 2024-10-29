// src/components/Display.jsx
import React, { useEffect, useState, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

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
    <div
      className="flex items-center justify-center h-screen text-white"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {attendees.length > 0 ? (
        <div
          className="fade-text text-7xl font-bold"
          key={attendees[currentAttendeeIndex]?.id}
        >
          {attendees[currentAttendeeIndex]?.name}
        </div>
      ) : (
        <img
          src="/empty_view.png"
          alt="No Present Attendees"
          className="w-1/2 max-w-full"
        />
      )}

      <style>{`
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
