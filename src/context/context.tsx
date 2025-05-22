import React, { createContext, useState, useContext } from 'react';
import { clearAuthData } from '../services/Auth/authAPI';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  });

  const setToken = (newToken: string | null) => {
    if (newToken) {
      sessionStorage.setItem(AUTH_TOKEN_KEY, newToken);
    } else {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
    setTokenState(newToken);
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
