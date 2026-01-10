
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/data';
import { useUsers } from './user-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users } = useUsers();
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = window.sessionStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.warn('Error reading sessionStorage for currentUser:', error);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      if (!user.isVerified) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Please verify your email address before logging in.',
        });
        return false;
      }

      setCurrentUser(user);
      try {
        window.sessionStorage.setItem('currentUser', JSON.stringify(user));
      } catch (error) {
         console.warn('Error setting sessionStorage for currentUser:', error);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
        window.sessionStorage.removeItem('currentUser');
    } catch (error) {
        console.warn('Error removing sessionStorage for currentUser:', error);
    }
    router.push('/');
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    isLoading: isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
