import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  clinic_name: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (clinicName: string) => void;
  api: AxiosInstance;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { API_URL } from '../config';

// Create configured axios instance
const apiInstance = axios.create({
  baseURL: API_URL
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('med_jwt_token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set request interceptors for auth headers
  useEffect(() => {
    const interceptor = apiInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      apiInstance.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Load user profile on startup or token change
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await apiInstance.get('/api/auth/profile');
        setUser(response.data);
      } catch (err) {
        console.error("Failed to load user profile, token expired or invalid:", err);
        // Clear token
        localStorage.removeItem('med_jwt_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const login = async (newToken: string) => {
    localStorage.setItem('med_jwt_token', newToken);
    setToken(newToken);
    setLoading(true);
    try {
      const response = await apiInstance.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${newToken}` }
      });
      setUser(response.data);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed validation after login:", err);
      localStorage.removeItem('med_jwt_token');
      setToken(null);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('med_jwt_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (clinicName: string) => {
    if (user) {
      setUser({ ...user, clinic_name: clinicName });
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, updateUser, api: apiInstance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
