// File: src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // Check localStorage on initial load
  const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const initialToken = localStorage.getItem('token') || null;

  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser);

  // 3. Define the Login/Logout Handlers
  const login = (userData, jwtToken) => {
    // Update local state
    setUser(userData);
    setToken(jwtToken);
    setIsLoggedIn(true);

    // Persist to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwtToken);
  };

  const logout = () => {
    // Update local state
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);

    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // 4. Update the Axios Interceptor
  // This effect ensures the token is always in the API instance header
  useEffect(() => {
    if (token) {
      // Set the default Authorization header for all API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Remove the header on logout
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);


  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Custom Hook for easy consumption
export const useAuth = () => {
  return useContext(AuthContext);
};