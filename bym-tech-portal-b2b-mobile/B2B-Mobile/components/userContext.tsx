// UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'cliente' | 'vendedor' | 'vendedorRepresentante';

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('cliente'); // Valor inicial
  const [userName, setUserName] = useState<string>('Usuario'); // Valor inicial

  return (
    <UserContext.Provider value={{ role, setRole, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser debe estar dentro de UserProvider');
  return context;
};
