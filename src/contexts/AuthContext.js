import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('currentUser');

      if (token && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          
          // Verify token is still valid
          await authService.fetchCurrentUser();
        } catch (error) {
          console.error('Auth initialization error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};