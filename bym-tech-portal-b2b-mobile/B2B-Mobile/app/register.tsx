import React, { useState } from 'react';
import { View, StyleSheet, Alert, Pressable, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '@/components/loginComponents/inputFiled';
import PasswordInput from '@/components/loginComponents/passwordInput';
import Checkbox from '@/components/loginComponents/checkbox';
import SocialButtonLogin from '@/components/loginComponents/socialButtonLogin';
import { SimpleLineIcons } from '@expo/vector-icons';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const router = useRouter();

  const handleRegister = () => {
    if (username && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        Alert.alert('Las contraseñas no coinciden');
      } else if (!termsAccepted) {
        Alert.alert('Por favor, acepta los términos y condiciones');
      } else {
        Alert.alert('Registro exitoso');
        router.push('/main');
      }
    } else {
      Alert.alert('Por favor, completa todos los campos');
    }
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable style={styles.buttonTitle}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Crear cuenta</Text>
          <SimpleLineIcons name="options" size={20} color="white" />
        </Pressable>

        <InputField label="Usuario" value={username} onChangeText={setUsername} />
        <InputField label="Email" value={email} onChangeText={setEmail} />
        <PasswordInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          showPassword={showPassword}
          onToggleShowPassword={() => setShowPassword(!showPassword)}
        />
        <PasswordInput
          label="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          showPassword={showPassword}
          onToggleShowPassword={() => setShowPassword(!showPassword)}
        />

        <Checkbox
          label="Acepto los términos y condiciones"
          checked={termsAccepted}
          onToggle={() => setTermsAccepted(!termsAccepted)}
        />

        <Pressable style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </Pressable>

        <View style={styles.orSeparator}>
          <View style={styles.separatorLine} />
          <Text style={styles.orText}>ó</Text>
          <View style={styles.separatorLine} />
        </View>

        <SocialButtonLogin title="Regístrate con Facebook" onPress={() => Alert.alert('Facebook')} />
        <SocialButtonLogin title="Regístrate con Google" onPress={() => Alert.alert('Google')} />

        <Pressable style={styles.loginButton} onPress={() => router.push('/login')}>
          <Text style={styles.loginButtonText}>Ya tengo una cuenta</Text>
        </Pressable>
      </ScrollView>
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
    paddingVertical: 50,
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
  registerButton: {
    backgroundColor: '#00C400',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  loginButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#00C400',
    fontSize: 16,
  },
});

export default Register;
