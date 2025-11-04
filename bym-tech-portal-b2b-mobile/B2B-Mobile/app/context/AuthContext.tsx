import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '@/configuration/environment';
import { useRouter } from 'expo-router';

interface AuthContextProps {
    authenticated: boolean;
    loading: boolean;
    authenticateUser: (username: string, password: string) => Promise<void>;
    logUserOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const authenticateUser = async (username: string, password: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                one: 'false',
            });
            const response = await fetch(`${environment.SERVER_URL}/api/controller/login?${params.toString()}`, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ password, username }),
            });

            const data = await response.json();
            console.log(data);
            if (data.token) {
                await AsyncStorage.setItem('token', data.token); // Guarda el token
                await AsyncStorage.setItem('userId', data.id.toString()); // Guarda el ID de usuario
                await AsyncStorage.setItem('codClient', data.codeClient || '000001'); // Guarda el código de cliente
                await AsyncStorage.setItem('tokenExpiration', (data.exp * 1000).toString()); // exp viene en segundos, convertir a milisegundos

                setAuthenticated(true);
                router.push('/');
            }
        } catch (error) {
            console.error('Authentication error:', error);
        } finally {
            setLoading(false);
        }
    };

    const logUserOut = async () => {
        await AsyncStorage.removeItem('token');
        setAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ authenticated, loading, authenticateUser, logUserOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Exportación por defecto
export default AuthProvider;

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};
