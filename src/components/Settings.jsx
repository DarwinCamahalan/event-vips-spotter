// Settings.jsx
import React, { useState, useEffect } from "react";
import { ref, set, push, onValue, update, remove } from "firebase/database";
import { database } from "../firebase";
import HeaderRow from "./settingsComponents/HeaderRow";
import SearchAndFilter from "./settingsComponents/SearchAndFilter";
import BulkAddAttendees from "./settingsComponents/BulkAddAttendees";
import AttendeesTable from "./settingsComponents/AttendeesTable";
import AddAttendeeRow from "./settingsComponents/AddAttendeeRow";
import DynamicModal from "./DynamicModal";
import ConfirmationModal from "./ConfirmationModal";

const Settings = () => {
  const [inputValue, setInputValue] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [attendeeToDelete, setAttendeeToDelete] = useState(null);

  const commonPadding = "py-2 px-4";

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

  const showModal = (status, title, description) => {
    setModalStatus(status);
    setModalTitle(title);
    setModalDescription(description);
    setModalVisible(true);
  };

  const addAttendee = () => {
    const formattedName = inputValue.trim().toUpperCase(); // Ensure uppercase name
    if (!formattedName) return;

    const isDuplicate = attendees.some(
      (attendee) => attendee.name === formattedName
    );

    if (isDuplicate) {
      showModal(
        "error",
        "Duplicate Name",
        `${formattedName} is already in the list.`
      );
      return;
    }

    const attendeesRef = ref(database, "attendees");
    const newAttendeeRef = push(attendeesRef);
    set(newAttendeeRef, { name: formattedName, status: false });
    setInputValue("");
    showModal("success", "Attendee Added", `${formattedName} has been added.`);
  };

  const addAttendeesFromCsv = (attendeesArray) => {
    const attendeesRef = ref(database, "attendees");

    const existingNames = attendees.map((attendee) =>
      attendee.name.toUpperCase()
    );
    const newAttendees = [];
    const duplicateNames = [];

    attendeesArray.forEach((attendee) => {
      const attendeeName = attendee.name.toUpperCase(); // Ensure uppercase
      if (existingNames.includes(attendeeName)) {
        duplicateNames.push(attendeeName);
      } else {
        newAttendees.push({ ...attendee, name: attendeeName });
      }
    });

    newAttendees.forEach((attendee) => {
      const newAttendeeRef = push(attendeesRef);
      set(newAttendeeRef, {
        name: attendee.name,
        status: false,
      });
    });

    if (newAttendees.length > 0) {
      showModal(
        "success",
        "Attendees Added",
        "Attendees have been added from CSV."
      );
    }
    if (duplicateNames.length > 0) {
      showModal(
        "warning",
        "Duplicate Names Skipped",
        `The following names were skipped as duplicates: ${duplicateNames.join(
          ", "
        )}.`
      );
    }
  };

  const addAttendeesFromJson = (parsedData) => {
    try {
      if (!Array.isArray(parsedData)) {
        throw new Error("The data is not an array.");
      }

      const existingNames = attendees.map((attendee) =>
        attendee.name.toUpperCase()
      );
      const newAttendees = [];
      const duplicateNames = [];

      parsedData.forEach((attendee) => {
        const attendeeName = attendee.name.toUpperCase(); // Ensure uppercase
        if (existingNames.includes(attendeeName)) {
          duplicateNames.push(attendeeName);
        } else {
          newAttendees.push({ ...attendee, name: attendeeName });
        }
      });

      const attendeesRef = ref(database, "attendees");
      newAttendees.forEach((attendee) => {
        const newAttendeeRef = push(attendeesRef);
        set(newAttendeeRef, {
          name: attendee.name,
          status: false,
        });
      });

      if (newAttendees.length > 0) {
        showModal(
          "success",
          "Attendees Added",
          "Attendees have been added from JSON."
        );
      }
      if (duplicateNames.length > 0) {
        showModal(
          "warning",
          "Duplicate Names Skipped",
          `The following names were skipped as duplicates: ${duplicateNames.join(
            ", "
          )}.`
        );
      }
    } catch (error) {
      console.error("Error in addAttendeesFromJson:", error.message);
      showModal("error", "Error Adding Attendees", error.message);
    }
  };

  const markAsNotPresent = (attendeeId) => {
    const attendeeRef = ref(database, `attendees/${attendeeId}`);
    update(attendeeRef, { status: false });
    showModal(
      "info",
      "Marked as Not Present",
      "The attendee has been marked as not present."
    );
  };

  const confirmDelete = (attendeeId) => {
    setAttendeeToDelete(attendeeId);
    setConfirmationVisible(true);
  };

  const handleDelete = () => {
    if (attendeeToDelete) {
      deleteAttendee(attendeeToDelete);
      setAttendeeToDelete(null);
      setConfirmationVisible(false);
    }
  };

  const handleCancelDelete = () => {
    setAttendeeToDelete(null);
    setConfirmationVisible(false);
  };

  const deleteAttendee = (attendeeId) => {
    const attendeeRef = ref(database, `attendees/${attendeeId}`);
    remove(attendeeRef);
    showModal(
      "success",
      "Attendee Deleted",
      "The attendee has been deleted successfully."
    );
  };

  const filterAttendees = (option) => {
    setFilterOption(option);
  };

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch = attendee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterOption === "" ||
      (filterOption === "present" && attendee.status) ||
      (filterOption === "notPresent" && !attendee.status);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-auto lg:p-4 md:p-0">
      <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
        <HeaderRow commonPadding={commonPadding} />

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterAttendees={filterAttendees}
          commonPadding={commonPadding}
        />

        <AddAttendeeRow
          addAttendee={addAttendee}
          inputValue={inputValue}
          setInputValue={setInputValue}
          commonPadding={commonPadding}
        />

        <BulkAddAttendees
          addAttendeesFromJson={addAttendeesFromJson}
          addAttendeesFromCsv={addAttendeesFromCsv}
          commonPadding={commonPadding}
          showModal={showModal}
        />

        <AttendeesTable
          attendees={attendees}
          filteredAttendees={filteredAttendees}
          markAsNotPresent={markAsNotPresent}
          confirmDelete={confirmDelete}
          commonPadding={commonPadding}
        />

        {modalVisible && (
          <DynamicModal
            status={modalStatus}
            title={modalTitle}
            description={modalDescription}
            onClose={() => setModalVisible(false)}
          />
        )}

        {confirmationVisible && (
          <ConfirmationModal
            title="Confirm Deletion"
            description="Are you sure you want to delete this attendee?"
            onConfirm={handleDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;
