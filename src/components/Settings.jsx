// src/components/Settings.jsx
import React, { useState } from "react";
import { ref, set, push } from "firebase/database";
import { database } from "../firebase";

const Settings = () => {
  const [inputValue, setInputValue] = useState("");
  const [jsonInput, setJsonInput] = useState("");

  // Function to add a single attendee from input field
  const addAttendee = () => {
    if (inputValue.trim()) {
      const attendeesRef = ref(database, "attendees");
      const newAttendeeRef = push(attendeesRef);
      set(newAttendeeRef, {
        name: inputValue,
        status: "Not Present",
      });
      setInputValue(""); // Clear the input field
    }
  };

  // Function to add multiple attendees from JSON input
  const addAttendeesFromJson = () => {
    try {
      const attendeesArray = JSON.parse(jsonInput);
      if (Array.isArray(attendeesArray)) {
        attendeesArray.forEach((attendee) => {
          if (attendee.name) {
            const attendeesRef = ref(database, "attendees");
            const newAttendeeRef = push(attendeesRef);
            set(newAttendeeRef, {
              name: attendee.name,
              status: "Not Present",
            });
          }
        });
        setJsonInput(""); // Clear the JSON input field
      } else {
        alert("Invalid JSON format. Please provide an array of objects.");
      }
    } catch (error) {
      alert("Invalid JSON. Please check your input.");
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <h3>Add Attendee</h3>
        <input
          type="text"
          placeholder="Enter name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={addAttendee}>Add Attendee</button>
      </div>

      <div>
        <h3>Bulk Add Attendees (JSON)</h3>
        <textarea
          placeholder='Enter JSON, e.g., [{"name": "John Doe"}, {"name": "Jane Doe"}]'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        ></textarea>
        <button onClick={addAttendeesFromJson}>Add From JSON</button>
      </div>
    </div>
  );
};

export default Settings;
