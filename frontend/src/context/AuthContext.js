import React, { createContext, useContext, useState } from 'react';

/**
 * 🔐 AuthContext
 *
 * Global state for authentication.
 * Any component can call useAuth() to get:
 * - user: logged in user info
 * - login(userData): save user to state + sessionStorage
 * - logout(): clear user and redirect to login
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Try to restore user from sessionStorage (page refresh)
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('ems_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Called after successful login API response
  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('ems_user', JSON.stringify(userData));
  };

  // Called when user clicks Logout
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('ems_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — easy to use in any component
export const useAuth = () => useContext(AuthContext);
