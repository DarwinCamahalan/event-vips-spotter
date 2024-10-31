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
