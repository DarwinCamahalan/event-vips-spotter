// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Display from "./components/Display";
import Spotter from "./components/Spotter";
import Settings from "./components/Settings";
import Seat1 from "./components/Seat1"; // Import Seat1 component
import Seat2 from "./components/Seat2"; // Import Seat2 component

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Redirect root path "/" to "/settings" */}
          <Route path="/" element={<Navigate to="/settings" replace />} />

          {/* Define other routes */}
          <Route path="/display" element={<Display />} />
          <Route path="/spotter" element={<Spotter />} />
          <Route path="/settings" element={<Settings />} />

          {/* Define routes for seat1 and seat2 */}
          <Route path="/seat1" element={<Seat1 />} />
          <Route path="/seat2" element={<Seat2 />} />

          {/* Fallback for unmatched routes */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen text-3xl font-semibold text-gray-600">
                Page not found
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
