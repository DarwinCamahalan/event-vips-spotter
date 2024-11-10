import React, { useEffect, useState, useRef } from "react";
import { ref, onValue, remove } from "firebase/database";
import confetti from "canvas-confetti";
import { database } from "../firebase";
import "./styles/PresentModal.css";

const PresentModal = ({ onComplete }) => {
  const [names, setNames] = useState([]);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const confettiCanvasRef = useRef(null);
  const displayDuration = 6000; // 5 seconds per name

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
    });
  }, []);

  useEffect(() => {
    if (names.length > 0) {
      startConfetti(); // Start confetti only when names are present

      const interval = setInterval(() => {
        const currentId = names[currentIndexRef.current]?.id;

        // Move to the next name and remove current one from Firebase
        currentIndexRef.current = (currentIndexRef.current + 1) % names.length;
        setCurrentNameIndex(currentIndexRef.current);

        const nameToRemove = ref(
          database,
          `current-present-attendee/${currentId}`
        );
        remove(nameToRemove)
          .then(() => console.log("", currentId))
          .catch((error) => console.error("Error removing name:", error));
      }, displayDuration);

      return () => clearInterval(interval);
    }
  }, [names]);

  const startConfetti = () => {
    const canvas = confettiCanvasRef.current;
    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    const duration = 5000; // Run confetti for 5 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 20 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
      } else {
        const particleCount = 50 * (timeLeft / duration);
        myConfetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        myConfetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }
    }, 250);
  };

  return (
    <>
      {names.length > 0 ? (
        <div className="modal-background">
          <canvas ref={confettiCanvasRef} className="confetti-canvas"></canvas>
          <img src="/empty_view.png" alt="Top Image" className="top-image" />
          <div className="modal-content">
            <div className="modal-title">NOW PRESENT IN THE EVENT</div>
            <div className="modal-name">{names[currentNameIndex]?.name}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PresentModal;
