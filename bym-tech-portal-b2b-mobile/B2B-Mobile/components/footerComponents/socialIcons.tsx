// SocialIcons.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

const platforms = [
  { name: 'facebook', color: '#3b5998' },
  { name: 'twitter', color: '#00acee' },
  { name: 'instagram', color: '#C13584' },
  { name: 'youtube', color: '#ff0000' },
];

// Componente para los íconos sociales
const SocialIcons: React.FC = () => (
  <View style={styles.iconRow}>
    {platforms.map(({ name, color }) => (
      <Link key={name} href={`https://${name}.com`}>
        <Icon name={name} size={24} color={color} style={styles.icon} />
      </Link>
    ))}
  </View>
);

// Estilos
const styles = StyleSheet.create({
  iconRow: {
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
});

export default SocialIcons;
