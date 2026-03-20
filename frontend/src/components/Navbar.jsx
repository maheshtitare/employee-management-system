import React from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Navbar - top navigation bar shown on all pages after login.
 * Receives onLogout function from App.js via props.
 */
function Navbar({ onLogout }) {
  const navigate = useNavigate();

  // Read user info stored in localStorage during login
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    onLogout();           // Clears localStorage + state in App.js
    navigate("/login");   // Redirect to login page
  };

  return (
    <nav style={s.nav}>
      <span style={s.brand}>&#128188; Employee Manager</span>
      <div style={s.links}>
        <Link to="/dashboard" style={s.link}>Dashboard</Link>
        <Link to="/employees" style={s.link}>Employees</Link>
      </div>
      <div style={s.right}>
        <span style={s.userInfo}>{user.name} &bull; {user.role}</span>
        <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const s = {
  nav: { display:"flex", alignItems:"center", backgroundColor:"#2c3e50", padding:"0 24px", height:"56px", color:"white" },
  brand: { fontSize:"18px", fontWeight:"600", flex:1 },
  links: { display:"flex", gap:"24px", flex:2 },
  link: { color:"#ecf0f1", textDecoration:"none", fontSize:"15px" },
  right: { display:"flex", alignItems:"center", gap:"12px", flex:1, justifyContent:"flex-end" },
  userInfo: { fontSize:"13px", color:"#bdc3c7" },
  logoutBtn: { backgroundColor:"#e74c3c", color:"white", border:"none", padding:"6px 14px", borderRadius:"4px", cursor:"pointer", fontSize:"13px" }
};

export default Navbar;
