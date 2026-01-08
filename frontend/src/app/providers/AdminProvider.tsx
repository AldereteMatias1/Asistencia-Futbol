import React from 'react';
import { ADMIN_KEY_STORAGE, clearAdminKey } from '../../lib/api';

const AdminContext = React.createContext<{
  adminKey: string | null;
  isAdmin: boolean;
  setAdminKey: (key: string) => void;
  logout: () => void;
} | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminKey, setAdminKeyState] = React.useState<string | null>(null);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) {
      setAdminKeyState(stored);
    }

    const handleClear = () => setAdminKeyState(null);
    window.addEventListener('admin-key-cleared', handleClear);
    return () => window.removeEventListener('admin-key-cleared', handleClear);
  }, []);

  const setAdminKey = (key: string) => {
    window.localStorage.setItem(ADMIN_KEY_STORAGE, key);
    setAdminKeyState(key);
  };

  const logout = () => {
    clearAdminKey();
    setAdminKeyState(null);
  };

  return (
    <AdminContext.Provider
      value={{
        adminKey,
        isAdmin: Boolean(adminKey),
        setAdminKey,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = React.useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return ctx;
};
