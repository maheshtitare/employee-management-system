import React, { useState, useEffect } from 'react';

/**
 * 📝 EmployeeForm Component
 *
 * Reusable modal form for both ADD and EDIT employee.
 * Props:
 * - employee: null for add, employee object for edit
 * - departments: list of departments for dropdown
 * - onSubmit: called with form data
 * - onClose: close the modal
 */
const EmployeeForm = ({ employee, departments, onSubmit, onClose }) => {
  const isEdit = !!employee;

  const [form, setForm] = useState({
    name: '', email: '', mobile: '', departmentId: '',
    salary: '', joiningDate: '', status: 'Active',
  });
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (employee) {
      setForm({
        name:         employee.name || '',
        email:        employee.email || '',
        mobile:       employee.mobile || '',
        departmentId: employee.departmentId || '',
        salary:       employee.salary || '',
        joiningDate:  employee.joiningDate || '',
        status:       employee.status || 'Active',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Client-side validation
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())       newErrors.name = 'Name is required';
    if (!form.email.trim())      newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.mobile.trim())     newErrors.mobile = 'Mobile is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobile)) newErrors.mobile = 'Invalid mobile (10 digits starting 6-9)';
    if (!form.departmentId)      newErrors.departmentId = 'Department is required';
    if (!form.salary)            newErrors.salary = 'Salary is required';
    else if (isNaN(form.salary) || Number(form.salary) < 0) newErrors.salary = 'Enter valid salary';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Convert types before sending to API
    onSubmit({
      ...form,
      departmentId: Number(form.departmentId),
      salary: Number(form.salary),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isEdit ? '✏️ Edit Employee' : '➕ Add New Employee'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">

              {/* Name */}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  placeholder="e.g. Aarav Sharma" />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  placeholder="aarav@company.com" />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input type="tel" name="mobile" value={form.mobile} onChange={handleChange}
                  className={`form-control ${errors.mobile ? 'error' : ''}`}
                  placeholder="9XXXXXXXXX" maxLength="10" />
                {errors.mobile && <p className="form-error">{errors.mobile}</p>}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select name="departmentId" value={form.departmentId} onChange={handleChange}
                  className={`form-control ${errors.departmentId ? 'error' : ''}`}>
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                {errors.departmentId && <p className="form-error">{errors.departmentId}</p>}
              </div>

              {/* Salary */}
              <div className="form-group">
                <label className="form-label">Salary (₹) *</label>
                <input type="number" name="salary" value={form.salary} onChange={handleChange}
                  className={`form-control ${errors.salary ? 'error' : ''}`}
                  placeholder="e.g. 75000" min="0" />
                {errors.salary && <p className="form-error">{errors.salary}</p>}
              </div>

              {/* Joining Date */}
              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange}
                  className="form-control" />
              </div>

              {/* Status (only show in edit mode) */}
              {isEdit && (
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="form-control">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}

            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? '✅ Update Employee' : '➕ Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
