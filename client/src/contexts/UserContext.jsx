import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getCurrentUser } from '../api/api';

// Create UserContext
const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

/**
 * UserProvider Component
 * Manages user authentication state and JWT token
 * Automatically loads user from localStorage on mount
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Decode JWT token and extract user data
   * JWT tokens have 3 parts: header.payload.signature
   * We decode the payload (middle part) which contains user data
   */
  const decodeToken = (jwtToken) => {
    try {
      if (!jwtToken) return null;

      // Split token into parts
      const parts = jwtToken.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT token format');
        return null;
      }

      // Decode the payload (base64 encoded)
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));

      // Return decoded user data (excludes password as per backend implementation)
      return {
        id: decoded.id,
        name: decoded.name,
        role: decoded.role,
        courses: decoded.courses || [],
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  /**
   * Load user data from localStorage on component mount
   * This allows the app to remember logged-in users across page refreshes
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
          // Decode token to get user data
          const decodedUser = decodeToken(storedToken);

          if (decodedUser) {
            setToken(storedToken);
            setUser(decodedUser);

            // Optionally verify token is still valid by calling backend
            try {
              const response = await getCurrentUser();
              if (response?.success && response.user) {
                // Update with latest user data from backend
                setUser(response.user);
              }
            } catch (error) {
              // Token might be expired, clear it
              console.warn('Token validation failed:', error);
              localStorage.removeItem('token');
              setToken(null);
              setUser(null);
            }
          } else {
            // Invalid token format, clear it
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login function
   * Sends credentials to backend and stores JWT token
   */
  const login = async (name, password) => {
    try {
      const response = await loginApi(name, password);

      if (response?.success && response.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        setToken(response.token);

        // Decode token and set user data
        const decodedUser = decodeToken(response.token);
        if (decodedUser) {
          setUser(decodedUser);
        } else if (response.user) {
          // Fallback to user data from response if token decode fails
          setUser(response.user);
        }

        return { success: true, user: decodedUser || response.user };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  /**
   * Register function
   * Creates a new user account (admin only - does not log in as the new user)
   * Admin creates users for others, so no token is returned
   */
  const register = async (name, password, role = 'student') => {
    try {
      const response = await registerApi(name, password, role);

      if (response?.success) {
        // Registration successful - return user data (no token since admin creates for others)
        return { success: true, user: response.user, message: response.message };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  };

  /**
   * Logout function
   * Clears token and user data
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    setUser, // Allow manual user updates if needed
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

