import React, { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { View, StatusBar } from "react-native";
import { Slot } from 'expo-router';
import Navbar from "@/components/navbar";
import { UserProvider } from "@/components/userContext";
import AuthProvider from "./context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    const isTokenValid = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const expiration = await AsyncStorage.getItem('tokenExpiration');

        if (!token || !expiration) return false;

        const currentTime = new Date().getTime();
        return currentTime < parseInt(expiration, 10);
      } catch (error) {
        console.error('Error al validar el token:', error);
        return false;
      }
    };
    // Recuperar el token almacenado en AsyncStorage
    const fetchToken = async () => {
      try {
        if (await isTokenValid()) {
          const storedToken = await AsyncStorage.getItem('token');
          if (storedToken) {
            setToken(storedToken);  // Guarda el token en el estado
          }
        } else {
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');

        console.error('Error al obtener el token', error);
      }
    };
    // Redirige automáticamente a la pantalla de inicio de sesión al iniciar la aplicación
    fetchToken()
  }, []);

  // Verifica si la ruta actual es '/login' para ocultar el Navbar
  const isLoginScreen = segments[0] === 'login' || segments[0] === 'register';

  return (
    //@ts-ignore
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
      <View style={{ flex: 1 }}>
        <UserProvider>
          <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
          {/* Solo muestra el Navbar si no estás en la pantalla de inicio de sesión */}
          {!isLoginScreen && <Navbar />}
          <Slot />
        </UserProvider>
      </View>
      </I18nextProvider>
    </AuthProvider>
  );
}
