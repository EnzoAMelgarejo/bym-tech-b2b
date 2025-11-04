import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Pressable } from "react-native";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";

const CheckoutSummary: React.FC = () => {
  const { t } = useTranslation();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [total, setTotal] = useState(100); // Total inicial
  const [shippingCost, setShippingCost] = useState(10); // Costo de envío inicial

  const handleUpdateTotal = () => {
    const updatedTotal = 100 + shippingCost;
    setTotal(updatedTotal);
  };

  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.title}>{t("total")}</Text>
      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.label}>{t("subtotal")}:</Text>
        <Text style={styles.price}>$100.00</Text>
      </View>
      <View style={styles.separator} />

      <Text style={styles.label}>{t("shippingCalculation")}:</Text>
      <TextInput
        placeholder={t("country")}
        value={country}
        onChangeText={setCountry}
        style={styles.input}
      />
      <TextInput
        placeholder={t("city")}
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <TextInput
        placeholder={t("postalCode")}
        value={postalCode}
        onChangeText={setPostalCode}
        style={styles.input}
      />
      <Pressable style={styles.updateButton} onPress={handleUpdateTotal}>
        <Text style={styles.updateButtonText}>{t("updateTotal")}</Text>
      </Pressable>
      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.label}>{t("total")}:</Text>
        <Text style={styles.price}>${total.toFixed(2)}</Text>
      </View>
      <View style={styles.separator} />

      <Link href="/boughtScreen" style={styles.purchaseButton}>
        <Text style={styles.purchaseButtonText}>{t("makePurchase")}</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    alignSelf: "center",
    padding: 15,
    marginVertical: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#d9d9d9",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    borderRadius: 6,
    padding: 8,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  updateButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  updateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  purchaseButton: {
    backgroundColor: "#FAAD3D",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  purchaseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CheckoutSummary;
