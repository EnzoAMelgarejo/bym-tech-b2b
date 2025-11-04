import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Text, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import lightbulbImage from "../../assets/images/lightbulb.png";

type Product = {
  id: number;
  title: string;
  visits: number;
  quantity: number;
  price: number;
  image: any; // Cambiado a `any` para aceptar importaciones de imágenes
};

export const RecommendedProducts: React.FC<Product> = ({ id, title, visits, quantity, price, image }) => {
  
    const [products, setProducts] = useState<Product[]>([
        {
          id: 1,
          title: "Producto 1",
          visits: 4,
          quantity: 1,
          price: 33.33,
          image: lightbulbImage,
        },
        {
          id: 2,
          title: "Producto 2",
          visits: 3,
          quantity: 1,
          price: 33.33,
          image: lightbulbImage,
        },
        {
          id: 3,
          title: "Producto 3",
          visits: 5,
          quantity: 1,
          price: 33.33,
          image: lightbulbImage,
        },
      ]);

      const handleIncrement = (id: number) => {
        setProducts(products.map(product => product.id === id ? { ...product, quantity: product.quantity + 1 } : product));
      };
    
      const handleDecrement = (id: number) => {
        setProducts(products.map(product => product.id === id && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product));
      };
    
      const handleRemoveProduct = (id: number) => {
        setProducts(products.filter(product => product.id !== id));
      };
    
      const handleAddAll = () => {
        setProducts(products.map(product => ({ ...product, quantity: product.quantity + 1 })));
      };
  
    return(
        <View>
        {/* Sección de Productos recomendados */}
        <View style={styles.interestContainer}>
          <Text style={styles.title}>Podría interesarte</Text>
          <View style={styles.columnsContainer}>
            {/* Columna izquierda (Cards de productos recomendados) */}
            <View style={styles.productsColumn}>
              <ScrollView>
                {products.map((product) => (
                  <View key={product.id} style={styles.card}>
                    
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{product.title}</Text>
                      
                      <View style={styles.starsContainer}>
                        {[...Array(5)].map((_, i) => (
                          <FontAwesome
                            key={i}
                            name={i < product.visits ? "star" : "star-o"}
                            size={20}
                            color="#ffd700"
                          />
                        ))}
                      </View>

                      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    </View>

                    <View style={styles.counterContainer}>
                      <Pressable onPress={() => handleDecrement(product.id)} style={styles.counterButton}>
                        <Text style={styles.counterButtonText}>-</Text>
                      </Pressable>
                      <Text style={styles.quantity}>{product.quantity}</Text>
                      <Pressable onPress={() => handleIncrement(product.id)} style={styles.counterButton}>
                        <Text style={styles.counterButtonText}>+</Text>
                      </Pressable>
                    </View>

                    {/* Botón de eliminar */}
                    <Pressable onPress={() => handleRemoveProduct(product.id)} style={styles.removeButton}>
                      <FontAwesome name="times" size={24} color="red" />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Columna derecha */}
            <View style={styles.pricesColumn}>
              <Text style={styles.totalPrice}>Precio Total: ${products.reduce((total, product) => total + product.quantity * product.price, 0).toFixed(2)}</Text>
              <Pressable style={styles.button} onPress={handleAddAll}>
                <Text style={styles.buttonText}>Agregar todo</Text>
              </Pressable>
              <Text style={styles.wishlistText}>Agregar a la lista de deseos</Text>
            </View>
          </View>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    interestContainer: { 
      padding: 10,
      marginTop: 100,
    },
    title: { 
      fontSize: 18, 
      fontWeight: "bold", 
      marginBottom: 8,
      justifyContent: 'flex-start'
    },
    columnsContainer: { 
      flexDirection: "column", 
      alignItems: "center" 
    },
    productsColumn: { 
      width: "100%" 
    },
    pricesColumn: { 
      marginTop: 20, 
      padding: 8, 
      alignItems: "center",
      backgroundColor: "#f0f0f0",
      borderRadius: 8, 
    },
    card: { 
      flexDirection: "row", 
      padding: 10, 
      marginVertical: 6, 
      backgroundColor: "#f0f0f0", 
      borderRadius: 8, 
      alignItems: "center",
    },
    cardImage: { 
      width: 45, 
      height: 45, 
      borderRadius: 6, 
      marginRight: 8 
    },
    cardContent: { 
      flex: 1 
    },
    cardTitle: { 
      fontSize: 14, 
      fontWeight: "bold" 
    },
    starsContainer: { 
      flexDirection: "row", 
      marginVertical: 3 
    },
    price: { 
      fontSize: 14, 
      color: "#00C400", 
      fontWeight: "bold" 
    },
    counterContainer: { 
      flexDirection: "row", 
      alignItems: "center", 
      marginTop: 6 
    },
    counterButton: { 
      padding: 5, 
      backgroundColor: "#d9d9d9", 
      borderRadius: 4, 
      marginHorizontal: 5 
    },
    counterButtonText: { 
      fontSize: 16 
    },
    quantity: { 
      fontSize: 14 
    },
    removeButton: { 
      marginLeft: "auto", 
      padding: 6 
    },
    totalPrice: { 
      fontSize: 16, 
      fontWeight: "bold", 
      marginBottom: 10,
      color: "#00C400",
    },
    button: { 
      backgroundColor: "#00C400", 
      padding: 10, 
      borderRadius: 5, 
      alignItems: "center",
      width: "90%"
    },
    buttonText: { 
      color: "white", 
      fontWeight: "bold",
      fontSize: 14 
    },
    wishlistText: { 
      color: "#00C400", 
      fontSize: 12, 
      marginTop: 10 
    },  
});
  