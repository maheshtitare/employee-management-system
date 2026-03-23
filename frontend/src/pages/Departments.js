import React, { useEffect, useState } from 'react';
import { getAllDepartmentsAPI, createDepartmentAPI, updateDepartmentAPI, deleteDepartmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader, EmptyState, ConfirmDialog, useToast, Toast, Header } from '../components/UIComponents';

/**
 * 🏢 Departments Page
 *
 * Shows all departments in cards.
 * Admin can: Create, Edit, Delete department.
 * Shows employee count per department.
 */
const DepartmentsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { toasts, addToast } = useToast();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]        = useState(false);
  const [editDept, setEditDept]        = useState(null);
  const [deptName, setDeptName]        = useState('');
  const [nameError, setNameError]      = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: '' });

  const deptIcons = { HR: '🧑‍💼', IT: '💻', Sales: '💰', Finance: '📈', Marketing: '📣' };
  const deptColors = ['#ede9fe', '#dbeafe', '#d1fae5', '#fef3c7', '#fee2e2', '#e0f2fe', '#f3e8ff'];

  useEffect(() => { loadDepartments(); }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const res = await getAllDepartmentsAPI();
      setDepartments(res.data);
    } catch { addToast('Failed to load departments.', 'error'); }
    finally { setLoading(false); }
  };

  const openAddForm = () => { setEditDept(null); setDeptName(''); setNameError(''); setShowForm(true); };
  const openEditForm = (dept) => { setEditDept(dept); setDeptName(dept.name); setNameError(''); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deptName.trim()) { setNameError('Department name is required'); return; }
    try {
      if (editDept) {
        await updateDepartmentAPI(editDept.id, { name: deptName });
        addToast('Department Updated ✅', 'success');
      } else {
        await createDepartmentAPI({ name: deptName });
        addToast('Department Created ✅', 'success');
      }
      setShowForm(false);
      loadDepartments();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDepartmentAPI(deleteConfirm.id);
      addToast(`"${deleteConfirm.name}" deleted ✅`, 'success');
      setDeleteConfirm({ open: false, id: null, name: '' });
      loadDepartments();
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed. Remove employees first.', 'error');
      setDeleteConfirm({ open: false, id: null, name: '' });
    }
  };

  return (
    <div>
      <Toast toasts={toasts} />
      <Header title="Departments" subtitle="Manage organizational departments" />
      <div className="page-content">

        <div className="page-header">
          <div>
            <h2 className="page-title">All Departments</h2>
            <p className="page-subtitle">{departments.length} department(s)</p>
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={openAddForm}>＋ Add Department</button>
          )}
        </div>

        {loading ? <Loader message="Loading departments..." /> : (
          departments.length === 0 ? (
            <EmptyState icon="🏢" title="No Departments Found" description="Create your first department to get started." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {departments.map((dept, idx) => (
                <div className="card" key={dept.id} style={{ padding: 0 }}>
                  <div style={{
                    background: deptColors[idx % deptColors.length],
                    padding: '28px 24px 20px',
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 44, marginBottom: 8 }}>
                      {deptIcons[dept.name] || '🏢'}
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 800 }}>{dept.name}</h3>
                  </div>
                  <div style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontSize: 13, color: 'var(--gray)', fontWeight: 600 }}>Employees</span>
                      <span style={{
                        background: 'var(--primary)', color: 'white',
                        borderRadius: 20, padding: '3px 14px', fontSize: 13, fontWeight: 700
                      }}>{dept.employeeCount}</span>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => openEditForm(dept)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" style={{ flex: 1 }}
                          onClick={() => setDeleteConfirm({ open: true, id: dept.id, name: dept.name })}>
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Add/Edit Department Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editDept ? '✏️ Edit Department' : '➕ New Department'}</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Department Name *</label>
                  <input
                    type="text"
                    value={deptName}
                    onChange={(e) => { setDeptName(e.target.value); setNameError(''); }}
                    className={`form-control ${nameError ? 'error' : ''}`}
                    placeholder="e.g. Engineering, Marketing..."
                    autoFocus
                  />
                  {nameError && <p className="form-error">{nameError}</p>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editDept ? '✅ Update' : '➕ Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete Department?"
        message={`"${deleteConfirm.name}" will be permanently deleted. Make sure no employees are assigned.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null, name: '' })}
      />
    </div>
  );
};

export default DepartmentsPage;
