import React, { useEffect, useState, useRef } from "react";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebase";
import "./styles/PresentModal.css"; // Custom CSS for the modal

const PresentModal = ({ onComplete }) => {
  const [names, setNames] = useState([]);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const displayDuration = 5000; // 5 seconds per name

  useEffect(() => {
    // Reference to current-present-attendee
    const presentRef = ref(database, "current-present-attendee");
    onValue(presentRef, (snapshot) => {
      const data = snapshot.val();
      const namesList = data
        ? Object.keys(data).map((key) => ({ id: key, name: data[key].name }))
        : [];
      setNames(namesList);

      // Reset index for new data
      currentIndexRef.current = 0;
      setCurrentNameIndex(0);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (names.length > 0) {
        const currentId = names[currentIndexRef.current].id;

        // Set the next index in the array
        currentIndexRef.current = (currentIndexRef.current + 1) % names.length;
        setCurrentNameIndex(currentIndexRef.current);

        // Remove the name from the database if it was displayed for 5 seconds
        const nameToRemove = ref(
          database,
          `current-present-attendee/${currentId}`
        );
        remove(nameToRemove)
          .then(() => console.log("Name removed from Firebase:", currentId))
          .catch((error) => console.error("Error removing name:", error));
      }
    }, displayDuration);

    return () => clearInterval(interval);
  }, [names]);

  return (
    <>
      {names.length > 0 ? (
        <div className="modal-background">
          <div className="modal-name">{names[currentNameIndex]?.name}</div>
        </div>
      ) : null}
    </>
  );
};

export default PresentModal;
