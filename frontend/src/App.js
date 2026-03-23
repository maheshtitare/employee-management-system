import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar    from './components/Sidebar';
import LoginPage  from './pages/Login';
import Dashboard  from './pages/Dashboard';
import Employees  from './pages/Employees';
import Departments from './pages/Departments';

import './styles/global.css';

/**
 * 🔒 ProtectedRoute Component
 *
 * Wraps any route that requires the user to be logged in.
 * If user is not logged in → redirect to /login
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/**
 * 🏗️ AppLayout Component
 *
 * Main layout with Sidebar + content area.
 * Used for all authenticated pages.
 */
const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">
      {children}
    </main>
  </div>
);

/**
 * 🚀 App Component
 *
 * Root component.
 * Sets up React Router with all page routes.
 * Wraps everything in AuthProvider for global auth state.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Route: Login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes: Require login */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <AppLayout><Employees /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <AppLayout><Departments /></AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
