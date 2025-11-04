import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Text, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { InfoBox } from "@/components/productDetailComponents/infoBox";
import { InfoNav } from "@/components/productDetailComponents/infoNav";
import ProductDetailCard from "@/components/productDetailComponents/productDetailsCard";
import { RecommendedProducts } from "@/components/productDetailComponents/recommendedProducts";
import Footer from "../components/footer";



export const ProductDetails = () => {

  return (
    <ScrollView>
      <View style={styles.container}>
        
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Compra</Text>
          <SimpleLineIcons name="options" size={20} color="white" />
        </Pressable>

        {/*Detalles de la compra*/}
        <ProductDetailCard />

        {/*Seccion de caja informativa*/}
        <InfoBox />

        {/*Barra de navegacion informativa*/}
        <InfoNav />

        {/*Productos Recomendados*/}
        <RecommendedProducts></RecommendedProducts>

        <Footer />

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: "column", 
    padding: 10, 
    paddingVertical: 140, 
    backgroundColor: "#fff",
    flex: 1,
  },
  button: {
    backgroundColor: '#00C400', 
    paddingVertical: 10, 
    paddingHorizontal: 10, 
    borderRadius: 8,
    marginBottom: 25,
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start',
    gap: 40, 
    },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default ProductDetails;
