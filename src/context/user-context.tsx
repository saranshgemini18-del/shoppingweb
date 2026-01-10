
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/data';
import { users as mockUsers } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

type UserContextType = {
  users: User[];
  addUser: (userData: Omit<User, 'id' | 'registeredAt'>) => User;
  verifyUser: (email: string) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}

const getInitialUsers = (): User[] => {
    if (typeof window === 'undefined') {
        return mockUsers;
    }
    try {
        const item = window.localStorage.getItem('users');
        if (item === null) {
            window.localStorage.setItem('users', JSON.stringify(mockUsers));
            return mockUsers;
        }
        return item ? JSON.parse(item) : mockUsers;
    } catch (error) {
        console.warn(`Error reading localStorage key “users”:`, error);
        return mockUsers;
    }
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUsers(getInitialUsers());
    setIsLoading(false);
  }, []);

  useEffect(() => {
     if (typeof window !== 'undefined' && !isLoading) {
        try {
            window.localStorage.setItem('users', JSON.stringify(users));
        } catch (error) {
            console.warn('Error setting localStorage key “users”:', error);
        }
    }
  }, [users, isLoading]);

  const addUser = (userData: Omit<User, 'id' | 'registeredAt'>): User => {
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      registeredAt: new Date().toISOString(),
      isVerified: false,
    };
    setUsers(prevUsers => [newUser, ...prevUsers]);
    return newUser;
  };
  
  const verifyUser = (email: string) => {
    setUsers(prevUsers => 
        prevUsers.map(user => 
            user.email === email ? { ...user, isVerified: true } : user
        )
    );
  };

  const value = {
    users,
    addUser,
    verifyUser,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
