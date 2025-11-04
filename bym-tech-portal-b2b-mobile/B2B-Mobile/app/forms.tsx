import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ScrollView } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import Footer from '../components/footer';
import { useTranslation } from 'react-i18next';

const FormRequest = () => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !phone) {
      Alert.alert(t("alerts.errorTitle"), t("alerts.errorRequiredFields"));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert(t("alerts.errorTitle"), t("alerts.errorInvalidEmail"));
      return;
    }
    if (!/^\d+$/.test(phone)) {
      Alert.alert(t("alerts.errorTitle"), t("alerts.errorInvalidPhone"));
      return;
    }
    Alert.alert(t("alerts.successTitle"), t("alerts.successMessage", { firstName, lastName }));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Pressable style={styles.buttonTitle}>
          <Text style={{ color: '#ffff', fontSize: 16 }}>{t("formTitle")}</Text>
          <SimpleLineIcons name="options" size={20} color="white" />
        </Pressable>

        <View style={styles.formContainer}>
          <Text style={styles.label}>{t("fields.firstName")}</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

          <Text style={styles.label}>{t("fields.lastName")}</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

          <Text style={styles.label}>{t("fields.email")}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>{t("fields.phone")}</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={[styles.button, { backgroundColor: '#FF9C2A' }]} onPress={handleRegister}>
            <Text style={{ color: '#ffff', fontSize: 14 }}>{t("buttons.submitForm")}</Text>
          </Pressable>

          <Pressable style={[styles.button, { backgroundColor: '#00C400' }]} onPress={handleRegister}>
            <Text style={{ color: '#ffff', fontSize: 14 }}>{t("buttons.uploadForm")}</Text>
          </Pressable>
        </View>

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
    marginBottom: 0,
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
    backgroundColor: '#f0f0f0', // Color de fondo gris claro
    borderColor: '#ddd',
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  formContainer: {
    padding: 10,
    marginTop: 20,
    marginBottom: 20, // Espacio entre el formulario y los botones
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#00C400',  
    width: '45%', // Ajustado para un mejor diseño
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
