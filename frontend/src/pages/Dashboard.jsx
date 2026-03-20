import React, { useState, useEffect } from "react";
import { getDashboardAPI } from "../api/employeeAPI";
import { useNavigate } from "react-router-dom";

/**
 * Dashboard - shows employee stats at a glance.
 *
 * useEffect: fetches data when the component first renders.
 * useState: stores the fetched data.
 */
function Dashboard() {
  const [data, setData] = useState(null);    // Dashboard data from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Read logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // useEffect runs once when component mounts (empty [] dependency array)
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardAPI();
        setData(response.data);
      } catch (err) {
        setError("Failed to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div style={s.center}>Loading dashboard...</div>;
  if (error) return <div style={{ ...s.center, color:"#e74c3c" }}>{error}</div>;

  const colors = ["#3498db", "#27ae60", "#e67e22", "#9b59b6", "#e74c3c", "#1abc9c"];

  return (
    <div style={{ ...s.page, animation: "fadeIn 0.8s ease-in" }}>
      <h2 style={s.title}>Welcome back, {user.name}! &#128075;</h2>
      <p style={s.subtitle}>Here is your company overview</p>

      {/* Stats */}
      <div style={s.statsRow}>
        <div style={{ ...s.statCard, backgroundColor:"#3498db" }}>
          <div style={s.statNumber}>{data.totalEmployees}</div>
          <div style={s.statLabel}>Total Employees</div>
        </div>
        <div style={{ ...s.statCard, backgroundColor:"#27ae60" }}>
          <div style={s.statNumber}>{Object.keys(data.departmentCount).length}</div>
          <div style={s.statLabel}>Departments</div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h3 style={s.sectionTitle}>Department Breakdown</h3>
          <button onClick={() => navigate("/employees")} style={s.viewBtn}>
            View All Employees &#8594;
          </button>
        </div>

        <div style={s.deptGrid}>
          {Object.entries(data.departmentCount).map(([dept, count], idx) => (
            <div key={dept} style={{ ...s.deptCard, borderTopColor: colors[idx % colors.length] }}>
              <div style={s.deptName}>{dept}</div>
              <div style={s.deptCount}>{count}</div>
              <div style={s.deptLabel}>employees</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding:"28px 32px", maxWidth:"960px", margin:"0 auto" },
  center: { textAlign:"center", padding:"60px", color:"#7f8c8d", fontSize:"16px" },
  title: { color:"#2c3e50", fontSize:"24px", fontWeight:"600", marginBottom:"4px" },
  subtitle: { color:"#7f8c8d", fontSize:"15px", marginBottom:"28px" },
  statsRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"28px" },
  statCard: { color:"white", padding:"28px", borderRadius:"10px", textAlign:"center" },
  statNumber: { fontSize:"52px", fontWeight:"700", lineHeight:1 },
  statLabel: { fontSize:"15px", marginTop:"8px", opacity:0.9 },
  section: { backgroundColor:"white", padding:"24px", borderRadius:"10px", boxShadow:"0 1px 6px rgba(0,0,0,0.08)" },
  sectionHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" },
  sectionTitle: { color:"#2c3e50", fontSize:"17px", fontWeight:"600" },
  viewBtn: { backgroundColor:"transparent", color:"#3498db", border:"1.5px solid #3498db", padding:"7px 16px", borderRadius:"6px", cursor:"pointer", fontSize:"13px" },
  deptGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:"14px" },
  deptCard: { padding:"20px 16px", borderRadius:"8px", backgroundColor:"#f8f9fa", borderTop:"3px solid #3498db", textAlign:"center" },
  deptName: { fontWeight:"600", color:"#2c3e50", fontSize:"15px", marginBottom:"8px" },
  deptCount: { fontSize:"32px", fontWeight:"700", color:"#2c3e50" },
  deptLabel: { fontSize:"12px", color:"#7f8c8d", marginTop:"2px" }
};

export default Dashboard;