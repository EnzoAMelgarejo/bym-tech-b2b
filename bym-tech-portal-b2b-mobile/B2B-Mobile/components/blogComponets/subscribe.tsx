// components/BlogMenu/SubscribeSection.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

const SubscribeSection: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  return (
    <View style={styles.subscribeSection}>
      <Text style={[styles.modalTitle, { textAlign: 'center' }]}>Subscribe</Text>
      <Text style={styles.subscribeLabel}>
        And stay up to date with trends for your home
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <Pressable style={styles.subscribeButton}>
        <Text style={styles.subscribeButtonText}>SUBSCRIBE</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  subscribeSection: {
    marginVertical: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
  },
  subscribeLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderBottomWidth: 1,
    borderBottomEndRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  subscribeButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  subscribeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",        // Un color oscuro para contraste
    textAlign: "center",  // Centra el título
    marginBottom: 15,     // Espacio debajo del título
  },
});

export default SubscribeSection;
