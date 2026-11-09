import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferredLanguage: 'en-IN' | 'hi-IN' | 'gu-IN';
  preferredVoice: 'Nalini' | 'Kaveri' | 'Deepak';
  responseStyle: 'friendly' | 'professional' | 'concise' | 'detailed';
  learningLanguage?: 'en-IN' | 'hi-IN' | 'gu-IN';
  onboardingCompleted: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (payload: { name: string; email: string; password: string; confirmPassword?: string }) => Promise<UserProfile>;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
  updateOnboarding: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('vaani_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('vaani_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res);
          localStorage.setItem('vaani_user', JSON.stringify(res));
        } catch {
          // Token invalid
          localStorage.removeItem('vaani_token');
          localStorage.removeItem('vaani_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const res = await api.login({ email, password });
    localStorage.setItem('vaani_token', res.token);
    localStorage.setItem('vaani_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (payload: { name: string; email: string; password: string; confirmPassword?: string }): Promise<UserProfile> => {
    const res = await api.register(payload);
    localStorage.setItem('vaani_token', res.token);
    localStorage.setItem('vaani_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('vaani_token');
    localStorage.removeItem('vaani_user');
    setToken(null);
    setUser(null);
    api.clearMemory().catch(() => {});
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('vaani_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateOnboarding = async (data: Partial<UserProfile>) => {
    const res = await api.updateOnboarding(data);
    setUser(res.user);
    localStorage.setItem('vaani_user', JSON.stringify(res.user));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        updateOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

