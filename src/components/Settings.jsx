// src/components/Settings.jsx
import React, { useState, useEffect } from "react";
import { ref, set, push, onValue, update, remove } from "firebase/database";
import { database } from "../firebase";

const Settings = () => {
  const [inputValue, setInputValue] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [attendees, setAttendees] = useState([]);

  // Fetch attendees from Firebase
  useEffect(() => {
    const attendeesRef = ref(database, "attendees");
    onValue(attendeesRef, (snapshot) => {
      const data = snapshot.val();
      const attendeesList = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];
      setAttendees(attendeesList);
    });
  }, []);

  // Function to add a single attendee from input field
  const addAttendee = () => {
    if (inputValue.trim()) {
      const attendeesRef = ref(database, "attendees");
      const newAttendeeRef = push(attendeesRef);
      set(newAttendeeRef, {
        name: inputValue,
        status: false, // Status set to false (Not Present)
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
              status: false, // Status set to false (Not Present)
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

  // Function to tag an attendee as "Not Present"
  const markAsNotPresent = (attendeeId) => {
    const attendeeRef = ref(database, `attendees/${attendeeId}`);
    update(attendeeRef, { status: false }); // Set status to false
    alert("Attendee marked as not present!");
  };

  // Function to delete an attendee
  const deleteAttendee = (attendeeId) => {
    const attendeeRef = ref(database, `attendees/${attendeeId}`);
    remove(attendeeRef);
    alert("Attendee deleted successfully!");
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

      <div>
        <h3>All Attendees</h3>
        <ul>
          {attendees.map((attendee) => (
            <li key={attendee.id}>
              {attendee.name} - {attendee.status ? "Present" : "Not Present"}
              {attendee.status && (
                <button onClick={() => markAsNotPresent(attendee.id)}>
                  Mark as Not Present
                </button>
              )}
              <button onClick={() => deleteAttendee(attendee.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Settings;
