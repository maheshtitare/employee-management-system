import React, { useEffect, useState, useCallback } from 'react';
import {
  getAllEmployeesAPI, addEmployeeAPI, updateEmployeeAPI,
  deleteEmployeeAPI, getAllDepartmentsAPI, searchEmployeesAPI,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader, EmptyState, ConfirmDialog, useToast, Toast, Header } from '../components/UIComponents';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeProfile from '../components/EmployeeProfile';

/**
 * 👥 Employees Page
 *
 * Features:
 * - Display all employees in a table
 * - Add / Edit / Soft-Delete employee
 * - Real-time search by name
 * - Filter by department
 * - Sort by name or salary
 * - Pagination (5 per page)
 * - Click row to view profile
 */
const ITEMS_PER_PAGE = 5;

const EmployeesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const { toasts, addToast } = useToast();

  const [employees, setEmployees]     = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);

  // Modal state
  const [showForm, setShowForm]             = useState(false);
  const [editEmployee, setEditEmployee]     = useState(null);
  const [viewEmployee, setViewEmployee]     = useState(null);
  const [deleteConfirm, setDeleteConfirm]   = useState({ open: false, id: null, name: '' });

  // Filter / Search / Sort state
  const [search, setSearch]               = useState('');
  const [filterDept, setFilterDept]       = useState('');
  const [sortBy, setSortBy]               = useState('');
  const [currentPage, setCurrentPage]     = useState(1);

  // Load employees and departments on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([getAllEmployeesAPI(), getAllDepartmentsAPI()]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      addToast('Failed to load data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Search handler (real-time) ──
  const handleSearch = async (value) => {
    setSearch(value);
    setCurrentPage(1);
    if (value.trim() === '') {
      loadData();
      return;
    }
    try {
      const res = await searchEmployeesAPI(value);
      setEmployees(res.data);
    } catch {
      addToast('Search failed.', 'error');
    }
  };

  // ── Filter by department ──
  const handleDeptFilter = (deptId) => {
    setFilterDept(deptId);
    setCurrentPage(1);
  };

  // ── Sort ──
  const handleSort = (field) => {
    setSortBy(field);
    const sorted = [...employees].sort((a, b) => {
      if (field === 'name') return a.name.localeCompare(b.name);
      if (field === 'salary') return (b.salary || 0) - (a.salary || 0);
      return 0;
    });
    setEmployees(sorted);
  };

  // ── Add Employee ──
  const handleAddEmployee = async (formData) => {
    try {
      await addEmployeeAPI(formData);
      addToast('Employee Added Successfully ✅', 'success');
      setShowForm(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data || {})[0] || 'Add failed.';
      addToast(msg, 'error');
    }
  };

  // ── Edit Employee ──
  const handleEditEmployee = async (formData) => {
    try {
      await updateEmployeeAPI(editEmployee.id, formData);
      addToast('Updated Successfully ✅', 'success');
      setEditEmployee(null);
      setShowForm(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed.';
      addToast(msg, 'error');
    }
  };

  // ── Soft Delete ──
  const handleDelete = async () => {
    try {
      await deleteEmployeeAPI(deleteConfirm.id);
      addToast(`${deleteConfirm.name} marked as Inactive 🗑️`, 'success');
      setDeleteConfirm({ open: false, id: null, name: '' });
      loadData();
    } catch {
      addToast('Delete failed.', 'error');
    }
  };

  // ── Filtering & Pagination ──
  const filtered = employees.filter(emp => {
    if (filterDept) return String(emp.departmentId) === String(filterDept);
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      <Toast toasts={toasts} />
      <Header title="Employees" subtitle="Manage your workforce" />
      <div className="page-content">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h2 className="page-title">All Employees</h2>
            <p className="page-subtitle">{filtered.length} employee(s) found</p>
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => { setEditEmployee(null); setShowForm(true); }}>
              ＋ Add Employee
            </button>
          )}
        </div>

        <div className="card">
          {/* Toolbar: Search + Filter + Sort */}
          <div className="toolbar">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <select className="filter-select" value={filterDept} onChange={(e) => handleDeptFilter(e.target.value)}>
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <select className="filter-select" value={sortBy} onChange={(e) => handleSort(e.target.value)}>
              <option value="">Sort By</option>
              <option value="name">Name A-Z</option>
              <option value="salary">Salary High-Low</option>
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <Loader message="Loading employees..." />
          ) : paginated.length === 0 ? (
            <EmptyState icon="👤" title="No Employees Found" description="Try a different search or add a new employee." />
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th onClick={() => handleSort('name')} title="Sort by Name">Name ↕</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Department</th>
                    <th onClick={() => handleSort('salary')} title="Sort by Salary">Salary ↕</th>
                    <th>Joining Date</th>
                    <th>Status</th>
                    {isAdmin && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((emp, idx) => (
                    <tr key={emp.id} style={{ cursor: 'pointer' }}>
                      <td onClick={() => setViewEmployee(emp)} style={{ color: 'var(--gray)', fontWeight: 600 }}>
                        {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                      </td>
                      <td onClick={() => setViewEmployee(emp)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 800, fontSize: 13, flexShrink: 0,
                          }}>
                            {emp.name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600 }}>{emp.name}</span>
                        </div>
                      </td>
                      <td onClick={() => setViewEmployee(emp)} style={{ color: 'var(--gray)' }}>{emp.email}</td>
                      <td onClick={() => setViewEmployee(emp)} style={{ color: 'var(--gray)' }}>{emp.mobile}</td>
                      <td onClick={() => setViewEmployee(emp)}>
                        <span style={{ background: '#ede9fe', color: '#5b21b6', padding: '3px 10px', borderRadius: '20px', fontSize: 12, fontWeight: 600 }}>
                          {emp.departmentName || '-'}
                        </span>
                      </td>
                      <td onClick={() => setViewEmployee(emp)} style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>
                        ₹{emp.salary?.toLocaleString('en-IN') || '-'}
                      </td>
                      <td onClick={() => setViewEmployee(emp)} style={{ color: 'var(--gray)' }}>
                        {emp.joiningDate || '-'}
                      </td>
                      <td onClick={() => setViewEmployee(emp)}>
                        <span className={`badge ${emp.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                          {emp.status === 'Active' ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="btn btn-success btn-sm btn-icon"
                              title="Edit"
                              onClick={() => { setEditEmployee(emp); setShowForm(true); }}
                            >✏️</button>
                            <button
                              className="btn btn-danger btn-sm btn-icon"
                              title="Delete"
                              onClick={() => setDeleteConfirm({ open: true, id: emp.id, name: emp.name })}
                            >🗑️</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="pagination">
              <span>Showing {Math.min((currentPage-1)*ITEMS_PER_PAGE+1, filtered.length)}–{Math.min(currentPage*ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</span>
              <div className="pagination-controls">
                <button className="page-num" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>‹ Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i+1).map(page => (
                  <button key={page} className={`page-num ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                ))}
                <button className="page-num" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>Next ›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editEmployee}
          departments={departments}
          onSubmit={editEmployee ? handleEditEmployee : handleAddEmployee}
          onClose={() => { setShowForm(false); setEditEmployee(null); }}
        />
      )}

      {/* Profile View Modal */}
      {viewEmployee && (
        <EmployeeProfile employee={viewEmployee} onClose={() => setViewEmployee(null)} />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Deactivate Employee?"
        message={`"${deleteConfirm.name}" will be marked as Inactive. You can reactivate later.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null, name: '' })}
      />
    </div>
  );
};

export default EmployeesPage;
