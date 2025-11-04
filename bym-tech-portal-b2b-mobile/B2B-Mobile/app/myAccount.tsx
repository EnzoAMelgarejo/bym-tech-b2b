// app/auth/Register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ScrollView, KeyboardTypeOptions } from 'react-native';
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Footer from '../components/footer';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  postalCode: string;
  businessName: string;
  annualIncome: string;
  password: string;
  confirmPassword: string;
}

const FormRequest: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    postalCode: '',
    businessName: '',
    annualIncome: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;
    if (Object.values(formData).some((field) => !field)) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Correo electrónico inválido");
      return false;
    }
    if (!/^\d+$/.test(phone)) {
      Alert.alert("Error", "Teléfono inválido. Solo se permiten números.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleRegister = () => {
    if (validateForm()) {
      Alert.alert("Registro exitoso", `Bienvenido, ${formData.firstName} ${formData.lastName}`);
    }
  };

  const PasswordInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        secureTextEntry={!showPassword}
        placeholder={label}
      />
      <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
      </Pressable>
    </View>
  );

  const InputField: React.FC<{ label: string; value: string; onChange: (value: string) => void; keyboardType?: KeyboardTypeOptions }> = ({
    label,
    value,
    onChange,
    keyboardType = "default",
  }) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType={keyboardType} />
    </>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Pressable style={styles.buttonTitle}>
          <Text style={{ color: '#ffff', fontSize: 16 }}>Solicitud de formularios</Text>
          <SimpleLineIcons name="options" size={20} color="white" />
        </Pressable>

        <View style={styles.formContainer}>
          <InputField label="Nombre" value={formData.firstName} onChange={(value) => handleInputChange('firstName', value)} />
          <InputField label="Apellido" value={formData.lastName} onChange={(value) => handleInputChange('lastName', value)} />
          <InputField label="Mail" value={formData.email} onChange={(value) => handleInputChange('email', value)} keyboardType="email-address" />
          <InputField label="Teléfono" value={formData.phone} onChange={(value) => handleInputChange('phone', value)} keyboardType="phone-pad" />

          <Text style={styles.label}>País</Text>
          <Picker
            selectedValue={formData.country}
            style={styles.input}
            onValueChange={(value) => handleInputChange('country', value as string)}
          >
            <Picker.Item label="Selecciona un país" value="" />
            <Picker.Item label="Argentina" value="argentina" />
            <Picker.Item label="Chile" value="chile" />
            <Picker.Item label="Colombia" value="colombia" />
          </Picker>

          <InputField label="Dirección" value={formData.address} onChange={(value) => handleInputChange('address', value)} />
          <InputField label="Código Postal" value={formData.postalCode} onChange={(value) => handleInputChange('postalCode', value)} keyboardType="numeric" />
          <InputField label="Nombre de Empresa/Razón Social" value={formData.businessName} onChange={(value) => handleInputChange('businessName', value)} />
          <InputField label="Ingresos Anuales Registrados" value={formData.annualIncome} onChange={(value) => handleInputChange('annualIncome', value)} keyboardType="numeric" />

          <PasswordInput label="Contraseña" value={formData.password} onChange={(value) => handleInputChange('password', value)} />
          <PasswordInput label="Confirmar Contraseña" value={formData.confirmPassword} onChange={(value) => handleInputChange('confirmPassword', value)} />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={[styles.button, { backgroundColor: '#00C400' }]} onPress={handleRegister}>
            <Text style={{ color: '#ffff', fontSize: 14 }}>Registrar Usuario</Text>
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
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    flex: 1,
  },
  formContainer: {
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#00C400',
    width: '90%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
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
    alignSelf: 'flex-start',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 13,
  },
});

export default FormRequest;
