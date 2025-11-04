// components/BlogMenu/InstagramSection.tsx
import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

interface InstagramSectionProps {
  instagramImages: any[]; // Lista de URLs de imágenes
}

const InstagramSection: React.FC<InstagramSectionProps> = ({ instagramImages }) => (
  <View>
    <Text style={styles.modalTitle}>Instagram</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {instagramImages.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.instagramImage} />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  instagramImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
});

export default InstagramSection;
