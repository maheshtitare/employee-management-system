import React, { useState } from "react";
import { loginAPI } from "../api/authAPI";

/**
 * LoginPage - first page the user sees.
 *
 * Flow:
 * 1. User enters email + password
 * 2. Calls /api/auth/login
 * 3. On success: saves token + user info to localStorage
 * 4. Calls onLogin(token) which updates App.js state -> redirects to dashboard
 */
function LoginPage({ onLogin }) {
  // useState for controlled inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");      // Error message to show user
  const [loading, setLoading] = useState(false); // Disable button while waiting

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form page reload
    setLoading(true);
    setError("");

    try {
      const response = await loginAPI(email, password);
      const { token, email: userEmail, role, name } = response.data;

      // Save user info so Navbar can display it
      localStorage.setItem("user", JSON.stringify({ email: userEmail, role, name }));

      // Notify App.js - this triggers redirect to /dashboard
      onLogin(token);
    } catch (err) {
      // Show error message from backend (or fallback message)
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>&#128188; Employee Management</h2>
        <p style={s.subtitle}>Sign in to your account</p>

        {/* Show error if login failed */}
        {error && <div style={s.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.group}>
            <label style={s.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              style={s.input}
              required
            />
          </div>

          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={s.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Hint for demo credentials */}
        <div style={s.hintBox}>
          <p style={s.hint}>&#128272; Admin: admin@company.com / admin123</p>
          <p style={s.hint}>&#128100; Employee: employee@company.com / emp123</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", backgroundColor:"#f0f2f5" },
  card: { backgroundColor:"white", padding:"40px", borderRadius:"10px", boxShadow:"0 4px 20px rgba(0,0,0,0.1)", width:"400px" },
  title: { textAlign:"center", color:"#2c3e50", fontSize:"22px", marginBottom:"4px" },
  subtitle: { textAlign:"center", color:"#7f8c8d", marginBottom:"28px", fontSize:"14px" },
  errorBox: { backgroundColor:"#fdecea", color:"#c0392b", padding:"10px 14px", borderRadius:"6px", marginBottom:"16px", fontSize:"14px", borderLeft:"3px solid #e74c3c" },
  group: { marginBottom:"18px" },
  label: { display:"block", marginBottom:"6px", color:"#555", fontSize:"14px", fontWeight:"500" },
  input: { width:"100%", padding:"11px 14px", border:"1.5px solid #ddd", borderRadius:"6px", fontSize:"14px", outline:"none", boxSizing:"border-box" },
  btn: { width:"100%", padding:"12px", backgroundColor:"#3498db", color:"white", border:"none", borderRadius:"6px", fontSize:"15px", cursor:"pointer", marginTop:"8px", fontWeight:"500" },
  hintBox: { marginTop:"20px", padding:"12px", backgroundColor:"#f8f9fa", borderRadius:"6px" },
  hint: { color:"#7f8c8d", fontSize:"12px", marginBottom:"4px" }
};

export default LoginPage;
