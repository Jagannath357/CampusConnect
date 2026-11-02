import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile } from '../types';
import api from '../services/api';
import { disconnectSocket } from '../services/socket';

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('cc_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cc_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const currentToken = localStorage.getItem('cc_token');
    if (!currentToken) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data.user);
        setProfile(res.data.data.profile || null);
        localStorage.setItem('cc_user', JSON.stringify(res.data.data.user));
        if (res.data.data.profile) {
          localStorage.setItem('cc_profile', JSON.stringify(res.data.data.profile));
        }
      }
    } catch (err: any) {
      console.warn('[AuthContext] Session expired or user suspended');
      setUser(null);
      setProfile(null);
      setToken(null);
      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
      localStorage.removeItem('cc_profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser, profile: receivedProfile } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      setProfile(receivedProfile || null);

      localStorage.setItem('cc_token', receivedToken);
      localStorage.setItem('cc_user', JSON.stringify(receivedUser));
      if (receivedProfile) {
        localStorage.setItem('cc_profile', JSON.stringify(receivedProfile));
      }
    }
    return res.data;
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser, profile: receivedProfile } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      setProfile(receivedProfile || null);

      localStorage.setItem('cc_token', receivedToken);
      localStorage.setItem('cc_user', JSON.stringify(receivedUser));
      if (receivedProfile) {
        localStorage.setItem('cc_profile', JSON.stringify(receivedProfile));
      }
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      disconnectSocket();
      setUser(null);
      setProfile(null);
      setToken(null);
      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
      localStorage.removeItem('cc_profile');
      window.location.href = '/login';
    }
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
        refreshUser,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

