import React from 'react';

/**
 * 👤 EmployeeProfile Component
 *
 * Shows full employee details in a card/modal format.
 * Opened when user clicks on a row in the employee table.
 */
const EmployeeProfile = ({ employee, onClose }) => {
  if (!employee) return null;

  const initials = employee.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const infoItems = [
    { label: 'Employee ID',   value: `EMP-${String(employee.id).padStart(4, '0')}` },
    { label: 'Email',         value: employee.email },
    { label: 'Mobile',        value: employee.mobile },
    { label: 'Department',    value: employee.departmentName || '-' },
    { label: 'Salary',        value: `₹${employee.salary?.toLocaleString('en-IN') || '-'}` },
    { label: 'Joining Date',  value: employee.joiningDate || '-' },
    { label: 'Status',        value: employee.status },
    { label: 'Last Updated',  value: employee.updatedAt ? new Date(employee.updatedAt).toLocaleDateString('en-IN') : '-' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">👤 Employee Profile</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Avatar + Name */}
          <div className="profile-card">
            <div className="profile-avatar">{initials}</div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>{employee.name}</h2>
            <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>{employee.departmentName || 'No Department'}</p>
            <div style={{ marginTop: 12 }}>
              <span className={`badge ${employee.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                {employee.status === 'Active' ? '● Active' : '○ Inactive'}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="profile-info-grid">
            {infoItems.map(item => (
              <div className="profile-info-item" key={item.label}>
                <label>{item.label}</label>
                <span
                  style={item.label === 'Status'
                    ? { color: employee.status === 'Active' ? 'var(--success)' : 'var(--danger)' }
                    : {}}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
