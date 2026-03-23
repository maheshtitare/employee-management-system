import React, { useEffect, useState } from 'react';
import { getDashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader, Header } from '../components/UIComponents';

/**
 * 📊 Dashboard Page
 *
 * Shows:
 * - Welcome message with logged-in user name
 * - Total Employees, Active Employees, Departments
 * - Department-wise bar chart of employee counts
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Colors for stat cards
  const cardColors = [
    { bg: '#ede9fe', icon: '👥', label: 'Total Employees', key: 'totalEmployees' },
    { bg: '#d1fae5', icon: '✅', label: 'Active Employees', key: 'activeEmployees' },
    { bg: '#dbeafe', icon: '🏢', label: 'Departments',      key: 'totalDepartments' },
  ];

  const deptColors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardAPI();
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const maxCount = stats
    ? Math.max(...(stats.departmentStats?.map(d => d.employeeCount) || [1]), 1)
    : 1;

  return (
    <div>
      <Header title="Dashboard" subtitle="Overview of your organization" />
      <div className="page-content">

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>Welcome back, {user?.name} 👋</h2>
            <p>Here's what's happening in your organization today.</p>
          </div>
          <div className="welcome-role">
            <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
          </div>
        </div>

        {loading ? (
          <Loader message="Fetching dashboard data..." />
        ) : (
          <>
            {/* Stat Cards */}
            <div className="stats-grid">
              {cardColors.map((card) => (
                <div className="stat-card" key={card.key}>
                  <div className="stat-icon" style={{ background: card.bg }}>
                    {card.icon}
                  </div>
                  <div className="stat-info">
                    <label>{card.label}</label>
                    <h3>{stats?.[card.key] ?? 0}</h3>
                  </div>
                </div>
              ))}
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fee2e2' }}>😴</div>
                <div className="stat-info">
                  <label>Inactive Employees</label>
                  <h3>{(stats?.totalEmployees || 0) - (stats?.activeEmployees || 0)}</h3>
                </div>
              </div>
            </div>

            {/* Department Chart */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 style={{ fontWeight: '700', fontSize: '17px' }}>Employees by Department</h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '2px' }}>
                    Staff distribution across departments
                  </p>
                </div>
              </div>
              <div className="card-body dept-chart">
                {stats?.departmentStats?.length === 0 ? (
                  <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '20px' }}>
                    No department data available.
                  </p>
                ) : (
                  stats?.departmentStats?.map((dept, idx) => (
                    <div className="dept-bar-row" key={dept.departmentName}>
                      <div className="dept-bar-label">
                        <span>{dept.departmentName}</span>
                        <span style={{ fontWeight: '700' }}>{dept.employeeCount}</span>
                      </div>
                      <div className="dept-bar-bg">
                        <div
                          className="dept-bar-fill"
                          style={{
                            width: `${(dept.employeeCount / maxCount) * 100}%`,
                            background: `linear-gradient(90deg, ${deptColors[idx % deptColors.length]}, ${deptColors[(idx + 1) % deptColors.length]})`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .welcome-banner {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border-radius: var(--radius-lg);
          padding: 28px 32px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          box-shadow: 0 8px 30px rgba(79,70,229,0.35);
        }
        .welcome-banner h2 { font-size: 24px; font-weight: 800; }
        .welcome-banner p  { font-size: 14px; opacity: 0.8; margin-top: 4px; }
        .welcome-role .badge { font-size: 13px; padding: 6px 16px; }
      `}</style>
    </div>
  );
};

export default DashboardPage;
