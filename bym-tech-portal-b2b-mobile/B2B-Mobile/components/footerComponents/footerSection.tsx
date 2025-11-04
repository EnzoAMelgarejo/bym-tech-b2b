// FooterSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

type Section = {
  title: string;
  items: { label: string; path: string }[];
};

const FooterSection: React.FC<Section> = ({ title, items }) => (
  <View style={styles.column}>
    <Text style={styles.title}>{title}</Text>
    {items.map((item, index) => (
      <Link href={item.path} key={index} style={styles.label}>
        {item.label}
      </Link>
    ))}
  </View>
);

// Estilos
const styles = StyleSheet.create({
  column: {
    flex: 1,
    padding: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
});

export default FooterSection;
