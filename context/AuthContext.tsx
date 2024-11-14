import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import api from '../services/api';
import { setItem, getItem, removeItem } from '../utils/secure_store';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constant/storage_keys';

// Define the AuthContext
const AuthContext = createContext();

// Define the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a token is saved on initial load
    const loadToken = async () => {
      const token = await getItem(AUTH_TOKEN_KEY);
      if (token) setAuthToken(token);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/users/login', { email, password });

      if (response.data.success) {
        const token = response.data.token;
        await setItem(AUTH_TOKEN_KEY, token);
        setAuthToken(token);
        Alert.alert('Success', 'Login successful!');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
      console.error(error);
    }
  };

  const logout = async () => {
    await removeItem(AUTH_TOKEN_KEY);
    setAuthToken(null);
  };

  const refreshAuthToken = async () => {
    try {
      const refreshToken = await getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await api.post('/api/users/refresh-token', { token: refreshToken });
      const newToken = response.data.token;
      await setItem(AUTH_TOKEN_KEY, newToken);
      setAuthToken(newToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); // Logout if refresh fails
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout, loading, refreshAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
