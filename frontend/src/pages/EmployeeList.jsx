import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeesAPI, deleteEmployeeAPI } from "../api/employeeAPI";

/**
 * EmployeeList - shows all employees in a table with:
 * - Search by name
 * - Filter by department
 * - Pagination
 * - Edit / Delete (Admin only)
 */
function EmployeeList() {
  const navigate = useNavigate();

  // ── State Variables ────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState([]);   // Current page employees
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter
  const [searchName, setSearchName] = useState("");
  const [filterDept, setFilterDept] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 5; // Show 5 records per page

  // Check role for showing admin actions
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "ADMIN";

  // ── useEffect: re-fetch when search/filter/page changes ───────────────────
  useEffect(() => {
    fetchEmployees();
  }, [searchName, filterDept, currentPage]); // Dependencies - runs when any changes

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployeesAPI(searchName, filterDept, currentPage, PAGE_SIZE);
      const { content, totalPages, totalElements } = res.data;
      setEmployees(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
    } catch (err) {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleFilter = (e) => {
    setFilterDept(e.target.value);
    setCurrentPage(0); // Reset to first page on filter change
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteEmployeeAPI(id);
      fetchEmployees(); // Refresh the list
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* Header row */}
      <div style={s.header}>
        <h2 style={s.title}>Employees
          <span style={s.count}>{totalElements} total</span>
        </h2>
        {isAdmin && (
          <button onClick={() => navigate("/employees/add")} style={s.addBtn}>
            + Add Employee
          </button>
        )}
      </div>

      {/* Search and Filter row */}
      <div style={s.filterRow}>
        <input
          type="text"
          placeholder="&#128269; Search by name..."
          value={searchName}
          onChange={handleSearch}
          style={s.searchInput}
        />
        <select value={filterDept} onChange={handleFilter} style={s.select}>
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Operations">Operations</option>
        </select>
      </div>

      {/* Error message */}
      {error && <div style={s.error}>{error}</div>}

      {/* Table or empty state */}
      {loading ? (
        <div style={s.center}>Loading employees...</div>
      ) : employees.length === 0 ? (
        <div style={s.empty}>
          <p>&#128100; No employees found.</p>
          <p style={{ fontSize:"14px", color:"#95a5a6", marginTop:"8px" }}>
            Try a different search or clear the filter.
          </p>
        </div>
      ) : (
        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>Name</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Department</th>
                <th style={s.th}>Salary</th>
                <th style={s.th}>Joined</th>
                {isAdmin && <th style={s.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} style={s.tr}>
                  <td style={s.td}>#{emp.id}</td>
                  <td style={s.td}>
                    <strong>{emp.name}</strong>
                  </td>
                  <td style={s.td}>{emp.email}</td>
                  <td style={s.td}>
                    <span style={s.badge}>{emp.department}</span>
                  </td>
                  <td style={s.td}>&#8377;{emp.salary?.toLocaleString("en-IN")}</td>
                  <td style={s.td}>
                    {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString("en-IN") : "-"}
                  </td>
                  {isAdmin && (
                    <td style={s.td}>
                      <button
                        onClick={() => navigate(`/employees/edit/${emp.id}`)}
                        style={s.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id, emp.name)}
                        style={s.delBtn}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={s.pagination}>
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 0}
            style={s.pageBtn}
          >
            &#8592; Prev
          </button>
          {/* Page number buttons */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{ ...s.pageBtn, ...(currentPage === i ? s.activePage : {}) }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages - 1}
            style={s.pageBtn}
          >
            Next &#8594;
          </button>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding:"28px 32px", maxWidth:"1100px", margin:"0 auto" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" },
  title: { color:"#2c3e50", fontSize:"22px", fontWeight:"600", display:"flex", alignItems:"center", gap:"10px" },
  count: { fontSize:"14px", backgroundColor:"#ebf5fb", color:"#2980b9", padding:"4px 10px", borderRadius:"12px", fontWeight:"normal" },
  addBtn: { backgroundColor:"#27ae60", color:"white", border:"none", padding:"10px 20px", borderRadius:"6px", cursor:"pointer", fontSize:"14px", fontWeight:"500" },
  filterRow: { display:"flex", gap:"12px", marginBottom:"18px" },
  searchInput: { flex:2, padding:"10px 14px", border:"1.5px solid #ddd", borderRadius:"6px", fontSize:"14px", outline:"none" },
  select: { flex:1, padding:"10px 14px", border:"1.5px solid #ddd", borderRadius:"6px", fontSize:"14px", outline:"none" },
  error: { color:"#e74c3c", padding:"12px", backgroundColor:"#fdecea", borderRadius:"6px", marginBottom:"14px" },
  center: { textAlign:"center", padding:"40px", color:"#7f8c8d" },
  empty: { textAlign:"center", padding:"60px", color:"#7f8c8d", fontSize:"18px" },
  tableWrapper: { backgroundColor:"white", borderRadius:"10px", boxShadow:"0 1px 6px rgba(0,0,0,0.08)", overflow:"hidden" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { padding:"14px 16px", backgroundColor:"#2c3e50", color:"white", textAlign:"left", fontSize:"13px", fontWeight:"500" },
  tr: { borderBottom:"1px solid #f0f0f0" },
  td: { padding:"13px 16px", color:"#444", fontSize:"14px" },
  badge: { backgroundColor:"#eaf4fb", color:"#2471a3", padding:"4px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:"600" },
  editBtn: { backgroundColor:"#f39c12", color:"white", border:"none", padding:"6px 12px", borderRadius:"4px", cursor:"pointer", marginRight:"6px", fontSize:"13px" },
  delBtn: { backgroundColor:"#e74c3c", color:"white", border:"none", padding:"6px 12px", borderRadius:"4px", cursor:"pointer", fontSize:"13px" },
  pagination: { display:"flex", justifyContent:"center", alignItems:"center", gap:"8px", marginTop:"20px" },
  pageBtn: { padding:"8px 14px", border:"1.5px solid #ddd", borderRadius:"6px", cursor:"pointer", backgroundColor:"white", fontSize:"14px", color:"#555" },
  activePage: { backgroundColor:"#3498db", color:"white", borderColor:"#3498db" }
};

export default EmployeeList;
