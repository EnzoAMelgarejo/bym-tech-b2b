import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import Footer from "../components/footer";
import CheckoutSummary from "@/components/cartComponents/checkoutSummary";
import CartList from "@/components/cartComponents/cartList";
import { environment } from "@/configuration/environment";
import { useAuth } from "./context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Product = {
  id: number;
  name: string;
  quant: number;
  price: number;
  image: string;
};

const Cart: React.FC = () => {
  const { authenticated, loading: authLoading, logUserOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const baseUrl = `${environment.SERVER_URL}/api/controller`; // URL base de la API

  // Obtener el token de AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        setToken(savedToken);
      } catch (error) {
        setError("Error al obtener el token.");
      }
    };

    if (authenticated) {
      getToken();
    }
  }, [authenticated]);

  // Función de fetch para consumir las APIs
  const fetchData = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${baseUrl}/${endpoint}`;
    setLoading(true);

    if (!token) {
      setError("Token no disponible. El usuario no está autenticado.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          token, // Usa el token desde AsyncStorage
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Error al obtener los datos: ${error.message}`);
      setLoading(false);
      return null;
    }
  };

  // Obtener productos del carrito al montar el componente
  useEffect(() => {
    if (authenticated && token) {
      fetchCartItems();
    } else {
      setError("Por favor, inicia sesión para ver tu carrito.");
    }
  }, [authenticated, token]);

  // Función para obtener los productos del carrito
  const fetchCartItems = async () => {
    const data = await fetchData("order", { method: "GET" });
    if (data?.itemsOrder) {
      setProducts(data.itemsOrder);
      calculateSubtotal(data.itemsOrder);
    } else {
      setError("Error al obtener los datos del carrito.");
    }
  };

  // Funciones para manejar incremento y decremento de productos
  const handleIncrement = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quant: product.quant + 1 } : product
      )
    );
    calculateSubtotal();
  };

  const handleDecrement = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id && product.quant > 1
          ? { ...product, quant: product.quant - 1 }
          : product
      )
    );
    calculateSubtotal();
  };

  // Calcular el subtotal
  const calculateSubtotal = (updatedProducts = products) => {
    const newSubtotal = updatedProducts.reduce(
      (acc, product) => acc + product.price * product.quant,
      0
    );
    setSubtotal(newSubtotal);
    setTotal(newSubtotal); // Agregar cálculo de envío si es necesario
  };

  // Eliminar un producto del carrito
  const handleRemoveProduct = async (id: number) => {
    const data = await fetchData("itemsOrder", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (data) {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      calculateSubtotal();
    } else {
      setError("Error al eliminar el producto del carrito.");
    }
  };

  // Realizar el checkout
  const handleCheckout = async () => {
    const data = await fetchData("order", {
      method: "POST",
      body: JSON.stringify({
        total,
        items: products,
      }),
    });
    if (data) {
      setProducts([]);
      setSubtotal(0);
      setTotal(0);
    } else {
      setError("Error al procesar la compra.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      {loading && <Text style={styles.loading}>Cargando...</Text>}
      <CartList
        products={products}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemoveProduct}
      />
      <CheckoutSummary subtotal={subtotal} total={total} onCheckout={handleCheckout} />
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 150,
    padding: 10,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 16,
  },
  loading: {
    color: "gray",
    marginBottom: 16,
  },
});

export default Cart;
