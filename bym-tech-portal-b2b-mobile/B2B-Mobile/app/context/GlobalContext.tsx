import React, { createContext, useState,ReactNode } from 'react';

// Define la estructura de tu estado global
interface GlobalState {
    codClient: string | undefined;
}
// Define la estructura del contexto, incluyendo el setter
interface GlobalContextProps {
    globalState: GlobalState;
    setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}
// Crea el contexto con el tipo correcto
const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

// Proveedor del contexto
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [globalState, setGlobalState] = useState<GlobalState>({ codClient: undefined });

    return (
        <GlobalContext.Provider value={{ globalState, setGlobalState }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalContext;