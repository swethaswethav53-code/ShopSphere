import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const userData = response.data.data || response.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/register', credentials);
      const userData = response.data.data || response.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};