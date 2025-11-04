// components/BlogMenu/PopularPost.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface PopularPostProps {
  image: any; // Se asume que la imagen es un URL
  title: string;
}

const PopularPost: React.FC<PopularPostProps> = ({ image, title }) => (
  <View style={styles.popularPostRow}>
    <Image source={image} style={styles.popularImage} />
    <Text style={styles.popularTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  popularPostRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  popularImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 5,
  },
  popularTitle: {
    fontSize: 16,
    color: "#333",
  },
});

export default PopularPost;
