import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addEmployeeAPI, updateEmployeeAPI, getEmployeeByIdAPI } from "../api/employeeAPI";

/**
 * EmployeeForm - used for BOTH adding and editing employees.
 *
 * How it knows which mode it is in:
 * - Add mode:  URL is /employees/add    -> useParams().id = undefined
 * - Edit mode: URL is /employees/edit/5 -> useParams().id = "5"
 *
 * If editing: fetches existing data and pre-fills the form.
 */
function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();     // Exists only in edit mode
  const isEditing = !!id;         // true if id exists

  // ── Form State ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing); // Loading existing data
  const [error, setError] = useState("");

  // ── useEffect: pre-fill form when editing ──────────────────────────────────
  useEffect(() => {
    if (isEditing) {
      const loadEmployee = async () => {
        try {
          const res = await getEmployeeByIdAPI(id);
          const { name, email, department, salary } = res.data;
          setForm({ name, email, department, salary }); // Pre-fill form
        } catch (err) {
          setError("Could not load employee details.");
        } finally {
          setFetchLoading(false);
        }
      };
      loadEmployee();
    }
  }, [id, isEditing]);

  // ── Handle input changes ───────────────────────────────────────────────────
  // Spread operator (...form) keeps other fields, only updates the changed one
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── Handle form submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditing) {
        await updateEmployeeAPI(id, form);
        alert("Employee updated successfully!");
      } else {
        await addEmployeeAPI(form);
        alert("Employee added successfully!");
      }
      navigate("/employees"); // Go back to employee list
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching employee for editing
  if (fetchLoading) return <div style={s.center}>Loading employee data...</div>;

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.cardHeader}>
          <h2 style={s.title}>
            {isEditing ? "&#9998; Edit Employee" : "&#43; Add New Employee"}
          </h2>
          <p style={s.subtitle}>
            {isEditing ? "Update employee details below" : "Fill in the details to add a new employee"}
          </p>
        </div>

        {/* Error message */}
        {error && <div style={s.errorBox}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={s.group}>
            <label style={s.label}>Full Name <span style={s.req}>*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Kumar"
              style={s.input}
              required
            />
          </div>

          {/* Email */}
          <div style={s.group}>
            <label style={s.label}>Email Address <span style={s.req}>*</span></label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ramesh@company.com"
              style={s.input}
              required
            />
          </div>

          {/* Department Dropdown */}
          <div style={s.group}>
            <label style={s.label}>Department <span style={s.req}>*</span></label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              style={s.input}
              required
            >
              <option value="">-- Select Department --</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          {/* Salary */}
          <div style={s.group}>
            <label style={s.label}>Salary (&#8377;) <span style={s.req}>*</span></label>
            <input
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g. 60000"
              style={s.input}
              required
              min="0"
              step="1000"
            />
          </div>

          {/* Action Buttons */}
          <div style={s.btnRow}>
            <button
              type="button"
              onClick={() => navigate("/employees")}
              style={s.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Saving..." : isEditing ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { display:"flex", justifyContent:"center", alignItems:"flex-start", padding:"32px 24px", backgroundColor:"#f0f2f5", minHeight:"90vh" },
  center: { textAlign:"center", padding:"60px", color:"#7f8c8d" },
  card: { backgroundColor:"white", borderRadius:"10px", boxShadow:"0 4px 20px rgba(0,0,0,0.1)", width:"500px", overflow:"hidden" },
  cardHeader: { backgroundColor:"#2c3e50", padding:"24px 28px" },
  title: { color:"white", fontSize:"20px", fontWeight:"600", marginBottom:"4px" },
  subtitle: { color:"#bdc3c7", fontSize:"14px" },
  errorBox: { backgroundColor:"#fdecea", color:"#c0392b", padding:"12px 16px", fontSize:"14px", borderLeft:"3px solid #e74c3c", margin:"16px 28px 0" },
  group: { padding:"0 28px", marginTop:"20px" },
  label: { display:"block", marginBottom:"6px", color:"#555", fontSize:"14px", fontWeight:"500" },
  req: { color:"#e74c3c" },
  input: { width:"100%", padding:"11px 14px", border:"1.5px solid #ddd", borderRadius:"6px", fontSize:"14px", outline:"none", boxSizing:"border-box" },
  btnRow: { display:"flex", gap:"12px", padding:"24px 28px" },
  cancelBtn: { flex:1, padding:"12px", border:"1.5px solid #ddd", borderRadius:"6px", cursor:"pointer", backgroundColor:"white", fontSize:"14px", color:"#555" },
  submitBtn: { flex:2, padding:"12px", backgroundColor:"#3498db", color:"white", border:"none", borderRadius:"6px", cursor:"pointer", fontSize:"14px", fontWeight:"500" }
};

export default EmployeeForm;
