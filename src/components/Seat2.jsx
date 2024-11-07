// src/components/Seat2.jsx
import React from "react";

const Seat2 = () => {
  return (
    <div
      className="seat-page"
      style={{
        display: "flex", // Enable flexbox
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        height: "100vh", // Ensure the container takes full viewport height
        overflow: "hidden", // Prevent any overflow if the image is large
      }}
    >
      <img
        src="/seat2.jpeg"
        alt="Seat 2"
        style={{
          maxWidth: "100%", // Ensures the image scales to fit the container
          maxHeight: "100%", // Limits the height to the container height
          objectFit: "contain", // Prevents image distortion
        }}
      />
    </div>
  );
};

export default Seat2;
