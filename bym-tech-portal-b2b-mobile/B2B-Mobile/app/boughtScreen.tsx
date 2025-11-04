import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import Footer from "@/components/footer";
import { useTranslation } from "react-i18next";

const Bought: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Image style={styles.image} source={require("../assets/images/task.png")} />
          <Text style={styles.title}>{t("thanksForYourPurchase")}</Text>
          <Text style={styles.label}>{t("orderOnItsWay")}</Text>
          <Link href="/main" style={styles.button}>
            <Text style={styles.buttonText}>{t("continueShopping")}</Text>
          </Link>
        </View>
        <Footer />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 100,
    marginTop: 150,
  },
  content: {
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#555555",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#EF8216",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Bought;
