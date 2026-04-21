import React, { createContext, useContext, useState, useEffect } from 'react';

// AuthContext: Manages the authentication state of the application
// Stores tokens, handles login/logout, and decodes user roles from JWT
const AuthContext = createContext();

// Custom hook to easily access auth state from any component
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    setAuthLoading(true);
    if (token) {
      try {
        // Step 1: Extract and decode the JWT payload (Base64)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decoded = JSON.parse(jsonPayload);

        // Step 2: Check for Token Expiration (Time-based security)
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.warn('Token expired');
          logout();
          setAuthLoading(false);
          return;
        }

        // Step 3: Persist token and update logged-in state
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        
        // Step 4: Extract User Role from specific JWT claims
        // ASP.NET Core often uses the full schema URI for roles
        const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || decoded.Role;
        
        // Handle cases where a user might have multiple roles (Array) or a single one (String)
        if (Array.isArray(roleClaim)) {
          setUserRole(roleClaim.includes('Admin') ? 'Admin' : 'User');
        } else {
          setUserRole(roleClaim || 'User');
        }
      } catch (err) {
        console.error('Invalid token format or processing error');
        logout();
      }
    } else {
      // Clear all state if no token exists
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserRole(null);
    }
    setAuthLoading(false);
  }, [token]);

  // Updates the token state and triggers the useEffect to re-validate
  const login = (newToken) => {
    setToken(newToken);
  };

  // Clears the token state and triggers the useEffect to cleanup
  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, userRole, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
