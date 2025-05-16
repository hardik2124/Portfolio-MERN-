import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Create the Authentication Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsLoading(true);
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Found token in localStorage, validating...');
          // Fetch current user info
          try {
            const response = await authService.getCurrentUser();
            if (response.data) {
              console.log('User authenticated successfully');
              setUser(response.data.user || response.data);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Token validation failed:', error);
            // Token is invalid, clear it
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('No token found in localStorage');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error checking login status:', err);
        localStorage.removeItem('token'); // Clear invalid token
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Refresh user data from server
  const refreshUserData = async () => {
    setIsLoading(true);
    try {
      const response = await authService.getCurrentUser();
      if (response.data) {
        setUser(response.data.user || response.data);
        return response.data;
      }
    } catch (err) {
      // Handle error silently
      console.error('Error refreshing user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.login(credentials);
      
      console.log('Login response:', response);
      
      // Check if we have a token in the response
      if (response.data && response.data.token) {
        // Store token in localStorage
        try {
          localStorage.setItem('token', response.data.token);
          console.log('Token stored successfully. Length:', response.data.token.length);
          
          // Verify token was stored
          const storedToken = localStorage.getItem('token');
          if (!storedToken) {
            console.error('Failed to verify token storage. Storage might be blocked.');
          }
        } catch (storageError) {
          console.error('Error storing token in localStorage:', storageError);
          // Continue anyway - we might still be able to use the token for this session
        }
        
        // Set user data from response
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          // If user data isn't in the expected format, fetch user data
          await refreshUserData();
        }
        
        setIsAuthenticated(true);
        return response.data;
      } else {
        // If no token in response, check if there's success data format
        if (response.data && response.data.success) {
          throw new Error('No token in server response. Please contact administrator.');
        } else {
          throw new Error('Invalid response format from server');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Value to be provided by the context
  const value = {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    error,
    login,
    logout,
    refreshUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 