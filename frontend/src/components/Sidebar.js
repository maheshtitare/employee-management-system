import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

/**
 * 🗂️ Sidebar Component
 *
 * Left navigation panel with links to Dashboard, Employees, Departments.
 * Shows logged-in user name and role.
 * Logout button clears session and goes to login.
 */
const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo / Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">⚡</div>
        {!collapsed && <span className="brand-text">EMS Pro</span>}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <span className={`badge badge-${user?.role?.toLowerCase()}`}>
              {user?.role}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">{!collapsed && 'MAIN MENU'}</div>

        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📊</span>
          {!collapsed && <span className="nav-label">Dashboard</span>}
        </NavLink>

        <NavLink to="/employees" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">👥</span>
          {!collapsed && <span className="nav-label">Employees</span>}
        </NavLink>

        <NavLink to="/departments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏢</span>
          {!collapsed && <span className="nav-label">Departments</span>}
        </NavLink>

        <div className="nav-divider" />

        <button className="nav-item logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="sidebar-footer">
          <p>EMS v1.0</p>
          <p>© 2024 Fresher Project</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
