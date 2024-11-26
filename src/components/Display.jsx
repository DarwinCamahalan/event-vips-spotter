// src/components/Display.jsx
import React, { useEffect, useState, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import PresentModal from "./PresentModal";
import Properties from "./Properties"; // Import the Properties component
import "./styles/Display.css";

const Display = () => {
  const [attendees, setAttendees] = useState([]);
  const [currentAttendeeIndex, setCurrentAttendeeIndex] = useState(0);
  const [showModal, setShowModal] = useState(true);
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
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (attendees.length > 0) {
        currentIndexRef.current =
          (currentIndexRef.current + 1) % attendees.length;
        setCurrentAttendeeIndex(currentIndexRef.current);
      }
    }, displayDuration);

    return () => clearInterval(interval);
  }, [attendees]);

  return (
    <div className="display-container">
      {/* Video Background */}
      <video autoPlay loop muted playsInline className="video-background">
        <source src="/bg.mp4" type="video/mp4" />
        <source src="/bg.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Display PresentModal when showModal is true */}
      {showModal && <PresentModal onComplete={() => setShowModal(false)} />}

      {/* Properties Component (appears on hover over the top-left corner) */}
      <div className="properties-main">
        <Properties />
      </div>

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
