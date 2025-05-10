import { useState, useEffect } from 'react';
import { User } from '../types';
import { getFromStorage, saveToStorage } from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const storedUser = await getFromStorage<User>('user');
        setUser(storedUser || null);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to storage when it changes
  const login = async (userData: User) => {
    try {
      await saveToStorage('user', userData);
      setUser(userData);
      return true;
    } catch (err) {
      setError('Failed to save user data');
      console.error(err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await saveToStorage('user', null);
      setUser(null);
      return true;
    } catch (err) {
      setError('Failed to logout');
      console.error(err);
      return false;
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
