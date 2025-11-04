import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { environment } from "@/configuration/environment";
import BlogCard from "./blogCards";

interface BlogListProps {
  selectedCategory: string | null;
}

const BlogList: React.FC<BlogListProps> = ({ selectedCategory }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      const baseUrl = `${environment.SERVER_URL}/api/controller/blog`;
      const params = new URLSearchParams({ one: "false" });
      const url = `${baseUrl}?${params.toString()}`;

      setLoading(true);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedData = data.map((item) => ({
            ...item,
            category: item.category || { name: "Sin categoría" },
            commentsCount: item.comments ? item.comments.length : 0,
            likesCount: item.likesCount || 0,
          }));
          setPosts(formattedData);
        } else {
          setPosts([]);
        }
      } catch (error: any) {
        setError("Error al cargar los posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtra los posts por categoría seleccionada
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category.name === selectedCategory)
    : posts;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C400" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {filteredPosts.map((item) => (
        <BlogCard key={item.id.toString()} post={item} />
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default BlogList;
