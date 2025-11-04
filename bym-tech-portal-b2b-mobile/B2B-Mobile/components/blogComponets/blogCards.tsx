// components/BlogCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import CommentIcon from "./comments";

// Ajusta las propiedades para incluir categorías y comentarios
type BlogPost = {
  id: number;
  title: string;
  content: string;
  user: {name: string};
  createdAt: string;
  commentsCount: number;
  postId: number;
  likesCount: number;
  img: string; // Cambiar 'any' a 'string' para representar una URL de imagen
  category?: { name: string }; // Categoría opcional
  comments?: Array<{ content: string; author: string }>; // Comentarios opcionales
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  // Hacer un console.log para ver el valor de uri
  console.log("uri:", post.img);

  return (
    <Link href={`/blog/${post.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        {/* Modificación aquí: pasar el coverImage como un objeto con la propiedad uri */}
        <Image
  source={{ uri: post.img }}
  style={styles.image}
  onError={(e) => console.error("Error loading image:", e.nativeEvent.error)}
/>

        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.author}>{post.user.name}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.date}>{post.createdAt}</Text>
            <Text style={styles.separator}>|</Text>
            <CommentIcon commentsCount={post.commentsCount} postId={post.id} />
            <Text style={styles.separator}>|</Text>
            <Text style={styles.likes}>
              <FontAwesome name="thumbs-up" size={14} color="#888" /> {post.likesCount}
            </Text>
          </View>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.content}</Text>
          {/* Mostrar la categoría si está presente */}
          {post.category && <Text style={styles.category}>Categoría: {post.category.name}</Text>}
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.8,
  },
  image: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9C2A",
  },
  separator: {
    marginHorizontal: 5,
    color: "#888",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  comments: {
    fontSize: 12,
    color: "#888",
  },
  likes: {
    fontSize: 12,
    color: "#888",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  category: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
});

export default BlogCard;
