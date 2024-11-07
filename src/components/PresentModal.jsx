import React, { useEffect, useState, useRef } from "react";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebase";
import "./styles/PresentModal.css";

const PresentModal = ({ onComplete }) => {
  const [names, setNames] = useState([]);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const displayDuration = 5000; // 6 seconds per name
  const [animateImages, setAnimateImages] = useState(false);

  useEffect(() => {
    const presentRef = ref(database, "current-present-attendee");
    onValue(presentRef, (snapshot) => {
      const data = snapshot.val();
      const namesList = data
        ? Object.keys(data).map((key) => ({ id: key, name: data[key].name }))
        : [];
      setNames(namesList);

      currentIndexRef.current = 0;
      setCurrentNameIndex(0);
      setAnimateImages(false);

      setTimeout(() => setAnimateImages(true), 500); // Start animation after a delay
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (names.length > 0) {
        const currentId = names[currentIndexRef.current].id;

        // Reset animation, trigger it for the next name
        setAnimateImages(false);
        setTimeout(() => setAnimateImages(true), 500);

        // Move to the next name and remove current one from Firebase
        currentIndexRef.current = (currentIndexRef.current + 1) % names.length;
        setCurrentNameIndex(currentIndexRef.current);

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
          <img
            src="/left-img.png"
            alt="Left cover"
            className={`cover-image left-image ${
              animateImages ? "slide-out" : ""
            }`}
          />
          <img
            src="/right-img.png"
            alt="Right cover"
            className={`cover-image right-image ${
              animateImages ? "slide-out" : ""
            }`}
          />
          <div className="modal-content">
            <div className="modal-title">PRESENT IN NSTW 2024</div>
            <div className="modal-name">{names[currentNameIndex]?.name}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PresentModal;
