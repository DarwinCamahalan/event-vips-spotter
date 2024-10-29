// BulkAddAttendees.jsx
import React, { useRef } from "react";
import Papa from "papaparse";
import { FaFileCsv, FaFileUpload } from "react-icons/fa";

const BulkAddAttendees = ({
  addAttendeesFromJson,
  addAttendeesFromCsv,
  commonPadding,
  showModal,
}) => {
  // References for file inputs to reset after upload
  const csvInputRef = useRef(null);
  const jsonInputRef = useRef(null);

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const data = result.data
            .filter(
              (row) => row["Name"] || (row["First Name"] && row["Last Name"])
            )
            .map((row) => ({
              name: row["Name"]
                ? row["Name"].trim()
                : `${row["First Name"]} ${row["Last Name"]}`.trim(),
            }));

          addAttendeesFromCsv(data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error.message);
        },
      });
    }

    // Reset the input field so it can be triggered again
    if (csvInputRef.current) csvInputRef.current.value = "";
  };

  const handleJsonUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);

          if (!Array.isArray(data)) {
            throw new Error("The JSON file must contain an array of objects.");
          }

          const parsedData = data
            .filter((row) => typeof row === "object" && row.Name)
            .map((row) => ({
              name: row.Name.trim(),
            }));

          if (parsedData.length === 0) {
            throw new Error(
              "No valid entries found in JSON. Each entry must have a 'Name' field."
            );
          }

          addAttendeesFromJson(parsedData);
        } catch (error) {
          console.error("Error parsing JSON:", error.message);
          showModal("error", "Invalid JSON", error.message);
        }
      };
      reader.readAsText(file);
    }

    // Reset the input field so it can be triggered again
    if (jsonInputRef.current) jsonInputRef.current.value = "";
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 hidden md:block">
        Bulk Add Attendees
      </h3>
      <div className="flex mt-8 items-center mb-2 md:hidden">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 font-semibold text-gray-700">
          Bulk Add Attendees
        </span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <label
          className={`bg-cyan-800 hover:bg-cyan-700 text-white ${commonPadding} rounded w-full md:w-auto flex items-center justify-center cursor-pointer`}
        >
          <FaFileCsv className="mr-2" />
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="hidden"
            ref={csvInputRef} // Attach ref to reset field
          />
        </label>

        <label
          className={`bg-slate-900 hover:bg-slate-800 text-white ${commonPadding} rounded w-full md:w-auto flex items-center justify-center cursor-pointer`}
        >
          <FaFileUpload className="mr-2" />
          Upload JSON
          <input
            type="file"
            accept=".json"
            onChange={handleJsonUpload}
            className="hidden"
            ref={jsonInputRef} // Attach ref to reset field
          />
        </label>
      </div>
    </div>
  );
};

export default BulkAddAttendees;
