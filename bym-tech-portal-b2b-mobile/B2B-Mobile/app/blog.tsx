import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import BlogList from "@/components/blogComponets/blogList";
import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import BlogMenu from "@/components/blogComponets/blogFilter";
import Footer from "../components/footer";
import { useTranslation } from "react-i18next";

const Blog = () => {
  const { t } = useTranslation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>{t("blog.title")}</Text>
            <SimpleLineIcons name="options" size={20} color="white" />
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: "#FF9C2A" }]}
            onPress={toggleMenu}
          >
            <Text style={styles.buttonText}>{t("blog.filters")}</Text>
            <Ionicons name="options-sharp" size={20} color="white" />
          </Pressable>
        </View>

        {isMenuVisible && (
          <BlogMenu
            selectedCategory={selectedCategory}
            onSelectedCategory={setSelectedCategory}
          />
        )}

        <BlogList selectedCategory={selectedCategory} />

        <Footer />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    marginLeft: 15,
    backgroundColor: "#00C400",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 25,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default Blog;
