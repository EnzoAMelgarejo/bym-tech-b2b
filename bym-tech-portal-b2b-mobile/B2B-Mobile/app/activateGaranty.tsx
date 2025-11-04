// app/auth/Register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ScrollView } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import Footer from '../components/footer';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const FormRequest = () => {
  const [numeroGarantia, setNumeroGarantia] = useState('');
  const [codigoActivacion, setCodigoActivacion] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleRegister = async () => {
    // Validaciones
    if (!numeroGarantia || !codigoActivacion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (!isVerified) {
      Alert.alert("Error", "Por favor verifica que no eres un robot.");
      return;
    }

    // Lógica para registrar al usuario (conectarse al backend)
    Alert.alert("Registro exitoso", "Formulario enviado con éxito");
  };

  const onVerify = async () => {
    if (!executeRecaptcha) {
      Alert.alert("Error", "Error de verificación de reCAPTCHA");
      return;
    }
    const token = await executeRecaptcha('your-recaptcha-site-key'); // Cambiar por clave de reCAPTCHA
    if (token) {
      setIsVerified(true);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Pressable style={styles.buttonTitle}>
          <Text style={{ color: '#ffff', fontSize: 16 }}>Activacion de garantia</Text>
          <SimpleLineIcons name="options" size={20} color="white" />
        </Pressable>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Número de garantía</Text>
          <TextInput
            style={styles.input}
            value={numeroGarantia}
            onChangeText={setNumeroGarantia}
          />

          <Text style={styles.label}>Código de activación</Text>
          <TextInput
            style={styles.input}
            value={codigoActivacion}
            onChangeText={setCodigoActivacion}
          />
        </View>

        <Pressable style={[styles.button, { backgroundColor: '#00C400' }, {alignSelf:'center'}]} onPress={onVerify}>
          <Text style={{ color: '#ffff', fontSize: 14 }}>
            Enviar
          </Text>
        </Pressable>

        <Footer />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 130,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000'
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 30,
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  formContainer: {
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#00C400',  
    width: '45%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonTitle: {
    display: 'flex',
    gap: 25,
    width: 'auto',
    height: 40,
    backgroundColor: '#00C400', 
    padding: 10, 
    borderRadius: 8,
    marginVertical: 15,
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start', 
  }
});

export default FormRequest;
