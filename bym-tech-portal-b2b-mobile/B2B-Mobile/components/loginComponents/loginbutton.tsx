import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface LoginButtonProps {
  onPress: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: '#00C400' }
      ]}
      onPress={onPress}>
      <Text style={styles.buttonText}>Ingresar</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginButton;
