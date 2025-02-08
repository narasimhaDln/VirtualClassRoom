import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid token
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with your backend
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);
  const verifyToken = async (token) => {
    try {
      const response = await fetch('https://virtualclassroom-project-default-rtdb.firebaseio.com/Users.json');
      if (response.ok) {
        const data = await response.json();
  
        // Convert email format for Firebase keys
        const userEmail = localStorage.getItem('email')?.replace('.', ',');
        if (userEmail && data[userEmail]) {
          setUser(data[userEmail]); // Correctly set user
        } else {
          localStorage.removeItem('token'); // No valid user found
          localStorage.removeItem('email');
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    } finally {
      setLoading(false);
    }
  };
  

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('email', userData.email.replace('.', ','));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email'); // Clear email too
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 