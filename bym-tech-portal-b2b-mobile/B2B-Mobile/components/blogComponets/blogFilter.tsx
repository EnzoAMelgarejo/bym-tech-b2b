import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Pressable } from "react-native";
import { environment } from "@/configuration/environment";

interface BlogMenuProps {
  selectedCategory: string | null;
  onSelectedCategory: (category: string | null) => void;
}

const BlogMenu: React.FC<BlogMenuProps> = ({ selectedCategory, onSelectedCategory }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    const baseUrl = `${environment.SERVER_URL}/api/controller/blog-category`;
    const params = new URLSearchParams({ one: "false" });
    const url = `${baseUrl}?${params.toString()}`;

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar las categorías");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        throw new Error("Los datos de la API no están en el formato esperado");
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View style={styles.menuContainer}>
      <Text style={styles.menuTitle}>Browse categories:</Text>
      
      {/* Separador gris claro */}
      <View style={styles.separator} />

      {loading ? (
        <ActivityIndicator size="large" color="#00C400" />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <>
          <Pressable onPress={() => onSelectedCategory(null)}>
            <Text
              style={[styles.categoryItem, selectedCategory === null && styles.selectedCategory]}
            >
              Todos
            </Text>
          </Pressable>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() =>
                onSelectedCategory(selectedCategory === category.name ? null : category.name)
              }
            >
              <Text
                style={[styles.categoryItem, selectedCategory === category.name && styles.selectedCategory]}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",  // Posición absoluta para superponerse a otros elementos
    top: 50,  // Ajusta la distancia desde la parte superior
    right: 40,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1,  // Se posiciona encima de otros elementos
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  categoryItem: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedCategory: {
    fontWeight: "bold",
    color: "#FF9C2A",
  },
  separator: {
    height: 1,               // Altura del separador
    backgroundColor: "#D3D3D3", // Color gris claro
    marginVertical: 10,      // Espacio alrededor del separador
  },
});

export default BlogMenu;
