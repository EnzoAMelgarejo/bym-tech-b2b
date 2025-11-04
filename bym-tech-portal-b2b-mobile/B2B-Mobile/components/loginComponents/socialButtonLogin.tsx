import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface SocialButtonProps {
  title: string;
  onPress: () => void;
}

const SocialButtonLogin: React.FC<SocialButtonProps> = ({ title, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.socialButton}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    color: '#00C400',
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 16,
  },
});

export default SocialButtonLogin;
