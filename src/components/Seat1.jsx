import React from "react";
import Properties from "./Properties";

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
      <div className="properties-main">
        <Properties />
      </div>
      <img
        src="/seat1.jpeg"
        alt="Seat 1"
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
