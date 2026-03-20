import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import Navbar from "./components/Navbar";

/**
 * App.js - Root component. Sets up routing for the whole application.
 *
 * Routes:
 *   /login         -> LoginPage (public)
 *   /dashboard     -> Dashboard (protected)
 *   /employees     -> EmployeeList (protected)
 *   /employees/add -> EmployeeForm (protected)
 *   /employees/edit/:id -> EmployeeForm in edit mode (protected)
 */
function App() {
  // Read token from localStorage - if it exists, user is logged in
  const [token, setToken] = useState(localStorage.getItem("token"));

  const isLoggedIn = !!token; // Convert to boolean

  // Called from LoginPage after successful login
  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // Called from Navbar logout button
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  };

  return (
    <BrowserRouter>
      {/* Show Navbar only when logged in */}
      {isLoggedIn && <Navbar onLogout={handleLogout} />}

      <Routes>
        {/* If logged in, redirect /login to /dashboard */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />}
        />

        {/* Protected routes - redirect to /login if not authenticated */}
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/employees" element={isLoggedIn ? <EmployeeList /> : <Navigate to="/login" />} />
        <Route path="/employees/add" element={isLoggedIn ? <EmployeeForm /> : <Navigate to="/login" />} />
        <Route path="/employees/edit/:id" element={isLoggedIn ? <EmployeeForm /> : <Navigate to="/login" />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
