import React, { useState, useEffect, useCallback } from 'react';

/* ─────────────────────────────────────────────
   📢 Toast Notification Component
   Usage: <Toast message="Saved!" type="success" onClose={fn} />
   ───────────────────────────────────────────── */
export const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};

/* Custom hook to manage toasts */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

/* ─────────────────────────────────────────────
   ⏳ Loader / Spinner Component
   ───────────────────────────────────────────── */
export const Loader = ({ message = 'Loading...' }) => (
  <div className="loader-wrapper">
    <div className="spinner" />
    <p>{message}</p>
  </div>
);

/* ─────────────────────────────────────────────
   ❓ Confirm Delete Dialog
   ───────────────────────────────────────────── */
export const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-body" style={{ padding: '32px 28px' }}>
          <div className="confirm-icon">🗑️</div>
          <h3 className="modal-title">{title || 'Are you sure?'}</h3>
          <p className="confirm-text">{message || 'This action cannot be undone.'}</p>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   🏠 Header Component
   ───────────────────────────────────────────── */
export const Header = ({ title, subtitle }) => {
  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid var(--border)',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)', lineHeight: 1.2 }}>
          {title}
        </h1>
        {subtitle && <p style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '2px' }}>{subtitle}</p>}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--gray)' }}>
        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </header>
  );
};

/* ─────────────────────────────────────────────
   📭 Empty State Component
   ───────────────────────────────────────────── */
export const EmptyState = ({ icon = '📋', title = 'No Data Found', description = '' }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3>{title}</h3>
    {description && <p>{description}</p>}
  </div>
);
