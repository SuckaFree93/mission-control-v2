'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  lastLoginAt?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedTokenExpiry = localStorage.getItem('tokenExpiry');

        if (storedUser && storedAccessToken && storedRefreshToken && storedTokenExpiry) {
          const parsedUser = JSON.parse(storedUser);
          const expiryTime = parseInt(storedTokenExpiry);
          
          // Check if token is expired
          if (Date.now() < expiryTime) {
            setUser(parsedUser);
            setTokens({
              accessToken: storedAccessToken,
              refreshToken: storedRefreshToken,
              expiresIn: Math.floor((expiryTime - Date.now()) / 1000),
              tokenType: 'Bearer',
            });
          } else {
            // Token expired, try to refresh
            refreshToken().then(success => {
              if (!success) {
                clearAuth();
              }
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!tokens?.accessToken) return;

    const refreshInterval = setInterval(() => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry);
        const timeUntilExpiry = expiryTime - Date.now();
        
        // Refresh if token expires in less than 2 minutes
        if (timeUntilExpiry < 2 * 60 * 1000) {
          refreshToken();
        }
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(refreshInterval);
  }, [tokens]);

  const clearAuth = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { user, tokens } = data.data;
        
        // Store in state
        setUser(user);
        setTokens(tokens);
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        // Calculate and store expiry time
        const expiryTime = Date.now() + (tokens.expiresIn * 1000);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
        
        return;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { user, tokens } = data.data;
        
        // Store in state
        setUser(user);
        setTokens(tokens);
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        // Calculate and store expiry time
        const expiryTime = Date.now() + (tokens.expiresIn * 1000);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
        
        return;
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        clearAuth();
        return false;
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.data?.tokens) {
        const { tokens } = data.data;
        
        // Update tokens in state
        setTokens(tokens);
        
        // Update localStorage
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        // Update expiry time
        const expiryTime = Date.now() + (tokens.expiresIn * 1000);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
        
        return true;
      } else {
        clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuth();
      return false;
    }
  };

  const checkAuth = (): boolean => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) return false;
    
    const expiryTime = parseInt(tokenExpiry);
    return Date.now() < expiryTime;
  };

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated: !!user && checkAuth(),
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}