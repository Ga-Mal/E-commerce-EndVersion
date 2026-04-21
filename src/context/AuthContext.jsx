import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decoded = JSON.parse(jsonPayload);
        // Extract role. ASP.NET core usually puts it in schemas.microsoft.../role or 'role'
        const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || decoded.Role;
        
        // Handle array of roles or single string
        if (Array.isArray(roleClaim)) {
          setUserRole(roleClaim.includes('Admin') ? 'Admin' : 'User');
        } else {
          setUserRole(roleClaim || 'User');
        }
      } catch (err) {
        console.error('Invalid token format');
        logout();
      }
    } else {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
