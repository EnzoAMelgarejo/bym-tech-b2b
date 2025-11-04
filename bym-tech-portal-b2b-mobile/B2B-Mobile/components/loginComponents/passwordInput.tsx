import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChangeText, showPassword, onToggleShowPassword, label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={onToggleShowPassword} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#888" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#000',
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
});

export default PasswordInput;
