// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Display from "./components/Display";
import Spotter from "./components/Spotter";
import Settings from "./components/Settings";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/display" element={<Display />} />
          <Route path="/spotter" element={<Spotter />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
