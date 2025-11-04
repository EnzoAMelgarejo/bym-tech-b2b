import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Pressable, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import InputField from '@/components/loginComponents/inputFiled';
import PasswordInput from '@/components/loginComponents/passwordInput';
import Checkbox from '@/components/loginComponents/checkbox';
import LoginButton from '@/components/loginComponents/loginbutton';
import SocialButtonLogin from '@/components/loginComponents/socialButtonLogin';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';

const Login: React.FC = () => {
  const { authenticateUser, loading } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const router = useRouter();
  const handleLogin = async () => {
    await authenticateUser(username, password);
  };


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
    const fetchToken = async () => {
      try {
        if (await isTokenValid()) {
          const storedToken = await AsyncStorage.getItem('token');
          if (storedToken) {
            router.push('/main');
          }
        }
      } catch (error) {
        console.error('Error al obtener el token', error);
      }
    };
    // Redirige automáticamente a la pantalla de inicio de sesión al iniciar la aplicación
    fetchToken()
  })
  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Pressable style={styles.buttonTitle}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Inicio de sesión</Text>
          <SimpleLineIcons name="options" size={20} color="white" />
        </Pressable>

        <InputField label="Usuario" value={username} onChangeText={setUsername} />
        <PasswordInput
          label='Contraseña'
          value={password}
          onChangeText={setPassword}
          showPassword={showPassword}
          onToggleShowPassword={() => setShowPassword(!showPassword)}
        />

        <Checkbox
          label="Guardar contraseña"
          checked={rememberPassword}
          onToggle={() => setRememberPassword(!rememberPassword)}
        />

        <Pressable onPress={() => Alert.alert('Recuperación de contraseña')}>
          <Text style={styles.forgotPassword}>Olvidaste tu contraseña?</Text>
        </Pressable>

        <LoginButton onPress={handleLogin} />

        <Pressable style={styles.createAccountButton} onPress={() => router.push('/register')}>
          <Text style={styles.createAccountText}>Crear cuenta</Text>
        </Pressable>

        <View style={styles.orSeparator}>
          <View style={styles.separatorLine} />
          <Text style={styles.orText}>ó</Text>
          <View style={styles.separatorLine} />
        </View>

        <SocialButtonLogin title="Iniciar sesión con Facebook" onPress={() => Alert.alert('Facebook')} />
        <SocialButtonLogin title="Iniciar sesión con Google" onPress={() => Alert.alert('Google')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A5A5A5',
  },
  loginCard: {
    width: '90%',
    padding: 20,
    backgroundColor: '#DEDEDE',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
    width: 'auto',
    height: 40,
    backgroundColor: '#00C400',
    padding: 10,
    borderRadius: 8,
    marginVertical: 15,
    bottom: 15,
    alignSelf: 'flex-start',
  },
  forgotPassword: {
    color: '#00C400',
    textAlign: 'right',
    marginVertical: 15,
  },
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  orText: {
    width: 30,
    textAlign: 'center',
    color: '#888',
  },
  createAccountButton: {
    backgroundColor: '#00C400',
    borderRadius: 8,
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  createAccountText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
