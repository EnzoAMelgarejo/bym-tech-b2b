import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onToggle }) => {
  return (
    <View style={styles.checkboxContainer}>
      <Pressable onPress={onToggle}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
      </Pressable>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00C400',
  },
  checkboxLabel: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default Checkbox;
